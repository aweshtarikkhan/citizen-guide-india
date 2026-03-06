import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: "Voter Help Desk", href: "/help-desk" },
    { label: "Know Your Democracy", href: "/knowledge" },
    { label: "Myth Busters", href: "/myths" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display text-2xl font-bold text-gradient-warm">
          मतदान
          <span className="text-sm font-body font-medium text-muted-foreground ml-2 tracking-wide">MATDAAN</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === l.href ? "text-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-card border-b border-border px-6 pb-4 space-y-3">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className={`block text-sm font-medium ${
                location.pathname === l.href ? "text-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
