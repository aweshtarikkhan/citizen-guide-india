import { memo, useState, useCallback, useMemo, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapContainer, GeoJSON, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

interface ConstituencyData {
  party: string;
  mp: string;
  candidateId?: string;
}

interface Props {
  data?: Record<string, ConstituencyData>;
  onConstituencyClick?: (name: string) => void;
}

function normalizeName(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Component to handle zoom controls from outside the map
function ZoomControls({ onReset }: { onReset: () => void }) {
  const map = useMap();
  return (
    <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1">
      <Button size="icon" variant="outline" className="h-8 w-8 bg-card" onClick={() => map.zoomIn()}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" className="h-8 w-8 bg-card" onClick={() => map.zoomOut()}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" className="h-8 w-8 bg-card" onClick={() => {
        map.setView([22, 82], 5);
        onReset();
      }}>
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}

const IndiaConstituencyMap = memo(({ data, onConstituencyClick }: Props) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  // Load GeoJSON
  useEffect(() => {
    fetch("/india_pc_2019_simplified.geojson")
      .then((res) => res.json())
      .then((d) => setGeoData(d))
      .catch(console.error);
  }, []);

  // Build normalized lookup
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
      return normalizedData[normalizeName(pcName)];
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

  const onEachFeature = useCallback(
    (feature: any, layer: L.Layer) => {
      const pcName = feature.properties?.pc_name || "";
      const match = findMatch(pcName);

      layer.on({
        mouseover: (e: any) => {
          const l = e.target;
          l.setStyle({
            weight: 2,
            fillOpacity: 0.85,
          });
          l.bringToFront();
          const label = match
            ? `${pcName} — ${match.mp} (${match.party})`
            : pcName;
          setTooltipContent(label);
        },
        mouseout: (e: any) => {
          const l = e.target;
          l.setStyle({
            weight: 0.5,
            fillOpacity: 0.7,
          });
          setTooltipContent("");
        },
        mousemove: (e: any) => {
          setTooltipPos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
        },
        click: () => {
          if (onConstituencyClick) onConstituencyClick(pcName);
        },
      });
    },
    [findMatch, onConstituencyClick]
  );

  const style = useCallback(
    (feature: any) => {
      const pcName = feature.properties?.pc_name || "";
      return {
        fillColor: getFillColor(pcName),
        weight: 0.5,
        opacity: 1,
        color: "#888",
        fillOpacity: 0.7,
      };
    },
    [getFillColor]
  );

  // Recreate GeoJSON key when data changes to force re-render
  const geoKey = useMemo(() => {
    return data ? Object.keys(data).length : 0;
  }, [data]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-border" style={{ minHeight: "500px" }}>
      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="fixed z-[2000] pointer-events-none px-3 py-2 rounded-md text-xs font-medium bg-foreground text-background shadow-lg"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 30,
          }}
        >
          {tooltipContent}
        </div>
      )}

      {geoData ? (
        <MapContainer
          center={[22, 82]}
          zoom={5}
          minZoom={4}
          maxZoom={10}
          style={{ height: "600px", width: "100%", background: "#ffffff" }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            attribution=""
          />
          <GeoJSON
            key={`geo-${geoKey}`}
            ref={geoJsonRef as any}
            data={geoData}
            style={style}
            onEachFeature={onEachFeature}
          />
          <ZoomControls onReset={() => {}} />
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center h-[600px] text-muted-foreground">
          Loading map...
        </div>
      )}
    </div>
  );
});

IndiaConstituencyMap.displayName = "IndiaConstituencyMap";

export default IndiaConstituencyMap;
