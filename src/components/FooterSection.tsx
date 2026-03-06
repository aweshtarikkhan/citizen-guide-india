import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const FooterSection = () => (
  <footer className="py-16 bg-foreground text-background">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-10">
        <div>
          <Link to="/" className="font-display text-2xl font-bold text-background tracking-wide">MATDAAN</Link>
          <p className="text-background/70 text-sm leading-relaxed max-w-xs mt-3">
            India's Voter Help Centre — empowering citizens with knowledge, assistance, and tools to participate meaningfully in democracy.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li><Link to="/help-desk" className="hover:text-background transition-colors">Voter Help Desk</Link></li>
            <li><Link to="/knowledge" className="hover:text-background transition-colors">Know Your Democracy</Link></li>
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
