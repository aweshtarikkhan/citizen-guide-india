import { useState, useEffect, useMemo, memo } from "react";
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

const IndiaConstituencyMap = memo(({ constituencyPartyMap = {}, onConstituencyClick }: Props) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; state: string; party: string; mp: string } | null>(null);
  const [zoom, setZoom] = useState(1);
  const navigate = useNavigate();

  const getColor = (pcName: string) => {
    const key = pcName.toUpperCase();
    const data = constituencyPartyMap[key];
    if (data?.party) {
      return PARTY_MAP_COLORS[data.party] || "#94a3b8";
    }
    return "#e2e8f0";
  };

  return (
    <div className="relative w-full" style={{ aspectRatio: "3/4", maxHeight: "600px" }}>
      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <button
          onClick={() => setZoom(Math.min(zoom * 1.5, 8))}
          className="w-8 h-8 rounded bg-card border border-border text-foreground flex items-center justify-center text-lg font-bold hover:bg-muted transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setZoom(Math.max(zoom / 1.5, 1))}
          className="w-8 h-8 rounded bg-card border border-border text-foreground flex items-center justify-center text-lg font-bold hover:bg-muted transition-colors"
        >
          −
        </button>
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
        <ZoomableGroup zoom={zoom} onMoveEnd={({ zoom: z }) => setZoom(z)} minZoom={1} maxZoom={8}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const pcName = geo.properties.pc_name || "";
                const stName = geo.properties.st_name || "";
                const key = pcName.toUpperCase();
                const data = constituencyPartyMap[key];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getColor(pcName)}
                    stroke="hsl(var(--border))"
                    strokeWidth={0.3}
                    style={{
                      default: { outline: "none", opacity: 0.85 },
                      hover: { outline: "none", opacity: 1, strokeWidth: 1, stroke: "hsl(var(--foreground))" },
                      pressed: { outline: "none", opacity: 0.7 },
                    }}
                    onMouseEnter={(e) => {
                      setTooltip({
                        x: e.clientX,
                        y: e.clientY,
                        name: pcName,
                        state: stName,
                        party: data?.party || "N/A",
                        mp: data?.mp || "N/A",
                      });
                    }}
                    onMouseMove={(e) => {
                      if (tooltip) {
                        setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => {
                      if (onConstituencyClick) {
                        onConstituencyClick(pcName, data);
                      } else if (data?.candidateId) {
                        navigate(`/candidate?id=${data.candidateId}`);
                      }
                    }}
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
          className="fixed z-50 pointer-events-none bg-card border border-border rounded-lg shadow-lg px-3 py-2 text-xs"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
        >
          <p className="font-bold text-foreground">{tooltip.name}</p>
          <p className="text-muted-foreground">{tooltip.state}</p>
          <p className="text-foreground mt-1">
            <span className="font-medium">{tooltip.mp}</span> ({tooltip.party})
          </p>
        </div>
      )}
    </div>
  );
});

IndiaConstituencyMap.displayName = "IndiaConstituencyMap";

export default IndiaConstituencyMap;
