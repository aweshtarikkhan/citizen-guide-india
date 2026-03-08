import indiaMap from "@svg-maps/india";
import { useNavigate } from "react-router-dom";

interface StateMapHighlightProps {
  activeStateId: string;
}

const StateMapHighlight = ({ activeStateId }: StateMapHighlightProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-sm mx-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={indiaMap.viewBox}
        className="w-full h-auto"
      >
        {indiaMap.locations.map((location) => {
          const isActive = location.id === activeStateId;
          return (
            <path
              key={location.id}
              d={location.path}
              className="transition-all duration-200 cursor-pointer"
              fill={isActive ? "hsl(var(--foreground))" : "hsl(var(--muted))"}
              stroke="hsl(var(--foreground))"
              strokeWidth={isActive ? "1" : "0.3"}
              opacity={isActive ? 1 : 0.4}
              onClick={() => {
                if (!isActive) navigate(`/state/${location.id}`);
              }}
            />
          );
        })}
      </svg>
      <p className="text-center text-xs text-muted-foreground mt-2">Click another state to navigate</p>
    </div>
  );
};

export default StateMapHighlight;
