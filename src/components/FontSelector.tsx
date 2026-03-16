import { useState, useEffect } from "react";
import { Type } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fontOptions = [
  { label: "Quicksand", value: "'Quicksand', system-ui, sans-serif" },
  { label: "Poppins", value: "'Poppins', system-ui, sans-serif" },
  { label: "Roboto", value: "'Roboto', system-ui, sans-serif" },
  { label: "Lato", value: "'Lato', system-ui, sans-serif" },
  { label: "Nunito", value: "'Nunito', system-ui, sans-serif" },
  { label: "Source Sans 3", value: "'Source Sans 3', system-ui, sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', Georgia, serif" },
];

const FontSelector = () => {
  const [currentFont, setCurrentFont] = useState(() => {
    return localStorage.getItem("matdaan-font") || fontOptions[0].label;
  });

  useEffect(() => {
    const saved = localStorage.getItem("matdaan-font");
    if (saved) {
      const opt = fontOptions.find((f) => f.label === saved);
      if (opt) applyFont(opt);
    }
  }, []);

  const applyFont = (opt: (typeof fontOptions)[0]) => {
    document.documentElement.style.setProperty("--font-display", opt.value);
    document.documentElement.style.setProperty("--font-body", opt.value);
    setCurrentFont(opt.label);
    localStorage.setItem("matdaan-font", opt.label);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted">
        <Type className="h-4 w-4" />
        <span className="hidden sm:inline text-xs">{currentFont}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {fontOptions.map((opt) => (
          <DropdownMenuItem
            key={opt.label}
            onClick={() => applyFont(opt)}
            className={`cursor-pointer ${currentFont === opt.label ? "bg-muted font-semibold" : ""}`}
            style={{ fontFamily: opt.value }}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontSelector;
