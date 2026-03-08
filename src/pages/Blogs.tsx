import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { PenLine, Clock } from "lucide-react";

const samplePosts = [
  { title: "Understanding EVM: How Electronic Voting Machines Work", excerpt: "A deep dive into the technology behind India's Electronic Voting Machines and why they are considered secure.", date: "March 5, 2026", readTime: "5 min read", category: "Technology" },
  { title: "First-Time Voter? Here's Your Complete Guide", excerpt: "Everything you need to know before casting your first vote — from registration to the polling booth.", date: "March 1, 2026", readTime: "4 min read", category: "Guide" },
  { title: "The History of Elections in India", excerpt: "From the first general election in 1951 to the world's largest democracy today — a journey through India's electoral history.", date: "Feb 25, 2026", readTime: "7 min read", category: "History" },
  { title: "Why Every Vote Counts: The Mathematics of Democracy", excerpt: "How close elections have been won or lost by a handful of votes, and why your single vote truly matters.", date: "Feb 20, 2026", readTime: "3 min read", category: "Opinion" },
  { title: "Women in Indian Elections: Progress & Challenges", excerpt: "Exploring the growing participation of women voters and candidates in Indian democracy.", date: "Feb 15, 2026", readTime: "6 min read", category: "Analysis" },
  { title: "NOTA: Understanding the 'None of the Above' Option", excerpt: "What happens when you press NOTA? Does it actually make a difference? We break it down.", date: "Feb 10, 2026", readTime: "4 min read", category: "Explainer" },
];

const Blogs = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 bg-background">
      <div className="container max-w-5xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Blog</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-3 text-foreground">
              Matdaan Blog
            </h1>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl">
              Insights, guides, and stories about Indian democracy and civic participation.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm">
            <PenLine className="h-4 w-4" />
            Coming soon: Community blog posts
          </div>
        </div>
      </div>
    </section>

    <section className="pb-20 bg-background">
      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {samplePosts.map((post, i) => (
            <article
              key={i}
              className="group rounded-xl border border-border bg-card shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="h-40 bg-gradient-to-br from-foreground/5 to-muted flex items-center justify-center">
                <PenLine className="h-10 w-10 text-foreground/20" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">{post.category}</span>
                <h3 className="text-base font-display font-bold text-foreground mb-2 leading-snug group-hover:underline decoration-foreground/30 underline-offset-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-3">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <FooterSection />
  </div>
);

export default Blogs;
