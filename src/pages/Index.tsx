import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FooterSection from "@/components/FooterSection";
import { Link } from "react-router-dom";
import { usePageContent } from "@/hooks/usePageContent";
import { ArrowRight, UserPlus, BookOpen, XCircle, Clock, FileText, Shield, HelpCircle, Mail, Phone, MapPin, Quote, TrendingUp, Users, Landmark, Brain, PenLine, BarChart3, Sparkles } from "lucide-react";
import ElectionCountdown from "@/components/ElectionCountdown";
import DailyFact from "@/components/DailyFact";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const sections = [
  { icon: UserPlus, title: "Voter Help Desk", desc: "Register, correct details & find your polling station.", link: "/help-desk" },
  { icon: BookOpen, title: "Know Your Democracy", desc: "Elections, Parliament & how governance works.", link: "/knowledge" },
  { icon: XCircle, title: "Myth Busters", desc: "Common voting myths debunked with facts.", link: "/myths" },
  { icon: Clock, title: "Election Timeline", desc: "Every phase from announcement to results.", link: "/election-timeline" },
  { icon: FileText, title: "Important Forms", desc: "All voter forms — Form 6, 7, 8 & more.", link: "/important-forms" },
  { icon: Shield, title: "Voter Rights", desc: "Your constitutional rights as a voter.", link: "/voter-rights" },
  { icon: HelpCircle, title: "FAQ", desc: "Quick answers to common voting questions.", link: "/faq" },
  { icon: TrendingUp, title: "Election Results & News", desc: "Latest election results, analysis & updates.", link: "/election-results" },
  { icon: Users, title: "Political Parties", desc: "National & state-level parties of India.", link: "/political-parties" },
  { icon: Landmark, title: "Constitution & Laws", desc: "Electoral legal framework of India.", link: "/constitution-laws" },
  { icon: Brain, title: "Voter Quiz", desc: "Test your election knowledge with our quiz!", link: "/voter-quiz" },
];

const testimonials = [
  { name: "Priya Sharma", location: "Delhi", text: "Matdaan helped me register as a first-time voter. The step-by-step process was so easy to follow!" },
  { name: "Rahul Verma", location: "Mumbai", text: "I didn't know I could vote with Aadhaar instead of Voter ID. The Myth Busters section cleared all my doubts." },
  { name: "Ananya Patel", location: "Ahmedabad", text: "The Election Timeline section helped me understand how the entire process works. Very informative!" },
  { name: "Karthik Reddy", location: "Hyderabad", text: "Finally a platform that explains voter rights in simple language. Every citizen should visit Matdaan." },
  { name: "Sneha Iyer", location: "Bengaluru", text: "I used Matdaan to help my parents correct their voter details. The forms guide was extremely helpful." },
  { name: "Amit Singh", location: "Lucknow", text: "The FAQ section answered every question I had about EVMs and VVPAT. Highly recommended!" },
];

// Fallback blogs for when no published blogs exist
const fallbackBlogs = [
  { 
    id: "1",
    title: "Understanding EVM: How Electronic Voting Machines Work", 
    excerpt: "A deep dive into the technology behind India's Electronic Voting Machines and why they are considered secure.", 
    published_at: "2026-03-05", 
    category: "Technology" 
  },
  { 
    id: "2",
    title: "First-Time Voter? Here's Your Complete Guide", 
    excerpt: "Everything you need to know before casting your first vote — from registration to the polling booth.", 
    published_at: "2026-03-01", 
    category: "Guide" 
  },
  { 
    id: "3",
    title: "The History of Elections in India", 
    excerpt: "From the first general election in 1951 to the world's largest democracy today — a journey through India's electoral history.", 
    published_at: "2026-02-25", 
    category: "History" 
  },
];

const Index = () => {
  const { getContent, getJsonContent } = usePageContent("home");
  
  const cmsTestimonials = getJsonContent("testimonials", testimonials);

  // Fetch latest 3 published blogs
  const { data: latestBlogs } = useQuery({
    queryKey: ["latestBlogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, excerpt, published_at, category")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const blogsToShow = latestBlogs && latestBlogs.length > 0 ? latestBlogs : fallbackBlogs;

  return (
  <div className="min-h-screen">
    <Navbar />

    {/* 1. Hero */}
    <HeroSection />

    {/* Countdown + Daily Fact */}
    <section className="py-8 md:py-12 lg:py-16 bg-background">
      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <ElectionCountdown />
          <DailyFact />
        </div>
      </div>
    </section>

    {/* Latest Blogs Section */}
    <section className="py-10 md:py-14 lg:py-16 bg-muted/30">
      <div className="container max-w-5xl">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <span className="text-xs md:text-sm font-semibold text-foreground uppercase tracking-widest">Blog</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mt-1 md:mt-2 text-foreground">Latest Articles</h2>
          </div>
          <Link 
            to="/blogs" 
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:gap-3 transition-all"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {blogsToShow.map((blog) => (
            <Link
              key={blog.id}
              to="/blogs"
              className="group rounded-xl border border-border bg-card shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="h-32 bg-gradient-to-br from-foreground/5 to-muted flex items-center justify-center">
                <PenLine className="h-8 w-8 text-foreground/20" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                  {blog.category || "Article"}
                </span>
                <h3 className="text-sm font-display font-bold text-foreground mb-2 leading-snug group-hover:underline decoration-foreground/30 underline-offset-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="text-xs text-muted-foreground border-t border-border pt-3 mt-3">
                  {new Date(blog.published_at || "").toLocaleDateString("en-IN", { 
                    month: "short", 
                    day: "numeric", 
                    year: "numeric" 
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link 
          to="/blogs" 
          className="sm:hidden mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          View All Articles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>

    {/* 2. Who We Are */}
    <section className="py-14 md:py-20 lg:py-28 bg-muted/50">
      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <span className="text-xs md:text-sm font-semibold text-foreground uppercase tracking-widest">
              {getContent("whoweare_label", "Who We Are")}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-2 md:mt-3 text-foreground">
              {getContent("whoweare_title", "Empowering Every Indian Voter")}
            </h2>
            <p className="mt-3 md:mt-5 text-muted-foreground text-base md:text-lg leading-relaxed">
              {getContent("whoweare_desc", "Matdaan is a non-partisan civic awareness platform dedicated to making democracy accessible. We simplify voter registration, explain your rights, and bust myths — so every citizen can vote with confidence.")}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg font-semibold text-sm hover:bg-foreground/90 transition-colors">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "100%", label: "Non-Partisan" },
              { value: "10+", label: "Detailed Guides" },
              { value: "50+", label: "FAQs Answered" },
              { value: "8", label: "Voter Rights Covered" },
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-xl bg-card border border-border shadow-card text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* 3. Explore Matdaan */}
    <section className="py-14 md:py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
            {getContent("explore_title", "Explore Matdaan")}
          </h2>
          <p className="mt-3 md:mt-4 text-muted-foreground text-base md:text-lg">
            Everything you need to be an informed, empowered citizen.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
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

    {/* 4. Testimonials */}
    <section className="py-14 md:py-20 lg:py-28 bg-muted/50">
      <div className="container max-w-5xl">
        <div className="text-center mb-8 md:mb-14">
          <span className="text-xs md:text-sm font-semibold text-foreground uppercase tracking-widest">Testimonials</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-2 md:mt-3 text-foreground">
            What Citizens Say
          </h2>
          <p className="mt-3 md:mt-4 text-muted-foreground text-base md:text-lg">Real stories from voters empowered by Matdaan.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {cmsTestimonials.map((t: any, i: number) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-card">
              <Quote className="h-8 w-8 text-border mb-4" />
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="border-t border-border pt-4">
                <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* 5. Contact */}
    <section className="py-14 md:py-20 lg:py-28 bg-background">
      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <span className="text-xs md:text-sm font-semibold text-foreground uppercase tracking-widest">Contact Us</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-2 md:mt-3 text-foreground">
              Get in Touch
            </h2>
            <p className="mt-3 md:mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
              Have questions or suggestions? Reach out — we'd love to hear from you.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: Phone, label: "Voter Helpline", value: "1950 (Toll Free)" },
                { icon: Mail, label: "Email", value: "contact@matdaan.in" },
                { icon: MapPin, label: "Address", value: "New Delhi, India" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                    <c.icon className="h-5 w-5 text-background" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    <p className="text-sm font-semibold text-foreground">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border shadow-card">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Name</label>
                <input type="text" placeholder="Your name" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                <input type="email" placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Message</label>
                <textarea rows={4} placeholder="Your message..." className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none" />
              </div>
              <button type="submit" className="w-full py-3 bg-foreground text-background rounded-lg font-semibold text-sm hover:bg-foreground/90 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <FooterSection />
  </div>
);
};

export default Index;
