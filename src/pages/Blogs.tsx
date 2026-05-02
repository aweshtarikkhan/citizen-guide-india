import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import FeedbackSection from "@/components/FeedbackSection";
import { PenLine, Clock, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const fallbackPosts = [
  { id: "s1", title: "Understanding EVM: How Electronic Voting Machines Work", excerpt: "A deep dive into the technology behind India's Electronic Voting Machines and why they are considered secure.", published_at: "2026-03-05", category: "Technology", featured_image: null },
  { id: "s2", title: "First-Time Voter? Here's Your Complete Guide", excerpt: "Everything you need to know before casting your first vote — from registration to the polling booth.", published_at: "2026-03-01", category: "Guide", featured_image: null },
  { id: "s3", title: "The History of Elections in India", excerpt: "From the first general election in 1951 to the world's largest democracy today — a journey through India's electoral history.", published_at: "2026-02-25", category: "History", featured_image: null },
];

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "";

const estimateReadTime = (content?: string | null) => {
  if (!content) return "3 min read";
  const words = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
};

const Blogs = () => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ["publishedBlogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, excerpt, content, published_at, category, featured_image")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const posts = blogs && blogs.length > 0 ? blogs : fallbackPosts;
  const showingFallback = !blogs || blogs.length === 0;

  return (
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
              {showingFallback ? "Coming soon: Community blog posts" : `${posts.length} article${posts.length === 1 ? "" : "s"}`}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 bg-background">
        <div className="container max-w-5xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <article
                  key={post.id}
                  className="group rounded-xl border border-border bg-card shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="h-40 bg-gradient-to-br from-foreground/5 to-muted flex items-center justify-center overflow-hidden">
                    {post.featured_image ? (
                      <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <PenLine className="h-10 w-10 text-foreground/20" />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                      {post.category || "Article"}
                    </span>
                    <h3 className="text-base font-display font-bold text-foreground mb-2 leading-snug group-hover:underline decoration-foreground/30 underline-offset-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-3">
                      <span>{formatDate(post.published_at)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {estimateReadTime(post.content)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <FeedbackSection />
      <FooterSection />
    </div>
  );
};

export default Blogs;
