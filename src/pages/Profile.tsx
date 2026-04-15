import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, BookOpen, Clock, LogOut, Save, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ReadingHistoryItem {
  id: string;
  blog_id: string;
  last_read_at: string;
  read_progress: number;
  reading_time_seconds: number;
  blogs: {
    title: string;
    excerpt: string | null;
    category: string | null;
    featured_image: string | null;
  } | null;
}

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchReadingHistory();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user!.id)
      .single();
    if (data) {
      setFullName(data.full_name || "");
      setAvatarUrl(data.avatar_url || "");
    }
  };

  const fetchReadingHistory = async () => {
    setLoadingHistory(true);
    const { data } = await supabase
      .from("reading_history")
      .select("id, blog_id, last_read_at, read_progress, reading_time_seconds, blogs(title, excerpt, category, featured_image)")
      .eq("user_id", user!.id)
      .order("last_read_at", { ascending: false })
      .limit(20);
    setReadingHistory((data as any) || []);
    setLoadingHistory(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, avatar_url: avatarUrl })
      .eq("id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-foreground/50" />
      </div>
    );
  }

  if (!user) return null;

  const continueReading = readingHistory.filter((r) => r.read_progress < 100);
  const completedReading = readingHistory.filter((r) => r.read_progress >= 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 px-4">
        <div className="container max-w-4xl space-y-8">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <User className="h-5 w-5" /> My Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-foreground/60 border-2 border-border overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    fullName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-foreground">{fullName || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email || ""} disabled className="opacity-60" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-xs text-muted-foreground">
                  Member since {new Date(user.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Continue Reading */}
          {continueReading.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display">
                  <BookOpen className="h-5 w-5" /> Continue Reading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {continueReading.map((item) => (
                    <Link
                      key={item.id}
                      to={`/blogs`}
                      className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate group-hover:underline">
                          {item.blogs?.title || "Untitled"}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {item.blogs?.category && (
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.blogs.category}</span>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {formatTime(item.reading_time_seconds)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${item.read_progress}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{item.read_progress}%</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reading History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Clock className="h-5 w-5" /> Reading History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : readingHistory.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No reading history yet</p>
                  <Link to="/blogs" className="text-sm text-foreground underline underline-offset-2 mt-2 inline-block">
                    Browse blogs →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {readingHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{item.blogs?.title || "Untitled"}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(item.last_read_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                          {" · "}{formatTime(item.reading_time_seconds)} read
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.read_progress >= 100 ? "bg-foreground/10 text-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {item.read_progress >= 100 ? "Completed" : `${item.read_progress}%`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Profile;
