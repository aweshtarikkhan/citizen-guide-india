import { memo } from "react";

interface Props {
  onConstituencyClick?: (name: string) => void;
}

const IndiaConstituencyMap = memo(({ onConstituencyClick }: Props) => {
  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-border bg-card" style={{ minHeight: "500px" }}>
      <iframe
        title="India Parliamentary Constituencies"
        aria-label="Map"
        src="https://datawrapper.dwcdn.net/gx5ee/"
        scrolling="no"
        frameBorder="0"
        style={{ width: "100%", minHeight: "600px", border: "none" }}
        allowFullScreen
      />
    </div>
  );
});

IndiaConstituencyMap.displayName = "IndiaConstituencyMap";

export default IndiaConstituencyMap;
