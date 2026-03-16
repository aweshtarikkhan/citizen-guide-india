import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import matdaanLogo from "@/assets/matdaan-logo.png";

const FooterSection = () => (
  <footer className="py-16 bg-foreground text-background">
    <div className="container">
      <div className="grid md:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold text-background tracking-wide">
            <img src={matdaanLogo} alt="Matdaan Logo" className="h-9 w-9 object-contain brightness-0 invert" />
            MATDAAN
          </Link>
          <p className="text-background/70 text-sm leading-relaxed max-w-xs mt-3">
            India's Voter Help Centre — empowering citizens with knowledge, assistance, and tools to participate meaningfully in democracy.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-lg mb-4">Voter Services</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li><Link to="/help-desk" className="hover:text-background transition-colors">Voter Help Desk</Link></li>
            <li><Link to="/important-forms" className="hover:text-background transition-colors">Important Forms</Link></li>
            <li><Link to="/voter-rights" className="hover:text-background transition-colors">Voter Rights</Link></li>
            <li><Link to="/faq" className="hover:text-background transition-colors">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-lg mb-4">Learn</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li><Link to="/knowledge" className="hover:text-background transition-colors">Know Your Democracy</Link></li>
            <li><Link to="/election-timeline" className="hover:text-background transition-colors">Election Timeline</Link></li>
            <li><Link to="/myths" className="hover:text-background transition-colors">Myth Busters</Link></li>
            <li><Link to="/about" className="hover:text-background transition-colors">About</Link></li>
            <li><a href="https://www.eci.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">Election Commission of India ↗</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
          <div className="space-y-3 text-sm text-background/70">
            <a href="mailto:editor@matdaan.com" className="flex items-center gap-2 hover:text-background transition-colors">
              <Mail className="h-4 w-4" /> editor@matdaan.com
            </a>
            <a href="tel:+919009036633" className="flex items-center gap-2 hover:text-background transition-colors">
              <Phone className="h-4 w-4" /> +91 9009036633
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10 mt-12 pt-6 text-center text-xs text-background/50">
        © {new Date().getFullYear()} Matdaan Initiative. Non-partisan civic platform. Not affiliated with any political party or government body.
      </div>
    </div>
  </footer>
);

export default FooterSection;
