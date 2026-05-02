import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { ArrowLeft, Calendar, Clock, Tag, Loader2, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" }) : "";

const estimateReadTime = (content?: string | null) => {
  if (!content) return "1 min read";
  const words = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
};

// Very lightweight markdown -> HTML for headings, bold, italic, links, lists, paragraphs.
const renderContent = (md: string) => {
  // If content already looks like HTML, render as-is
  if (/<\/?(p|div|h[1-6]|ul|ol|img|a|strong|em|blockquote)\b/i.test(md)) return md;

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" | null = null;

  const closeList = () => {
    if (inList && listType) {
      out.push(`</${listType}>`);
      inList = false;
      listType = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeList();
      continue;
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeList();
      const lvl = h[1].length;
      out.push(`<h${lvl}>${escape(h[2])}</h${lvl}>`);
      continue;
    }
    const ul = line.match(/^[-*]\s+(.*)$/);
    const ol = line.match(/^\d+\.\s+(.*)$/);
    if (ul) {
      if (!inList || listType !== "ul") { closeList(); out.push("<ul>"); inList = true; listType = "ul"; }
      out.push(`<li>${escape(ul[1])}</li>`);
      continue;
    }
    if (ol) {
      if (!inList || listType !== "ol") { closeList(); out.push("<ol>"); inList = true; listType = "ol"; }
      out.push(`<li>${escape(ol[1])}</li>`);
      continue;
    }
    closeList();
    out.push(`<p>${escape(line)}</p>`);
  }
  closeList();

  return out
    .join("\n")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
};

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      // try by slug first, fall back to id
      const { data: bySlug } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", id!)
        .eq("status", "published")
        .maybeSingle();
      if (bySlug) return bySlug;
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id!)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // SEO: set document title + meta
  useEffect(() => {
    if (!blog) return;
    const title = (blog as any).seo_title || blog.title;
    document.title = `${title} — Matdaan Blog`;

    const setMeta = (name: string, content: string) => {
      if (!content) return;
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setMeta("description", (blog as any).seo_description || blog.excerpt || "");
    setMeta("keywords", (blog as any).seo_keywords || (blog.tags || []).join(", "));

    return () => { document.title = "Matdaan"; };
  }, [blog]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container max-w-3xl pt-32 pb-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Blog not found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or hasn't been published.</p>
          <button onClick={() => navigate("/blogs")} className="px-6 py-3 bg-foreground text-background rounded-lg font-semibold text-sm">
            Back to Blogs
          </button>
        </div>
        <FooterSection />
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: blog.title, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="pt-28 pb-16 bg-background">
        <div className="container max-w-3xl">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>

          {blog.category && (
            <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
              {blog.category}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-display font-bold mt-2 mb-4 text-foreground leading-tight">
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              {blog.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground border-y border-border py-3 mb-8">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(blog.published_at)}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {estimateReadTime(blog.content)}</span>
            <button onClick={handleShare} className="ml-auto flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          {blog.featured_image && (
            <div className="rounded-xl overflow-hidden border border-border mb-8">
              <img src={blog.featured_image} alt={blog.title} className="w-full h-auto object-cover" />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-foreground prose-a:underline prose-strong:text-foreground prose-li:text-foreground/90"
            dangerouslySetInnerHTML={{ __html: renderContent(blog.content || "") }}
          />

          {blog.images && blog.images.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-display font-bold mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {blog.images.map((img: string, i: number) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-border">
                    <img src={img} alt={`${blog.title} image ${i + 1}`} className="w-full h-40 object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {blog.tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {blog.external_links && Array.isArray(blog.external_links) && blog.external_links.length > 0 && (
            <div className="mt-8 p-5 rounded-xl bg-muted border border-border">
              <h4 className="font-display font-bold mb-3">References & Further Reading</h4>
              <ul className="space-y-2 text-sm">
                {(blog.external_links as any[]).map((link: any, i: number) => (
                  <li key={i}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-foreground underline">
                      {link.label || link.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
      <FooterSection />
    </div>
  );
};

export default BlogDetail;
