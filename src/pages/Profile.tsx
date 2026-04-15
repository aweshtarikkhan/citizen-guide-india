import { useState, useEffect, useRef } from "react";
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
import { User, BookOpen, Clock, LogOut, Save, Loader2, Upload, Sparkles, Camera } from "lucide-react";
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

const MAX_FILE_SIZE = 500 * 1024; // 500KB

const compressImage = (file: File, maxSizeKB = 500): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // Scale down if too large
      const maxDim = 512;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      // Try progressively lower quality
      let quality = 0.85;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Compression failed"));
            if (blob.size <= maxSizeKB * 1024 || quality <= 0.3) {
              resolve(blob);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          },
          "image/jpeg",
          quality
        );
      };
      tryCompress();
    };
    img.onerror = reject;
  });
};

const Profile = () => {
  const { user, loading: authLoading, signOut, profileName: ctxName, profileAvatar: ctxAvatar, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generatingAvatar, setGeneratingAvatar] = useState(false);
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      let uploadBlob: Blob = file;

      // Compress if larger than 500KB
      if (file.size > MAX_FILE_SIZE) {
        toast({ title: "Compressing image...", description: "File is larger than 500KB, compressing automatically" });
        uploadBlob = await compressImage(file);
      }

      const ext = "jpg";
      const filePath = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, uploadBlob, { upsert: true, contentType: "image/jpeg" });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const newUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      await supabase.from("profiles").update({ avatar_url: newUrl }).eq("id", user.id);
      setAvatarUrl(newUrl);
      await refreshProfile();
      toast({ title: "Profile picture updated!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleGenerateAvatar = async () => {
    if (!user) return;
    setGeneratingAvatar(true);
    try {
      const prompt = `Generate a simple, friendly, colorful cartoon avatar portrait for a person named "${fullName || "User"}". Clean background, vibrant colors, suitable as a profile picture. on a solid white background`;

      const { data, error } = await supabase.functions.invoke("generate-avatar", {
        body: { prompt, userId: user.id },
      });

      if (error) throw error;
      if (data?.avatarUrl) {
        setAvatarUrl(data.avatarUrl);
        await supabase.from("profiles").update({ avatar_url: data.avatarUrl }).eq("id", user.id);
        await refreshProfile();
        toast({ title: "AI Avatar generated!" });
      }
    } catch (err: any) {
      toast({ title: "Avatar generation failed", description: err.message || "Try again later", variant: "destructive" });
    } finally {
      setGeneratingAvatar(false);
    }
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
      await refreshProfile();
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 px-4">
        <div className="container max-w-4xl space-y-8">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <User className="h-5 w-5" /> {fullName || user.email?.split("@")[0] || "My Profile"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar Section */}
              <div className="flex items-center gap-5 mb-4">
                <div className="relative group">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-foreground/60 border-2 border-border overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      fullName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-foreground/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="h-5 w-5 text-background animate-spin" /> : <Camera className="h-5 w-5 text-background" />}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-lg text-foreground">{fullName || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      <Upload className="h-3.5 w-3.5 mr-1" /> {uploading ? "Uploading..." : "Upload Photo"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleGenerateAvatar} disabled={generatingAvatar}>
                      <Sparkles className="h-3.5 w-3.5 mr-1" /> {generatingAvatar ? "Generating..." : "AI Avatar"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Max 500KB • Auto-compressed if larger</p>
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
