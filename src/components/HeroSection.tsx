import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-foreground overflow-hidden">
      <div className="container relative z-10 py-24 md:py-32">
        <div className="max-w-3xl space-y-8 animate-fade-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-background leading-[1.05] tracking-tight">
            Every Vote<br />
            <span className="text-gradient-warm">Shapes India.</span>
          </h1>
          <p className="text-lg md:text-xl text-background/60 font-body max-w-md leading-relaxed">
            Your non-partisan guide to understanding and exercising your democratic rights.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#help-desk">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 rounded-full">
                Get Help <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="#knowledge">
              <Button size="lg" variant="outline" className="border-background/20 text-background hover:bg-background/10 font-semibold text-base px-8 rounded-full">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
