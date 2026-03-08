import { useState, useCallback, useRef, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { useNavigate } from "react-router-dom";

const GEO_URL = "/india_pc_2019_simplified.geojson";

// Party color mapping for map fills
const PARTY_MAP_COLORS: Record<string, string> = {
  "BJP": "#f97316",
  "INC": "#3b82f6",
  "SP": "#ef4444",
  "TMC": "#16a34a",
  "DMK": "#dc2626",
  "TDP": "#eab308",
  "JD(U)": "#22c55e",
  "SS (UBT)": "#fb923c",
  "Shiv Sena": "#ea580c",
  "NCP": "#60a5fa",
  "YSRCP": "#1d4ed8",
  "AAP": "#06b6d4",
  "BJD": "#4ade80",
  "RJD": "#15803d",
  "CPI(M)": "#b91c1c",
  "JKNC": "#dc2626",
  "IND": "#6b7280",
  "Nationalist Congress Party – Sharadchandra Pawar": "#60a5fa",
  "Jammu & Kashmir National Conference": "#dc2626",
};

interface ConstituencyData {
  party: string;
  mp: string;
  candidateId?: string;
}

interface Props {
  constituencyPartyMap?: Record<string, ConstituencyData>;
  onConstituencyClick?: (name: string, data?: ConstituencyData) => void;
}

// Normalize name for matching: uppercase, remove special chars, trim
const normalizeName = (name: string) => 
  name.toUpperCase().replace(/[^A-Z0-9 ]/g, "").replace(/\s+/g, " ").trim();

const IndiaConstituencyMap = memo(({ constituencyPartyMap = {}, onConstituencyClick }: Props) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; state: string; party: string; mp: string } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([82, 22]);
  const navigate = useNavigate();
  const tooltipRef = useRef<typeof tooltip>(null);

  // Build a normalized lookup once
  const normalizedMap = useRef<Record<string, ConstituencyData>>({});
  
  // Rebuild normalized map when constituencyPartyMap changes
  const prevMapRef = useRef(constituencyPartyMap);
  if (prevMapRef.current !== constituencyPartyMap) {
    prevMapRef.current = constituencyPartyMap;
    const nMap: Record<string, ConstituencyData> = {};
    Object.entries(constituencyPartyMap).forEach(([key, val]) => {
      nMap[normalizeName(key)] = val;
      // Also add without common suffixes
      const simplified = normalizeName(key).replace(/ (EAST|WEST|NORTH|SOUTH|CENTRAL)$/, "");
      if (simplified !== normalizeName(key)) {
        nMap[simplified] = val;
      }
    });
    normalizedMap.current = nMap;
  }

  const findData = useCallback((pcName: string): ConstituencyData | undefined => {
    const normalized = normalizeName(pcName);
    return normalizedMap.current[normalized];
  }, []);

  const getColor = useCallback((pcName: string) => {
    const data = findData(pcName);
    if (data?.party) {
      return PARTY_MAP_COLORS[data.party] || "#94a3b8";
    }
    return "#d1d5db";
  }, [findData]);

  const handleMouseEnter = useCallback((e: React.MouseEvent, pcName: string, stName: string) => {
    const data = findData(pcName);
    const newTooltip = {
      x: e.clientX,
      y: e.clientY,
      name: pcName,
      state: stName,
      party: data?.party || "N/A",
      mp: data?.mp || "N/A",
    };
    tooltipRef.current = newTooltip;
    setTooltip(newTooltip);
  }, [findData]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (tooltipRef.current) {
      const newTooltip = { ...tooltipRef.current, x: e.clientX, y: e.clientY };
      tooltipRef.current = newTooltip;
      setTooltip(newTooltip);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    tooltipRef.current = null;
    setTooltip(null);
  }, []);

  const handleClick = useCallback((pcName: string) => {
    const data = findData(pcName);
    if (onConstituencyClick) {
      onConstituencyClick(pcName, data);
    } else if (data?.candidateId) {
      navigate(`/candidate?id=${data.candidateId}`);
    }
  }, [findData, onConstituencyClick, navigate]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.5, 8));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.5, 1));
  }, []);

  const handleMoveEnd = useCallback(({ zoom: z, coordinates }: { zoom: number; coordinates: [number, number] }) => {
    setZoom(z);
    setCenter(coordinates);
  }, []);

  return (
    <div className="relative w-full" style={{ aspectRatio: "3/4", maxHeight: "650px" }}>
      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-lg bg-card border border-border text-foreground flex items-center justify-center text-lg font-bold hover:bg-muted transition-colors shadow-sm"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-lg bg-card border border-border text-foreground flex items-center justify-center text-lg font-bold hover:bg-muted transition-colors shadow-sm"
          aria-label="Zoom out"
        >
          −
        </button>
        {zoom > 1 && (
          <button
            onClick={() => { setZoom(1); setCenter([82, 22]); }}
            className="w-9 h-9 rounded-lg bg-card border border-border text-foreground flex items-center justify-center text-xs font-medium hover:bg-muted transition-colors shadow-sm"
            aria-label="Reset zoom"
          >
            ↺
          </button>
        )}
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [82, 22],
        }}
        width={600}
        height={800}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={8}
          translateExtent={[
            [0, 0],
            [600, 800],
          ]}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const pcName = geo.properties.pc_name || "";
                const stName = geo.properties.st_name || "";
                const fillColor = getColor(pcName);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#fff"
                    strokeWidth={0.4 / zoom}
                    style={{
                      default: { outline: "none", opacity: 0.9, cursor: "pointer" },
                      hover: { outline: "none", opacity: 1, strokeWidth: 1.5 / zoom, stroke: "#1e293b", cursor: "pointer" },
                      pressed: { outline: "none", opacity: 0.7 },
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, pcName, stName)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(pcName)}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-card border border-border rounded-lg shadow-xl px-3 py-2 text-xs max-w-[200px]"
          style={{ left: tooltip.x + 14, top: tooltip.y - 50 }}
        >
          <p className="font-bold text-foreground text-sm">{tooltip.name}</p>
          <p className="text-muted-foreground">{tooltip.state}</p>
          {tooltip.mp !== "N/A" && (
            <p className="text-foreground mt-1">
              <span className="font-medium">{tooltip.mp}</span>
              <span className="text-muted-foreground ml-1">({tooltip.party})</span>
            </p>
          )}
          {tooltip.mp === "N/A" && (
            <p className="text-muted-foreground mt-1 italic">No data available</p>
          )}
        </div>
      )}
    </div>
  );
});

IndiaConstituencyMap.displayName = "IndiaConstituencyMap";

export default IndiaConstituencyMap;
