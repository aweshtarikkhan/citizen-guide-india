import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, UserPlus, BookOpen, XCircle, Clock, FileText, Shield, HelpCircle, TrendingUp, Users, Landmark, LogIn, LogOut, Settings, UserCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import matdaanLogo from "@/assets/matdaan-logo.png";
import { useAuth } from "@/hooks/useAuth";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";


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

const BRAND_NAME: Record<string, string> = {
  en: "MATDAAN",
  hi: "मतदान",
  bn: "মতদান",
  ta: "வாக்களிப்பு",
  te: "మతదానం",
  kn: "ಮತದಾನ",
  ml: "മതദാനം",
  mr: "मतदान",
  gu: "મતદાન",
  pa: "ਮਤਦਾਨ",
  or: "ମତଦାନ",
  as: "মতদান",
  ur: "ووٹنگ",
};

const Navbar = () => {
  const { user, isAdmin, isEditor, signOut } = useAuth();
  const { currentLang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const navigate = useNavigate();
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
        <Link to="/" className="flex items-center gap-1.5 text-2xl font-bold text-foreground tracking-wide" style={{ fontFamily: 'var(--font-logo)' }}>
          <div className="h-14 w-14 rounded-full border-2 border-foreground/10 shadow-sm flex items-center justify-center overflow-hidden">
            <img src={matdaanLogo} alt="Matdaan Logo" className="h-[120%] w-[120%] object-contain scale-125" />
          </div>
          <span className="-ml-0.5">{BRAND_NAME[currentLang] || BRAND_NAME.en}</span>
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

          <Link
            to="/services"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/services" || isServicePage ? "text-foreground" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Services
          </Link>

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

          
          <LanguageSelector />

          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors">
                <UserCircle className="h-4 w-4" /> Profile
              </Link>
              {(isAdmin || isEditor) && (
                <Link to="/admin" className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1">
                  <Settings className="h-4 w-4" /> {isAdmin ? "Admin" : "Editor"}
                </Link>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">
              <LogIn className="h-4 w-4" /> Login
            </Link>
          )}
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

          <Link
            to="/services"
            className={`block py-2.5 text-sm font-medium ${
              location.pathname === "/services" || isServicePage ? "text-foreground" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Services
          </Link>

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

          {/* Mobile Language Selector */}
          <div className="border-t border-border pt-3 mt-2">
            <div className="flex items-center gap-2 pb-2">
              <span className="text-xs text-muted-foreground">Language:</span>
              <LanguageSelector />
            </div>
          </div>

          {/* Mobile Auth */}
          <div className="border-t border-border pt-3 mt-2">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 py-2.5 text-sm font-medium text-foreground/70 hover:text-foreground">
                  <UserCircle className="h-4 w-4" /> My Profile
                </Link>
                {(isAdmin || isEditor) && (
                  <Link to="/admin" className="flex items-center gap-2 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg px-3">
                    <Settings className="h-4 w-4" /> {isAdmin ? "Admin Panel" : "Editor Panel"}
                  </Link>
                )}
              </>
            ) : (
              <Link to="/login" className="flex items-center justify-center gap-2 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium">
                <LogIn className="h-4 w-4" /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
