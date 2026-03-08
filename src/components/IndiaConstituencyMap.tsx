import { memo, useState, useCallback, useMemo, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Sphere,
} from "react-simple-maps";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const GEO_URL = "/india_pc_2019_simplified.geojson";

// Party hex colors for the map fills
const PARTY_HEX: Record<string, string> = {
  BJP: "#f97316",
  INC: "#3b82f6",
  SP: "#ef4444",
  TMC: "#16a34a",
  DMK: "#dc2626",
  TDP: "#eab308",
  "JD(U)": "#22c55e",
  "SS (UBT)": "#fb923c",
  "Shiv Sena": "#ea580c",
  NCP: "#60a5fa",
  YSRCP: "#1d4ed8",
  AAP: "#06b6d4",
  BJD: "#4ade80",
  RJD: "#15803d",
  "CPI(M)": "#b91c1c",
  CPI: "#dc2626",
  JKNC: "#dc2626",
  IND: "#6b7280",
  SAD: "#3b82f6",
  NPP: "#eab308",
  "LJP(RV)": "#3b82f6",
  IUML: "#16a34a",
  "KC(M)": "#eab308",
  RSP: "#dc2626",
  VCK: "#1e40af",
  AGP: "#4ade80",
  UPPL: "#8b5cf6",
  JMM: "#16a34a",
  NC: "#b91c1c",
  PDP: "#15803d",
  AIUDF: "#22c55e",
  "HAM(S)": "#eab308",
  SKM: "#ef4444",
  NDPP: "#3b82f6",
  ZPM: "#22c55e",
  MNF: "#3b82f6",
  NPF: "#3b82f6",
  UDP: "#8b5cf6",
  Congress: "#3b82f6",
};

const DEFAULT_COLOR = "#d1d5db";
const HOVER_STROKE = "#000";

interface ConstituencyData {
  party: string;
  mp: string;
  candidateId?: string;
}

interface Props {
  data?: Record<string, ConstituencyData>;
  onConstituencyClick?: (name: string) => void;
}

// Normalize names for matching: uppercase, remove extra spaces, handle common variations
function normalizeName(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const IndiaConstituencyMap = memo(({ data, onConstituencyClick }: Props) => {
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([82, 22]);

  // Build a normalized lookup from the data prop
  const normalizedData = useMemo(() => {
    if (!data) return {};
    const map: Record<string, ConstituencyData> = {};
    Object.entries(data).forEach(([key, val]) => {
      map[normalizeName(key)] = val;
    });
    return map;
  }, [data]);

  const findMatch = useCallback(
    (pcName: string): ConstituencyData | undefined => {
      const norm = normalizeName(pcName);
      return normalizedData[norm];
    },
    [normalizedData]
  );

  const getFillColor = useCallback(
    (pcName: string) => {
      const match = findMatch(pcName);
      if (!match) return DEFAULT_COLOR;
      return PARTY_HEX[match.party] || DEFAULT_COLOR;
    },
    [findMatch]
  );

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z * 1.5, 12)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z / 1.5, 1)), []);
  const handleReset = useCallback(() => {
    setZoom(1);
    setCenter([82, 22]);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden border border-border bg-white"
      style={{ minHeight: "500px" }}
      onMouseMove={handleMouseMove}
    >
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <Button size="icon" variant="outline" className="h-8 w-8 bg-card" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" className="h-8 w-8 bg-card" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" className="h-8 w-8 bg-card" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-2 rounded-md text-xs font-medium bg-foreground text-background shadow-lg"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 30,
          }}
        >
          {tooltipContent}
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [82, 22],
        }}
        width={800}
        height={820}
        style={{ width: "100%", height: "auto" }}
      >
        <Sphere id="sphere" fill="#ffffff" stroke="none" strokeWidth={0} />
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ coordinates, zoom: z }) => {
            setCenter(coordinates as [number, number]);
            setZoom(z);
          }}
          minZoom={1}
          maxZoom={12}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const pcName = geo.properties.pc_name || "";
                const match = findMatch(pcName);
                const fill = getFillColor(pcName);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="hsl(var(--border))"
                    strokeWidth={0.4 / zoom}
                    style={{
                      default: { outline: "none" },
                      hover: {
                        outline: "none",
                        fill: fill === DEFAULT_COLOR ? "#bbb" : fill,
                        stroke: HOVER_STROKE,
                        strokeWidth: 1.2 / zoom,
                        filter: "brightness(1.15)",
                      },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => {
                      const label = match
                        ? `${pcName} — ${match.mp} (${match.party})`
                        : pcName;
                      setTooltipContent(label);
                    }}
                    onMouseLeave={() => setTooltipContent("")}
                    onClick={() => {
                      if (onConstituencyClick) onConstituencyClick(pcName);
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
});

IndiaConstituencyMap.displayName = "IndiaConstituencyMap";

export default IndiaConstituencyMap;
