import { useMemo } from "react";
import indiaMap from "@svg-maps/india";
import { useNavigate } from "react-router-dom";

interface StateMapHighlightProps {
  activeStateId: string;
}

const StateMapHighlight = ({ activeStateId }: StateMapHighlightProps) => {
  const navigate = useNavigate();

  // Calculate bounding box for the active state to zoom into it
  const { activeLocation, viewBox } = useMemo(() => {
    const active = indiaMap.locations.find((l) => l.id === activeStateId);
    if (!active) return { activeLocation: null, viewBox: indiaMap.viewBox };

    // Parse the path to extract coordinates for bounding box
    const nums = active.path.match(/[\d.]+/g)?.map(Number) || [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    for (let i = 0; i < nums.length - 1; i += 2) {
      const x = nums[i], y = nums[i + 1];
      if (x < 1000 && y < 1000) { // filter out reasonable coords
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }

    if (!isFinite(minX)) return { activeLocation: active, viewBox: indiaMap.viewBox };

    const padding = Math.max((maxX - minX), (maxY - minY)) * 0.15;
    minX -= padding;
    minY -= padding;
    const w = (maxX - minX) + padding * 2;
    const h = (maxY - minY) + padding * 2;

    return {
      activeLocation: active,
      viewBox: `${minX} ${minY} ${w} ${h}`,
    };
  }, [activeStateId]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
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
              opacity={isActive ? 1 : 0.15}
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
