import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FooterSection from "@/components/FooterSection";
import { Link } from "react-router-dom";
import { ArrowRight, UserPlus, BookOpen, XCircle } from "lucide-react";

const sections = [
  {
    icon: UserPlus,
    title: "Voter Help Desk",
    desc: "Register to vote, correct details, find your polling station, and more — step-by-step guidance for every voter need.",
    link: "/help-desk",
  },
  {
    icon: BookOpen,
    title: "Know Your Democracy",
    desc: "Understand elections, Parliament, your rights, and the policies that shape your life.",
    link: "/knowledge",
  },
  {
    icon: XCircle,
    title: "Myth Busters",
    desc: "Common misconceptions debunked with facts and official sources.",
    link: "/myths",
  },
];

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <StatsSection />

    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Explore Matdaan
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Everything you need to be an informed, empowered citizen.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {sections.map((s, i) => (
            <Link
              key={i}
              to={s.link}
              className="group p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-lg bg-foreground flex items-center justify-center mb-4">
                <s.icon className="h-6 w-6 text-background" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.desc}</p>
              <span className="text-sm font-semibold text-foreground flex items-center gap-1 group-hover:gap-2 transition-all">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <FooterSection />
  </div>
);

export default Index;
