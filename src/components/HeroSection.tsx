import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import IndiaMapInteractive from "@/components/IndiaMapInteractive";
import { usePageContent } from "@/hooks/usePageContent";

const HeroSection = () => {
  const { getContent } = usePageContent("home");

  return (
    <section className="relative min-h-[85vh] flex items-center bg-transparent overflow-hidden">
      <div className="container relative z-10 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-8 animate-fade-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-foreground leading-[1.05] tracking-tight">
              {getContent("hero_title", "Every Vote\nShapes India.").split("\n").map((line, i) => (
                <span key={i}>
                  {i === 0 ? line : <span className="text-gradient-warm">{line}</span>}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-body max-w-md leading-relaxed">
              {getContent("hero_subtitle", "Your non-partisan guide to understanding and exercising your democratic rights.")}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/help-desk">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 rounded-full">
                  {getContent("hero_cta_primary", "Get Help")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/knowledge">
                <Button size="lg" variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/10 font-semibold text-base px-8 rounded-full">
                  {getContent("hero_cta_secondary", "Learn More")}
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <IndiaMapInteractive />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
