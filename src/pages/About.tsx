import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import IndiaMapInteractive from "@/components/IndiaMapInteractive";
import {
  Heart, Shield, Eye, Users, MapPin, Vote, BookOpen, Scale,
  Target, Lightbulb, Globe, Award, ArrowRight, CheckCircle2,
  Calendar, TrendingUp, Building2, Gavel
} from "lucide-react";
import { Link } from "react-router-dom";

/* ── Animated Counter Hook ── */
const useCountUp = (end: number, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, startOnView]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return { count, ref };
};

/* ── Scroll Reveal Hook ── */
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
};

/* ── Data ── */
const stats = [
  { icon: Users, value: 950, suffix: "M+", label: "Eligible Voters", desc: "Largest democracy on Earth" },
  { icon: MapPin, value: 28, suffix: "+", label: "States Covered", desc: "Pan-India information" },
  { icon: BookOpen, value: 100, suffix: "+", label: "Resources", desc: "Forms, guides & articles" },
  { icon: Vote, value: 67, suffix: "%", label: "Avg Turnout", desc: "We aim to increase this" },
];

const values = [
  { icon: Shield, title: "Non-Partisan", desc: "We are not affiliated with any political party, government body, or ideological group. Our only agenda is informed citizenship.", color: "from-foreground/5 to-foreground/10" },
  { icon: Eye, title: "Transparent", desc: "All information is sourced from official Election Commission publications, constitutional documents, and verified legal sources.", color: "from-foreground/5 to-foreground/10" },
  { icon: Heart, title: "Citizen-First", desc: "Built by citizens, for citizens. We believe that an informed voter is the foundation of a healthy democracy.", color: "from-foreground/5 to-foreground/10" },
  { icon: Users, title: "Inclusive", desc: "We aim to make civic knowledge accessible to every Indian — regardless of language, location, or background.", color: "from-foreground/5 to-foreground/10" },
];

const timeline = [
  { year: "1950", title: "Republic Founded", desc: "India became a sovereign democratic republic with universal adult suffrage.", icon: Calendar },
  { year: "1951", title: "First Election", desc: "First General Elections held — the world's largest democratic exercise at the time.", icon: Vote },
  { year: "1989", title: "EVM Introduced", desc: "Electronic Voting Machines pilot-tested, revolutionizing election technology.", icon: Lightbulb },
  { year: "2013", title: "NOTA Option", desc: "Supreme Court mandated 'None of the Above' option on ballot papers.", icon: Gavel },
  { year: "2024", title: "Record Election", desc: "2024 General Elections — 64.2 crore voters participated across 7 phases.", icon: TrendingUp },
];

const whatWeDo = [
  { icon: Target, title: "Voter Registration Help", desc: "Step-by-step guides for new voter registration, corrections, and transfers." },
  { icon: BookOpen, title: "Civic Education", desc: "Deep-dive articles on how Parliament, State Assemblies, and local bodies work." },
  { icon: Scale, title: "Know Your Rights", desc: "Constitutional rights every voter must know — from Article 326 to RPA." },
  { icon: Globe, title: "Election Coverage", desc: "Non-partisan analysis of election results, phases, and historical data." },
  { icon: Building2, title: "Institutional Knowledge", desc: "How ECI, courts, and constitutional bodies safeguard democracy." },
  { icon: Award, title: "Myth Busting", desc: "Debunking misinformation about EVMs, voting, and the electoral process." },
];

const teamMembers = [
  { name: "Rahul Sharma", role: "Founder & Director", image: "RS", desc: "Civic tech enthusiast with 10+ years in public policy" },
  { name: "Priya Patel", role: "Head of Content", image: "PP", desc: "Former journalist specializing in electoral coverage" },
  { name: "Amit Kumar", role: "Tech Lead", image: "AK", desc: "Full-stack developer passionate about civic innovation" },
  { name: "Sneha Reddy", role: "Outreach Coordinator", image: "SR", desc: "Grassroots organizer with pan-India network" },
];

const ourWorking = [
  { icon: Target, title: "Research", desc: "We study official ECI documents, constitutional provisions, and legal frameworks to ensure accuracy." },
  { icon: BookOpen, title: "Simplify", desc: "Complex civic information is broken down into easy-to-understand guides and articles." },
  { icon: Globe, title: "Distribute", desc: "Content is made freely available across web, social media, and partner networks." },
  { icon: Users, title: "Engage", desc: "We actively respond to citizen queries and continuously improve based on feedback." },
];

/* ── Component ── */
const AboutPage = () => {
  const heroReveal = useScrollReveal();
  const statsReveal = useScrollReveal();
  const missionReveal = useScrollReveal();
  const valuesReveal = useScrollReveal();
  const timelineReveal = useScrollReveal();
  const mapReveal = useScrollReveal();
  const whatWeDoReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();
  const workingReveal = useScrollReveal();
  const teamReveal = useScrollReveal();

  const stat1 = useCountUp(950, 2000);
  const stat2 = useCountUp(28, 1500);
  const stat3 = useCountUp(100, 1800);
  const stat4 = useCountUp(67, 2000);
  const statRefs = [stat1, stat2, stat3, stat4];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-background/20 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-background/10 blur-3xl" />
        </div>
        <div
          ref={heroReveal.ref}
          className={`container relative z-10 max-w-5xl transition-all duration-1000 ${heroReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Foundation Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/10 border border-background/20 rounded-full mb-6">
            <Calendar className="h-4 w-4 text-background/80" />
            <span className="text-sm font-medium text-background/80">Founded in 2020</span>
          </div>
          
          <span className="inline-block text-sm font-semibold text-background/60 uppercase tracking-[0.2em] mb-4">
            Matdaan Ki Foundation
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-background leading-[1.1]">
            Empowering India's
            <br />
            <span className="text-background/70">950 Million Voters</span>
          </h1>
          <p className="mt-6 text-background/60 text-lg md:text-xl max-w-2xl leading-relaxed">
            Matdaan (मतदान) means "the act of voting" in Hindi. Founded in 2020, we are a non-partisan civic initiative dedicated to empowering Indian citizens with the knowledge and tools they need to participate meaningfully in democracy.
          </p>
          
          {/* Foundation Highlights */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            <div className="text-center p-3 bg-background/5 rounded-lg border border-background/10">
              <div className="text-2xl font-bold text-background">2020</div>
              <div className="text-xs text-background/60">Founded</div>
            </div>
            <div className="text-center p-3 bg-background/5 rounded-lg border border-background/10">
              <div className="text-2xl font-bold text-background">5+</div>
              <div className="text-xs text-background/60">Years Active</div>
            </div>
            <div className="text-center p-3 bg-background/5 rounded-lg border border-background/10">
              <div className="text-2xl font-bold text-background">Pan-India</div>
              <div className="text-xs text-background/60">Reach</div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/help-desk"
              className="inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground rounded-lg font-semibold text-sm hover:bg-background/90 transition-colors"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/knowledge"
              className="inline-flex items-center gap-2 px-6 py-3 border border-background/30 text-background rounded-lg font-semibold text-sm hover:bg-background/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="py-16 md:py-20 bg-background border-b border-border">
        <div
          ref={statsReveal.ref}
          className={`container max-w-5xl transition-all duration-700 ${statsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div
                key={i}
                ref={statRefs[i].ref}
                className={`text-center transition-all duration-500`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 mb-4">
                  <s.icon className="h-6 w-6 text-foreground" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  {statRefs[i].count}{s.suffix}
                </div>
                <div className="text-sm font-semibold text-foreground mt-1">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Mission ── */}
      <section className="py-16 md:py-24 bg-background">
        <div
          ref={missionReveal.ref}
          className={`container max-w-5xl transition-all duration-700 ${missionReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 leading-tight">
                Bridging the Gap Between Citizens & Democracy
              </h2>
              <p className="text-muted-foreground leading-relaxed mt-6">
                India is the world's largest democracy with over 950 million eligible voters. Yet voter turnout averages around 65–67%, and millions of citizens remain unaware of their rights, the electoral process, or how to resolve basic voter-related issues.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Matdaan exists to bridge this gap. We provide clear, accurate, and accessible information about voting, elections, and democratic institutions — in a format that's easy to understand and act upon.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We don't tell you who to vote for. We help you understand <strong className="text-foreground">why your vote matters</strong>, how the system works, and what your rights and responsibilities are as a citizen.
              </p>
              <div className="mt-6 space-y-3">
                {["100% non-partisan & independent", "Official ECI-sourced data", "Free for every Indian citizen"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-foreground flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-muted/50 p-8 md:p-10">
              <blockquote className="text-lg md:text-xl font-display italic text-foreground leading-relaxed">
                "The vote is the most powerful instrument ever devised by man for breaking down injustice."
              </blockquote>
              <p className="text-sm text-muted-foreground mt-4">— Lyndon B. Johnson</p>
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-sm text-muted-foreground">
                  In India, <strong className="text-foreground">Article 326</strong> of the Constitution guarantees universal adult suffrage — the right of every citizen above 18 to vote, regardless of caste, religion, gender, or economic status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className="py-16 md:py-24 bg-muted/30 border-y border-border">
        <div
          ref={whatWeDoReveal.ref}
          className={`container max-w-5xl transition-all duration-700 ${whatWeDoReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3">
              Your Complete Civic Resource
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              From voter registration to understanding constitutional rights — everything a responsible citizen needs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeDo.map((item, i) => (
              <div
                key={i}
                className="group rounded-xl border border-border bg-card shadow-card p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-11 w-11 rounded-lg bg-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="h-5 w-5 text-background" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Working ── */}
      <section className="py-16 md:py-24 bg-background">
        <div
          ref={workingReveal.ref}
          className={`container max-w-5xl transition-all duration-700 ${workingReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Our Working</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3">
              How We Work
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Our systematic approach ensures accurate, accessible, and impactful civic education.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ourWorking.map((item, i) => (
              <div
                key={i}
                className="relative group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold z-10">
                  {i + 1}
                </div>
                <div className="rounded-xl border border-border bg-card shadow-card p-6 pt-8 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="h-11 w-11 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                    <item.icon className="h-5 w-5 text-foreground group-hover:text-background transition-colors duration-300" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet Our Team ── */}
      <section className="py-16 md:py-24 bg-muted/30 border-y border-border">
        <div
          ref={teamReveal.ref}
          className={`container max-w-5xl transition-all duration-700 ${teamReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Passionate individuals dedicated to strengthening Indian democracy through civic education.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="group rounded-xl border border-border bg-card shadow-card p-6 text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Avatar */}
                <div className="mx-auto h-20 w-20 rounded-full bg-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-background">{member.image}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-foreground">{member.name}</h3>
                <p className="text-sm font-medium text-primary mt-1">{member.role}</p>
                <p className="text-muted-foreground text-xs mt-3 leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16 md:py-24 bg-background">
        <div
          ref={valuesReveal.ref}
          className={`container max-w-5xl transition-all duration-700 ${valuesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3">
              What We Stand For
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="group rounded-xl border border-border bg-gradient-to-br from-card to-muted/30 shadow-card p-7 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-xl bg-foreground flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <v.icon className="h-5 w-5 text-background" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Democracy Timeline ── */}
      <section className="py-16 md:py-24 bg-muted/30 border-y border-border">
        <div
          ref={timelineReveal.ref}
          className={`container max-w-4xl transition-all duration-700 ${timelineReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Milestones</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3">
              India's Democratic Journey
            </h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

            {timeline.map((t, i) => (
              <div
                key={i}
                className={`relative flex items-start gap-6 mb-12 last:mb-0 md:gap-12 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-foreground border-2 border-background -translate-x-1.5 mt-2 z-10" />

                {/* Content */}
                <div className={`ml-14 md:ml-0 md:w-[calc(50%-3rem)] ${i % 2 === 0 ? "md:text-right md:pr-0" : "md:text-left md:pl-0"}`}>
                  <div className="inline-flex items-center gap-2 mb-2">
                    <t.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground tracking-wider">{t.year}</span>
                  </div>
                  <h3 className="font-display font-bold text-foreground text-lg">{t.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{t.desc}</p>
                </div>

                {/* Empty space for the other side */}
                <div className="hidden md:block md:w-[calc(50%-3rem)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── India Map Section ── */}
      <section className="py-16 md:py-24 bg-background">
        <div
          ref={mapReveal.ref}
          className={`container max-w-5xl transition-all duration-700 ${mapReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Explore India</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 leading-tight">
                Every State, Every Voice
              </h2>
              <p className="text-muted-foreground leading-relaxed mt-4">
                India's democracy spans 28 states and 8 union territories, each with its own political landscape. Hover over the map to explore ruling parties, Chief Ministers, and state-level governance.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">543 Lok Sabha Constituencies</p>
                    <p className="text-xs text-muted-foreground">Representing the people at the national level</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">4,000+ State Assembly Seats</p>
                    <p className="text-xs text-muted-foreground">Governing at the state level across India</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">2,600+ Registered Parties</p>
                    <p className="text-xs text-muted-foreground">National, state & unrecognized parties combined</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <IndiaMapInteractive />
            </div>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="container max-w-4xl">
          <div className="rounded-xl border border-border bg-card shadow-card p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">Disclaimer</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              Matdaan is an independent civic initiative. We are <strong className="text-foreground">not</strong> affiliated with the Election Commission of India, any government department, or any political party.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              All information provided is for educational purposes and is sourced from publicly available official documents. For official processes and legal actions, always refer to the Election Commission of India (<a href="https://www.eci.gov.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">eci.gov.in</a>) or the National Voter Service Portal (<a href="https://www.nvsp.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">nvsp.in</a>).
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We encourage all citizens to verify information through official channels before taking any action.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 md:py-28 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-background/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-background/10 blur-3xl" />
        </div>
        <div
          ref={ctaReveal.ref}
          className={`container max-w-3xl text-center relative z-10 transition-all duration-700 ${ctaReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-background leading-tight">
            Your Vote is Your Voice.
            <br />
            <span className="text-background/60">Make It Count.</span>
          </h2>
          <p className="text-background/60 mt-6 text-lg max-w-xl mx-auto">
            Start by checking your voter registration, learn about your constituency, or explore how India's democracy works.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/help-desk"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-background text-foreground rounded-lg font-semibold text-sm hover:bg-background/90 transition-colors"
            >
              Voter Help Desk <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/knowledge"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-background/30 text-background rounded-lg font-semibold text-sm hover:bg-background/10 transition-colors"
            >
              Explore Resources
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default AboutPage;
