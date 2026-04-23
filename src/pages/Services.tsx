import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Link } from "react-router-dom";
import { UserPlus, BookOpen, XCircle, Clock, FileText, Shield, HelpCircle, TrendingUp, Users, Landmark, ArrowRight, Search, ExternalLink } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";

const serviceLinks = [
  { icon: UserPlus, label: "Voter Help Desk", desc: "Register, correct details & find your polling station. Step-by-step guidance for all voter services.", href: "/help-desk", color: "from-orange-500/10 to-orange-600/5" },
  { icon: Search, label: "Search Your Name in SIR", desc: "Check if your name appears in the Special Intensive Revision (SIR) electoral roll on the official ECI portal.", href: "https://voters.eci.gov.in/", color: "from-emerald-500/10 to-emerald-600/5", external: true },
  { icon: BookOpen, label: "Know Your Democracy", desc: "Learn how elections work, how Parliament functions & how governance shapes your life.", href: "/knowledge", color: "from-blue-500/10 to-blue-600/5" },
  { icon: XCircle, label: "Myth Busters", desc: "Common voting myths debunked with facts. Don't let misinformation stop you from voting.", href: "/myths", color: "from-red-500/10 to-red-600/5" },
  { icon: Clock, label: "Election Timeline", desc: "Every phase of an election — from announcement to final results, explained clearly.", href: "/election-timeline", color: "from-green-500/10 to-green-600/5" },
  { icon: FileText, label: "Important Forms", desc: "All voter forms at one place — Form 6, 7, 8 & more with download links.", href: "/important-forms", color: "from-purple-500/10 to-purple-600/5" },
  { icon: Shield, label: "Voter Rights", desc: "Your constitutional rights as a voter. Know what you're entitled to.", href: "/voter-rights", color: "from-yellow-500/10 to-yellow-600/5" },
  { icon: HelpCircle, label: "FAQ", desc: "Quick answers to the most common questions about voting and elections.", href: "/faq", color: "from-cyan-500/10 to-cyan-600/5" },
  { icon: TrendingUp, label: "Election Results & News", desc: "Latest election results, analysis, trends & breaking updates.", href: "/election-results", color: "from-pink-500/10 to-pink-600/5" },
  { icon: Users, label: "Political Parties", desc: "National & state party profiles, symbols, ideologies & seat data.", href: "/political-parties", color: "from-indigo-500/10 to-indigo-600/5" },
  { icon: Landmark, label: "Constitution & Laws", desc: "The electoral legal framework — key articles, acts & amendments explained.", href: "/constitution-laws", color: "from-teal-500/10 to-teal-600/5" },
];

const ServicesPage = () => {
  const { getContent } = usePageContent("services");

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 bg-background">
        <div className="container max-w-5xl">
          <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Our Services</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-3 text-foreground">
            {getContent("page_title", "Everything You Need as a Voter")}
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-2xl leading-relaxed">
            {getContent("page_desc", "From registration to results — all voter services, information and tools in one place. Free, non-partisan and built for every Indian citizen.")}
          </p>
        </div>
      </section>

      <section className="pb-20 bg-background">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {serviceLinks.map((s) => (
              <Link
                key={s.href}
                to={s.href}
                className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-elevated hover:border-foreground/20 hover:-translate-y-1"
              >
                {/* Subtle gradient bg on hover */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <s.icon className="h-5 w-5 text-background" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-display font-bold text-foreground">{s.label}</h2>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default ServicesPage;
