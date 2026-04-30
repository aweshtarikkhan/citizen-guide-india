import { useState } from "react";
import { useNavigate } from "react-router-dom";
import indiaMap from "@svg-maps/india";

// Party color mapping (official party colors)
const partyColors: Record<string, string> = {
  "BJP": "#FF9933",
  "Congress": "#19AAED",
  "INC": "#19AAED",
  "AAP": "#0066CC",
  "TMC": "#20C997",
  "DMK": "#E2231A",
  "BJD": "#138808",
  "TDP": "#FFD700",
  "JMM": "#006400",
  "SKM": "#FFA500",
  "ZPM": "#8B4513",
  "NPP": "#1E90FF",
  "NC": "#FF1493",
  "NDPP": "#FF6347",
  "YSRCP": "#0F52BA",
  "SP": "#DC143C",
  "BSP": "#22409A",
  "Shiv Sena": "#F47216",
  "NCP": "#00BFFF",
  "CPM": "#CC0000",
  "CPI": "#CC0000",
};

// Get color for a party string (handles alliances/compound names)
const getPartyColor = (party: string): string => {
  if (!party) return "hsl(var(--muted))";
  const upper = party.toUpperCase();
  if (upper.includes("BJP") || upper.includes("NDA") || upper.includes("MAHAYUTI")) return partyColors["BJP"];
  if (upper.includes("CONGRESS") || upper.includes("INC") || upper.includes("UDF")) return partyColors["Congress"];
  if (upper.includes("AAP")) return partyColors["AAP"];
  if (upper.includes("TMC")) return partyColors["TMC"];
  if (upper.includes("DMK")) return partyColors["DMK"];
  if (upper.includes("BJD")) return partyColors["BJD"];
  if (upper.includes("TDP")) return partyColors["TDP"];
  if (upper.includes("JMM")) return partyColors["JMM"];
  if (upper.includes("SKM")) return partyColors["SKM"];
  if (upper.includes("ZPM")) return partyColors["ZPM"];
  if (upper.includes("NPP")) return partyColors["NPP"];
  if (upper.includes("NC-") || upper.startsWith("NC ")) return partyColors["NC"];
  if (upper.includes("NDPP")) return partyColors["NDPP"];
  if (upper.includes("LDF") || upper.includes("CPM")) return partyColors["CPM"];
  if (upper.includes("NR CONGRESS")) return partyColors["BJP"];
  return "hsl(var(--foreground))";
};

const statePartyData: Record<string, { party: string; cm: string }> = {
  "an": { party: "BJP", cm: "Lt. Governor" },
  "ap": { party: "TDP-led NDA", cm: "N. Chandrababu Naidu" },
  "ar": { party: "BJP", cm: "Pema Khandu" },
  "as": { party: "BJP", cm: "Himanta Biswa Sarma" },
  "br": { party: "NDA (JD(U)-BJP)", cm: "Nitish Kumar" },
  "ct": { party: "BJP", cm: "Vishnu Deo Sai" },
  "ch": { party: "BJP", cm: "UT Administrator" },
  "dn": { party: "BJP", cm: "UT Administrator" },
  "dd": { party: "BJP", cm: "UT Administrator" },
  "dl": { party: "AAP", cm: "Atishi" },
  "ga": { party: "BJP", cm: "Pramod Sawant" },
  "gj": { party: "BJP", cm: "Bhupendra Patel" },
  "hr": { party: "BJP", cm: "Nayab Singh Saini" },
  "hp": { party: "Congress", cm: "Sukhvinder Singh Sukhu" },
  "jk": { party: "NC-Congress", cm: "Omar Abdullah" },
  "jh": { party: "JMM-led Alliance", cm: "Hemant Soren" },
  "ka": { party: "Congress", cm: "Siddaramaiah" },
  "kl": { party: "LDF (CPM-led)", cm: "Pinarayi Vijayan" },
  "la": { party: "BJP", cm: "UT Administrator" },
  "ld": { party: "BJP", cm: "UT Administrator" },
  "mp": { party: "BJP", cm: "Mohan Yadav" },
  "mh": { party: "Mahayuti (BJP-led)", cm: "Devendra Fadnavis" },
  "mn": { party: "BJP", cm: "N. Biren Singh" },
  "ml": { party: "NPP-led Alliance", cm: "Conrad Sangma" },
  "mz": { party: "ZPM", cm: "Lalduhoma" },
  "nl": { party: "NDPP-BJP", cm: "Neiphiu Rio" },
  "or": { party: "BJD", cm: "Mohan Charan Majhi" },
  "py": { party: "NR Congress-BJP", cm: "N. Rangasamy" },
  "pb": { party: "AAP", cm: "Bhagwant Mann" },
  "rj": { party: "BJP", cm: "Bhajan Lal Sharma" },
  "sk": { party: "SKM", cm: "Prem Singh Tamang" },
  "tn": { party: "DMK", cm: "M.K. Stalin" },
  "tg": { party: "Congress", cm: "A. Revanth Reddy" },
  "tr": { party: "BJP", cm: "Manik Saha" },
  "up": { party: "BJP", cm: "Yogi Adityanath" },
  "ut": { party: "BJP", cm: "Pushkar Singh Dhami" },
  "wb": { party: "TMC", cm: "Mamata Banerjee" },
};

const IndiaMapInteractive = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<{ name: string; party: string; cm: string } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 10,
    });
  };

  return (
    <div className="relative w-full max-w-md" onMouseMove={handleMouseMove}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={indiaMap.viewBox}
        className="w-full h-auto"
      >
        {indiaMap.locations.map((location) => {
          const data = statePartyData[location.id];
          return (
            <path
              key={location.id}
              d={location.path}
              className="transition-all duration-200 cursor-pointer"
              fill={hovered?.name === location.name ? getPartyColor(data?.party || "") : "hsl(var(--muted))"}
              stroke="hsl(var(--foreground))"
              strokeWidth="0.5"
              onMouseEnter={() =>
                setHovered({
                  name: location.name,
                  party: data?.party || "N/A",
                  cm: data?.cm || "N/A",
                })
              }
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(`/state/${location.id}`)}
            />
          );
        })}
      </svg>

      {hovered && (
        <div
          className="absolute z-20 pointer-events-none bg-card border border-border shadow-elevated rounded-lg px-4 py-3 min-w-[180px]"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="font-display font-bold text-foreground text-sm">{hovered.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Ruling Party: <span className="text-foreground font-semibold">{hovered.party}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            CM: <span className="text-foreground font-semibold">{hovered.cm}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default IndiaMapInteractive;
