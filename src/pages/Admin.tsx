import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard, FileText, Users, UserCheck, LogOut, Plus, Edit, Trash2,
  Eye, Save, Upload, X, Loader2, Image as ImageIcon
} from "lucide-react";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  images: string[];
  category: string | null;
  tags: string[];
  status: string;
  social_links: any;
  external_links: any;
  published_at: string | null;
  created_at: string;
}

interface VolunteerApp {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string | null;
  availability: string;
  why_join_us: string;
  resume_url: string | null;
  status: string | null;
  created_at: string | null;
}

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

type Tab = "dashboard" | "blogs" | "leads" | "blog-editor" | "users";

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [leads, setLeads] = useState<VolunteerApp[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Blog editor state
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [socialKey, setSocialKey] = useState("");
  const [socialValue, setSocialValue] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!authLoading && user && !isAdmin) {
      toast({ title: "Access Denied", description: "You don't have admin privileges.", variant: "destructive" });
      navigate("/");
    }
  }, [authLoading, user, isAdmin, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchBlogs();
      fetchLeads();
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchBlogs = async () => {
    setLoadingData(true);
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    setBlogs((data as Blog[]) || []);
    setLoadingData(false);
  };

  const fetchLeads = async () => {
    const { data } = await supabase
      .from("volunteer_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setLeads((data as VolunteerApp[]) || []);
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers((data as UserProfile[]) || []);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "featured" | "gallery") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(path);

    if (type === "featured") {
      setEditingBlog((prev) => ({ ...prev, featured_image: publicUrl }));
    } else {
      setEditingBlog((prev) => ({
        ...prev,
        images: [...(prev?.images || []), publicUrl],
      }));
    }
    setUploading(false);
  };

  const saveBlog = async (status: "draft" | "published") => {
    if (!editingBlog?.title) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    setSaving(true);

    const blogData = {
      title: editingBlog.title,
      content: editingBlog.content || "",
      excerpt: editingBlog.excerpt || null,
      featured_image: editingBlog.featured_image || null,
      images: editingBlog.images || [],
      category: editingBlog.category || null,
      tags: editingBlog.tags || [],
      status,
      social_links: editingBlog.social_links || {},
      external_links: editingBlog.external_links || [],
      published_at: status === "published" ? new Date().toISOString() : null,
      author_id: user!.id,
    };

    let error;
    if (editingBlog.id) {
      ({ error } = await supabase.from("blogs").update(blogData).eq("id", editingBlog.id));
    } else {
      ({ error } = await supabase.from("blogs").insert(blogData));
    }

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: status === "published" ? "Blog published!" : "Draft saved!" });
      setEditingBlog(null);
      setActiveTab("blogs");
      fetchBlogs();
    }
    setSaving(false);
  };

  const deleteBlog = async (id: string) => {
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (!error) {
      toast({ title: "Blog deleted" });
      fetchBlogs();
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setEditingBlog((prev) => ({
        ...prev,
        tags: [...(prev?.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setEditingBlog((prev) => ({
      ...prev,
      tags: (prev?.tags || []).filter((_, i) => i !== index),
    }));
  };

  const addSocialLink = () => {
    if (socialKey && socialValue) {
      setEditingBlog((prev) => ({
        ...prev,
        social_links: { ...(prev?.social_links || {}), [socialKey]: socialValue },
      }));
      setSocialKey("");
      setSocialValue("");
    }
  };

  const addExternalLink = () => {
    if (linkLabel && linkUrl) {
      setEditingBlog((prev) => ({
        ...prev,
        external_links: [...((prev?.external_links as any[]) || []), { label: linkLabel, url: linkUrl }],
      }));
      setLinkLabel("");
      setLinkUrl("");
    }
  };

  const removeImage = (index: number) => {
    setEditingBlog((prev) => ({
      ...prev,
      images: (prev?.images || []).filter((_, i) => i !== index),
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) return null;

  // Blog editor view
  if (activeTab === "blog-editor") {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setEditingBlog(null); setActiveTab("blogs"); }}>
              ← Back
            </Button>
            <h2 className="text-lg font-display font-bold">{editingBlog?.id ? "Edit Blog" : "New Blog"}</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => saveBlog("draft")} disabled={saving}>
              <Save className="h-4 w-4 mr-1" /> Save Draft
            </Button>
            <Button size="sm" onClick={() => saveBlog("published")} disabled={saving}>
              <Eye className="h-4 w-4 mr-1" /> Publish
            </Button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Blog title"
              value={editingBlog?.title || ""}
              onChange={(e) => setEditingBlog((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea
              placeholder="Short description..."
              rows={2}
              value={editingBlog?.excerpt || ""}
              onChange={(e) => setEditingBlog((prev) => ({ ...prev, excerpt: e.target.value }))}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              placeholder="Write your blog content here... (supports markdown)"
              rows={12}
              value={editingBlog?.content || ""}
              onChange={(e) => setEditingBlog((prev) => ({ ...prev, content: e.target.value }))}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              placeholder="e.g. Technology, Opinion, Guide"
              value={editingBlog?.category || ""}
              onChange={(e) => setEditingBlog((prev) => ({ ...prev, category: e.target.value }))}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input placeholder="Add a tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
              <Button type="button" variant="outline" onClick={addTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(editingBlog?.tags || []).map((tag, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {tag}
                  <button onClick={() => removeTag(i)}><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label>Featured Image</Label>
            {editingBlog?.featured_image && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border mb-2">
                <img src={editingBlog.featured_image} alt="" className="w-full h-full object-cover" />
                <button
                  className="absolute top-2 right-2 bg-background/80 rounded-full p-1"
                  onClick={() => setEditingBlog((prev) => ({ ...prev, featured_image: null }))}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{uploading ? "Uploading..." : "Upload featured image"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "featured")} />
            </label>
          </div>

          {/* Gallery Images */}
          <div className="space-y-2">
            <Label>Additional Images</Label>
            <div className="grid grid-cols-3 gap-3">
              {(editingBlog?.images || []).map((img, i) => (
                <div key={i} className="relative h-32 rounded-lg overflow-hidden border border-border">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    className="absolute top-1 right-1 bg-background/80 rounded-full p-1"
                    onClick={() => removeImage(i)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="h-32 flex flex-col items-center justify-center border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted">
                <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Add image</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "gallery")} />
              </label>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            <Label>Social Links</Label>
            <div className="flex gap-2">
              <Input placeholder="Platform (twitter, facebook...)" value={socialKey} onChange={(e) => setSocialKey(e.target.value)} />
              <Input placeholder="URL" value={socialValue} onChange={(e) => setSocialValue(e.target.value)} />
              <Button type="button" variant="outline" onClick={addSocialLink}>Add</Button>
            </div>
            {editingBlog?.social_links && Object.entries(editingBlog.social_links).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium capitalize">{k}:</span> <span className="truncate">{v as string}</span>
              </div>
            ))}
          </div>

          {/* External Links */}
          <div className="space-y-2">
            <Label>External Links</Label>
            <div className="flex gap-2">
              <Input placeholder="Label" value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} />
              <Input placeholder="URL" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
              <Button type="button" variant="outline" onClick={addExternalLink}>Add</Button>
            </div>
            {((editingBlog?.external_links as any[]) || []).map((link: any, i: number) => (
              <div key={i} className="text-sm text-muted-foreground">
                {link.label}: <a href={link.url} target="_blank" rel="noopener" className="underline">{link.url}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card min-h-screen p-4 flex flex-col">
        <h1 className="text-xl font-display font-bold mb-8 px-2">Admin Panel</h1>
        <nav className="flex-1 space-y-1">
          {([
            { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
            { id: "blogs" as Tab, label: "Blogs", icon: FileText },
            { id: "leads" as Tab, label: "Leads", icon: Users },
            { id: "users" as Tab, label: "Signed Up Users", icon: UserCheck },
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === item.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <Button variant="ghost" className="justify-start text-muted-foreground" onClick={() => { signOut(); navigate("/"); }}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Dashboard</h2>
            <div className="grid sm:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Blogs</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold">{blogs.length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Published</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold">{blogs.filter(b => b.status === "published").length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Leads</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold">{leads.length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Signed Up Users</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold">{users.length}</div></CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Blogs */}
        {activeTab === "blogs" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">Blogs</h2>
              <Button onClick={() => { setEditingBlog({ tags: [], images: [], social_links: {}, external_links: [] }); setActiveTab("blog-editor"); }}>
                <Plus className="h-4 w-4 mr-2" /> New Blog
              </Button>
            </div>
            {loadingData ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : blogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No blogs yet. Create your first one!</p>
            ) : (
              <div className="space-y-3">
                {blogs.map((blog) => (
                  <Card key={blog.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      {blog.featured_image && (
                        <img src={blog.featured_image} alt="" className="w-16 h-12 rounded object-cover" />
                      )}
                      <div>
                        <h3 className="font-medium">{blog.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Badge variant={blog.status === "published" ? "default" : "secondary"} className="text-xs">
                            {blog.status}
                          </Badge>
                          {blog.category && <span>{blog.category}</span>}
                          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingBlog(blog); setActiveTab("blog-editor"); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteBlog(blog.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Leads */}
        {activeTab === "leads" && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Volunteer Applications ({leads.length})</h2>
            {leads.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No applications yet.</p>
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => (
                  <Card key={lead.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{lead.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{lead.email} · {lead.phone}</p>
                        <p className="text-sm text-muted-foreground mt-1">Availability: {lead.availability}</p>
                        {lead.skills && lead.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {lead.skills.map((s, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-sm mt-2 text-foreground/80">{lead.why_join_us}</p>
                        {lead.experience && <p className="text-xs text-muted-foreground mt-1">Experience: {lead.experience}</p>}
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{lead.status || "pending"}</Badge>
                        {lead.created_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </p>
                        )}
                        {lead.resume_url && (
                          <a href={lead.resume_url} target="_blank" rel="noopener" className="text-xs underline text-foreground mt-1 block">
                            View Resume
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
