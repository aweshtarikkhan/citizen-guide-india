import { memo, useEffect, useRef, useState, useCallback } from "react";
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
  la: "Jammu & Kashmir",
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

    const geoName = STATE_ID_TO_GEOJSON[stateId];
    if (!geoName) { setLoading(false); return; }

    // Create map with NO tile layer - just white background
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
    });

    // White background
    map.getContainer().style.background = "hsl(var(--card))";

    leafletMap.current = map;

    fetch("/india_pc_2019_simplified.geojson")
      .then((r) => r.json())
      .then((geoData) => {
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
              color: "#fff",
              fillOpacity: 0.8,
            };
          },
          onEachFeature: (feature, featureLayer) => {
            const pcName = feature.properties?.pc_name || "";
            const pcNameHi = feature.properties?.pc_name_hi || pcName;

            // Add permanent label
            const center = (featureLayer as any).getBounds?.()?.getCenter?.();
            if (center) {
              L.marker(center, {
                icon: L.divIcon({
                  className: "!bg-transparent !border-0",
                  html: `<div style="font-size:9px;font-weight:600;color:#1e293b;text-align:center;white-space:nowrap;text-shadow:0 0 3px #fff,0 0 3px #fff;">${pcNameHi}</div>`,
                  iconSize: [80, 20],
                  iconAnchor: [40, 10],
                }),
                interactive: false,
              }).addTo(map);
            }

            featureLayer.on({
              mouseover: (e) => {
                e.target.setStyle({ weight: 3, fillOpacity: 1, color: "#1e293b" });
                e.target.bringToFront();
              },
              mouseout: (e) => {
                e.target.setStyle({ weight: 1.5, fillOpacity: 0.8, color: "#fff" });
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

        // Fit tightly to state bounds only
        const bounds = layer.getBounds();
        map.fitBounds(bounds, { padding: [10, 10], animate: false });

        // Lock the view so user can't pan/zoom away
        map.setMaxBounds(bounds.pad(0.1));
        map.setMinZoom(map.getZoom());
        map.setMaxZoom(map.getZoom());

        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, [stateId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-card">
      {loading && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-card/80">
          <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
        </div>
      )}

      {tooltip.content && (
        <div
          className="fixed z-[2000] pointer-events-none px-3 py-2 rounded-md text-xs font-medium bg-foreground text-background shadow-lg whitespace-pre-line"
          style={{ left: tooltip.x + 14, top: tooltip.y - 35 }}
        >
          {tooltip.content}
        </div>
      )}

      <div ref={mapRef} style={{ height: "500px", width: "100%" }} />

      <div className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        लोकसभा क्षेत्र — क्लिक करके विवरण देखें
      </div>
    </div>
  );
});

StateConstituencyMap.displayName = "StateConstituencyMap";
export default StateConstituencyMap;
