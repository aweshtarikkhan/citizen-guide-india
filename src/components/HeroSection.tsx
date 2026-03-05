import heroImg from "@/assets/hero-voting.jpg";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <img src={heroImg} alt="Indian citizens voting at a polling booth" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="container relative z-10 py-24 md:py-32">
        <div className="max-w-2xl space-y-6 animate-fade-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium backdrop-blur-sm border border-primary-foreground/20">
            India's Voter Help Centre
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-tight">
            Your Vote.<br />Your Voice.<br />Your Power.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 font-body max-w-lg leading-relaxed">
            Empowering 950 million+ Indian citizens with knowledge, assistance, and tools to participate meaningfully in democracy.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#help-desk">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold text-base px-8 rounded-full">
                Get Voter Help <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="#knowledge">
              <Button size="lg" variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-base px-8 rounded-full">
                Explore Democracy
              </Button>
            </a>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-primary-foreground/80 text-sm">
            {["Non-partisan", "Citizen-focused", "Free & accessible"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
