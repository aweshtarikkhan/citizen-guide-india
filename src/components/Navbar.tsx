import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, UserPlus, BookOpen, XCircle, Clock, FileText, Shield, HelpCircle, TrendingUp, Users, Landmark } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const serviceLinks = [
  { icon: UserPlus, label: "Voter Help Desk", desc: "Register, correct details & find polling station", href: "/help-desk" },
  { icon: BookOpen, label: "Know Your Democracy", desc: "Elections, Parliament & governance", href: "/knowledge" },
  { icon: XCircle, label: "Myth Busters", desc: "Common voting myths debunked", href: "/myths" },
  { icon: Clock, label: "Election Timeline", desc: "Every phase from announcement to results", href: "/election-timeline" },
  { icon: FileText, label: "Important Forms", desc: "All voter forms — Form 6, 7, 8 & more", href: "/important-forms" },
  { icon: Shield, label: "Voter Rights", desc: "Your constitutional rights as a voter", href: "/voter-rights" },
  { icon: HelpCircle, label: "FAQ", desc: "Quick answers to common questions", href: "/faq" },
  { icon: TrendingUp, label: "Election Results & News", desc: "Latest results, analysis & updates", href: "/election-results" },
  { icon: Users, label: "Political Parties", desc: "National & state parties info", href: "/political-parties" },
  { icon: Landmark, label: "Constitution & Laws", desc: "Electoral legal framework", href: "/constitution-laws" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  const isServicePage = serviceLinks.some((l) => location.pathname === l.href);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display text-2xl font-bold text-foreground tracking-wide">
          MATDAAN
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((l) => (
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

          {/* Services Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                isServicePage || servicesOpen ? "text-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Services
            </button>

            {servicesOpen && (
              <div className="absolute top-full right-0 mt-3 w-[640px] bg-card border border-border rounded-xl shadow-elevated p-4 grid grid-cols-2 gap-1 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
                {serviceLinks.map((s) => (
                  <Link
                    key={s.href}
                    to={s.href}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors group ${
                      location.pathname === s.href
                        ? "bg-foreground/5"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="h-9 w-9 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <s.icon className="h-4 w-4 text-background" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-foreground block leading-tight">{s.label}</span>
                      <span className="text-xs text-muted-foreground leading-snug">{s.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/constituency"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/constituency" ? "text-foreground" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Constituency
          </Link>

          <Link
            to="/blogs"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/blogs" ? "text-foreground" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Blogs
          </Link>

          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/contact" ? "text-foreground" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border-b border-border px-6 pb-5 space-y-1 animate-in slide-in-from-top-1 duration-200">
          {navItems.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`block py-2.5 text-sm font-medium ${
                location.pathname === l.href ? "text-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}

          {/* Mobile Services Accordion */}
          <button
            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            className={`w-full flex items-center justify-between py-2.5 text-sm font-medium ${
              isServicePage ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Services
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />

          </button>
          {mobileServicesOpen && (
            <div className="pl-3 space-y-0.5 pb-2">
              {serviceLinks.map((s) => (
                <Link
                  key={s.href}
                  to={s.href}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm ${
                    location.pathname === s.href
                      ? "bg-foreground/5 text-foreground font-semibold"
                      : "text-foreground/60 hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <s.icon className="h-4 w-4 flex-shrink-0" />
                  {s.label}
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/constituency"
            className={`block py-2.5 text-sm font-medium ${
              location.pathname === "/constituency" ? "text-foreground" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Constituency
          </Link>

          <Link
            to="/blogs"
            className={`block py-2.5 text-sm font-medium ${
              location.pathname === "/blogs" ? "text-foreground" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Blogs
          </Link>

          <Link
            to="/contact"
            className={`block py-2.5 text-sm font-medium ${
              location.pathname === "/contact" ? "text-foreground" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
