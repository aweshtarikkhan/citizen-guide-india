import { memo, useEffect, useRef, useState, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const STATE_ID_TO_GEOJSON: Record<string, string> = {
  an: "Andaman & Nicobar", ap: "Andhra Pradesh", ar: "Arunachal Pradesh",
  as: "Assam", br: "Bihar", ch: "Chandigarh", ct: "Chhattisgarh",
  dn: "Dadra & Nagar Haveli", dd: "Daman & Diu", dl: "Delhi", ga: "Goa",
  gj: "Gujarat", hr: "Haryana", hp: "Himachal Pradesh", jk: "Jammu & Kashmir",
  jh: "Jharkhand", ka: "Karnataka", kl: "Kerala", ld: "Lakshadweep",
  mp: "Madhya Pradesh", mh: "Maharashtra", mn: "Manipur", ml: "Meghalaya",
  mz: "Mizoram", nl: "Nagaland", or: "Orissa", od: "Orissa",
  py: "Puducherry", pb: "Punjab", rj: "Rajasthan", sk: "Sikkim",
  tn: "Tamil Nadu", tg: "Telangana", ts: "Telangana", tr: "Tripura",
  up: "Uttar Pradesh", uk: "Uttarakhand", wb: "West Bengal",
  la: "Jammu & Kashmir", // Ladakh mapped to J&K in old geojson
};

const PARTY_HEX: Record<string, string> = {
  BJP: "#f97316", INC: "#3b82f6", SP: "#ef4444", TMC: "#16a34a",
  DMK: "#dc2626", TDP: "#eab308", "JD(U)": "#22c55e", AAP: "#06b6d4",
  BJD: "#4ade80", YSRCP: "#1d4ed8", "CPI(M)": "#b91c1c", RJD: "#15803d",
  NCP: "#60a5fa", "Shiv Sena": "#ea580c", "SS (UBT)": "#fb923c",
  AIUDF: "#22c55e", UPPL: "#8b5cf6", AGP: "#4ade80", JMM: "#16a34a",
  SAD: "#3b82f6", NPP: "#eab308", IND: "#6b7280",
};

interface Props {
  stateId: string;
  constituencies?: { name: string; mp: string; party: string }[];
  onConstituencyClick?: (name: string) => void;
}

const StateConstituencyMap = memo(({ stateId, constituencies, onConstituencyClick }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const [tooltip, setTooltip] = useState({ content: "", x: 0, y: 0 });
  const [loading, setLoading] = useState(true);

  const consMap = useCallback(() => {
    if (!constituencies) return {};
    const m: Record<string, { mp: string; party: string }> = {};
    constituencies.forEach((c) => {
      m[c.name.toUpperCase().replace(/[^A-Z0-9\s]/g, "").trim()] = c;
    });
    return m;
  }, [constituencies]);

  const findMatch = useCallback((pcName: string) => {
    const norm = pcName.toUpperCase().replace(/[^A-Z0-9\s]/g, "").trim();
    return consMap()[norm];
  }, [consMap]);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current, {
      center: [22, 82],
      zoom: 5,
      minZoom: 4,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png").addTo(map);
    leafletMap.current = map;

    const geoName = STATE_ID_TO_GEOJSON[stateId];
    if (!geoName) { setLoading(false); return; }

    fetch("/india_pc_2019_simplified.geojson")
      .then((r) => r.json())
      .then((geoData) => {
        // Filter features for this state only
        const filtered = {
          ...geoData,
          features: geoData.features.filter(
            (f: any) => f.properties?.st_name === geoName
          ),
        };

        if (filtered.features.length === 0) { setLoading(false); return; }

        const layer = L.geoJSON(filtered, {
          style: (feature) => {
            const pcName = feature?.properties?.pc_name || "";
            const match = findMatch(pcName);
            return {
              fillColor: match ? (PARTY_HEX[match.party] || "#94a3b8") : "#cbd5e1",
              weight: 1.5,
              opacity: 1,
              color: "#64748b",
              fillOpacity: 0.7,
            };
          },
          onEachFeature: (feature, featureLayer) => {
            const pcName = feature.properties?.pc_name || "";
            const pcNameHi = feature.properties?.pc_name_hi || pcName;
            featureLayer.on({
              mouseover: (e) => {
                e.target.setStyle({ weight: 3, fillOpacity: 0.9, color: "#1e293b" });
                e.target.bringToFront();
              },
              mouseout: (e) => {
                e.target.setStyle({ weight: 1.5, fillOpacity: 0.7, color: "#64748b" });
                setTooltip((t) => ({ ...t, content: "" }));
              },
              mousemove: (e) => {
                const match = findMatch(pcName);
                const label = match
                  ? `${pcNameHi} (${pcName})\n${match.mp} — ${match.party}`
                  : `${pcNameHi} (${pcName})`;
                setTooltip({ content: label, x: e.originalEvent.clientX, y: e.originalEvent.clientY });
              },
              click: () => {
                if (onConstituencyClick) onConstituencyClick(pcName);
              },
            });
          },
        }).addTo(map);

        // Zoom to state bounds
        const bounds = layer.getBounds();
        map.fitBounds(bounds, { padding: [20, 20] });
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, [stateId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleZoomIn = () => leafletMap.current?.zoomIn();
  const handleZoomOut = () => leafletMap.current?.zoomOut();
  const handleReset = () => {
    if (leafletMap.current) {
      // re-fit to bounds
      leafletMap.current.eachLayer((l: any) => {
        if (l.getBounds) {
          try { leafletMap.current!.fitBounds(l.getBounds(), { padding: [20, 20] }); } catch {}
        }
      });
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-card" style={{ minHeight: "400px" }}>
      {loading && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-card/80">
          <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
        </div>
      )}

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

      {tooltip.content && (
        <div
          className="fixed z-[2000] pointer-events-none px-3 py-2 rounded-md text-xs font-medium bg-foreground text-background shadow-lg whitespace-pre-line"
          style={{ left: tooltip.x + 14, top: tooltip.y - 35 }}
        >
          {tooltip.content}
        </div>
      )}

      <div ref={mapRef} style={{ height: "450px", width: "100%" }} />

      <div className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        लोकसभा क्षेत्र — क्लिक करके विवरण देखें
      </div>
    </div>
  );
});

StateConstituencyMap.displayName = "StateConstituencyMap";
export default StateConstituencyMap;
