import { memo, useState, useCallback, useMemo, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { stateDataMap } from "@/data/stateConstituencies";

const PARTY_HEX: Record<string, string> = {
  BJP: "#f97316", INC: "#3b82f6", SP: "#ef4444", TMC: "#16a34a",
  DMK: "#dc2626", TDP: "#eab308", "JD(U)": "#22c55e", "SS(UBT)": "#fb923c",
  SHS: "#ea580c", NCP: "#60a5fa", "NCP-SCP": "#60a5fa", YSRCP: "#1d4ed8", AAP: "#06b6d4",
  BJD: "#4ade80", RJD: "#15803d", "CPI(M)": "#b91c1c", CPI: "#dc2626",
  JKNC: "#dc2626", IND: "#6b7280", SAD: "#3b82f6", NPP: "#eab308",
  "LJP(RV)": "#3b82f6", IUML: "#16a34a", "KC(M)": "#eab308", RSP: "#dc2626",
  VCK: "#1e40af", AGP: "#4ade80", UPPL: "#8b5cf6", JMM: "#16a34a",
  NC: "#b91c1c", PDP: "#15803d", AIUDF: "#22c55e", "HAM(S)": "#eab308",
  SKM: "#ef4444", NDPP: "#3b82f6", ZPM: "#22c55e", MNF: "#3b82f6",
  NPF: "#3b82f6", UDP: "#8b5cf6", JSP: "#eab308", "JD(S)": "#22c55e",
  RLD: "#16a34a", ADSL: "#3b82f6", ASPKR: "#6b7280", AJSU: "#f97316",
  BAP: "#16a34a", RLP: "#eab308", AIMIM: "#22c55e", VPP: "#8b5cf6",
};

const DEFAULT_COLOR = "#d1d5db";

// Map GeoJSON st_name to stateDataMap id
const GEOJSON_STATE_TO_ID: Record<string, string> = {
  "Andaman & Nicobar": "an", "Andhra Pradesh": "ap", "Arunachal Pradesh": "ar",
  "Assam": "as", "Bihar": "br", "Chandigarh": "ch", "Chhattisgarh": "ct",
  "Dadra & Nagar Haveli": "dn", "Daman & Diu": "dd", "Delhi": "dl", "Goa": "ga",
  "Gujarat": "gj", "Haryana": "hr", "Himachal Pradesh": "hp", "Jammu & Kashmir": "jk",
  "Jharkhand": "jh", "Karnataka": "ka", "Kerala": "kl", "Lakshadweep": "ld",
  "Madhya Pradesh": "mp", "Maharashtra": "mh", "Manipur": "mn", "Meghalaya": "ml",
  "Mizoram": "mz", "Nagaland": "nl", "Orissa": "or", "Odisha": "or",
  "Puducherry": "py", "Punjab": "pb", "Rajasthan": "rj", "Sikkim": "sk",
  "Tamil Nadu": "tn", "Telangana": "tg", "Tripura": "tr",
  "Uttar Pradesh": "up", "Uttarakhand": "uk", "West Bengal": "wb",
  "Ladakh": "la",
};

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
  return name.toUpperCase().replace(/[^A-Z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function findStateIdForConstituency(pcName: string, stName: string): string | null {
  // First try GeoJSON state name mapping
  const stateId = GEOJSON_STATE_TO_ID[stName];
  if (stateId) {
    const state = stateDataMap[stateId];
    if (state) {
      const found = state.constituencies.find(
        c => normalizeName(c.name) === normalizeName(pcName)
      );
      if (found) return stateId;
    }
  }
  // Fallback: search all states
  for (const [id, state] of Object.entries(stateDataMap)) {
    const found = state.constituencies.find(
      c => normalizeName(c.name) === normalizeName(pcName)
    );
    if (found) return id;
  }
  return null;
}

const IndiaConstituencyMap = memo(({ data, onConstituencyClick }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const geoLayerRef = useRef<L.GeoJSON | null>(null);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const normalizedData = useMemo(() => {
    if (!data) return {};
    const map: Record<string, ConstituencyData> = {};
    Object.entries(data).forEach(([key, val]) => {
      map[normalizeName(key)] = val;
    });
    return map;
  }, [data]);

  const findMatch = useCallback(
    (pcName: string): ConstituencyData | undefined => normalizedData[normalizeName(pcName)],
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

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current, {
      center: [22, 82],
      zoom: 5,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: false,
      attributionControl: false,
    });

    // White/card background - no tile layer for clean India-only look
    map.getContainer().style.background = "hsl(var(--card))";

    leafletMap.current = map;

    // Load GeoJSON
    fetch("/india_pc_2019_simplified.geojson")
      .then((res) => res.json())
      .then((geoData) => {
        const layer = L.geoJSON(geoData, {
          style: (feature) => {
            const pcName = feature?.properties?.pc_name || "";
            const match = findMatch(pcName);
            const fillColor = match ? (PARTY_HEX[match.party] || DEFAULT_COLOR) : DEFAULT_COLOR;
            return {
              fillColor,
              weight: 0.5,
              opacity: 1,
              color: "#888",
              fillOpacity: 0.7,
            };
          },
          onEachFeature: (feature, featureLayer) => {
            const pcName = feature.properties?.pc_name || "";
            const stName = feature.properties?.st_name || "";
            featureLayer.on({
              mouseover: (e) => {
                const l = e.target;
                l.setStyle({ weight: 2, fillOpacity: 0.85 });
                l.bringToFront();
              },
              mouseout: (e) => {
                const l = e.target;
                l.setStyle({ weight: 0.5, fillOpacity: 0.7 });
                setTooltipContent("");
              },
              mousemove: (e) => {
                const match = findMatch(pcName);
                const label = match
                  ? `${pcName} — ${match.mp} (${match.party})`
                  : pcName;
                setTooltipContent(label);
                setTooltipPos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
              },
              click: () => {
                // Navigate to constituency detail page
                const stateId = findStateIdForConstituency(pcName, stName);
                if (stateId) {
                  navigate(`/constituency/${stateId}/${encodeURIComponent(pcName)}`);
                } else if (onConstituencyClick) {
                  onConstituencyClick(pcName);
                }
              },
            });
          },
        }).addTo(map);
        geoLayerRef.current = layer;

        // Fit to India bounds
        const bounds = layer.getBounds();
        map.fitBounds(bounds, { padding: [10, 10] });
      });

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update styles when data changes
  useEffect(() => {
    if (!geoLayerRef.current) return;
    geoLayerRef.current.eachLayer((layer: any) => {
      const feature = layer.feature;
      if (!feature) return;
      const pcName = feature.properties?.pc_name || "";
      layer.setStyle({
        fillColor: getFillColor(pcName),
        weight: 0.5,
        opacity: 1,
        color: "#888",
        fillOpacity: 0.7,
      });
    });
  }, [getFillColor]);

  const handleZoomIn = () => leafletMap.current?.zoomIn();
  const handleZoomOut = () => leafletMap.current?.zoomOut();
  const handleReset = () => {
    if (leafletMap.current && geoLayerRef.current) {
      leafletMap.current.fitBounds(geoLayerRef.current.getBounds(), { padding: [10, 10] });
    }
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-border" style={{ minHeight: "500px" }}>
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1">
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
          className="fixed z-[2000] pointer-events-none px-3 py-2 rounded-md text-xs font-medium bg-foreground text-background shadow-lg"
          style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 30 }}
        >
          {tooltipContent}
        </div>
      )}

      <div ref={mapRef} style={{ height: "600px", width: "100%", cursor: "pointer" }} />
    </div>
  );
});

IndiaConstituencyMap.displayName = "IndiaConstituencyMap";

export default IndiaConstituencyMap;
