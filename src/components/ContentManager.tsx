import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PAGE_DEFINITIONS } from "@/hooks/usePageContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, Save, Loader2, ArrowLeft, FileText, Check } from "lucide-react";

interface PageSection {
  id?: string;
  page_slug: string;
  section_key: string;
  section_label: string;
  content_type: string;
  content: string;
  sort_order: number;
}

const ContentManager = () => {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [editedSections, setEditedSections] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedPageDef = PAGE_DEFINITIONS.find((p) => p.slug === selectedPage);

  useEffect(() => {
    if (selectedPage) fetchPageContent(selectedPage);
  }, [selectedPage]);

  const fetchPageContent = async (slug: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("page_content")
      .select("*")
      .eq("page_slug", slug)
      .order("sort_order", { ascending: true });
    
    const existing = (data as PageSection[]) || [];
    setSections(existing);
    
    // Pre-fill edited sections with existing content
    const edited: Record<string, string> = {};
    existing.forEach((s) => { edited[s.section_key] = s.content; });
    setEditedSections(edited);
    setLoading(false);
  };

  const handleContentChange = (key: string, value: string) => {
    setEditedSections((prev) => ({ ...prev, [key]: value }));
  };

  const saveAllSections = async () => {
    if (!selectedPage || !selectedPageDef) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();

    for (const sectionDef of selectedPageDef.sections) {
      const content = editedSections[sectionDef.key] || "";
      const existing = sections.find((s) => s.section_key === sectionDef.key);

      if (existing) {
        await supabase
          .from("page_content")
          .update({ 
            content, 
            updated_at: new Date().toISOString(),
            updated_by: user?.id 
          } as any)
          .eq("id", existing.id);
      } else {
        await supabase
          .from("page_content")
          .insert({
            page_slug: selectedPage,
            section_key: sectionDef.key,
            section_label: sectionDef.label,
            content_type: sectionDef.type,
            content,
            sort_order: selectedPageDef.sections.indexOf(sectionDef),
            updated_by: user?.id,
          } as any);
      }
    }

    toast({ title: "Content saved!", description: `${selectedPageDef.label} updated successfully.` });
    await fetchPageContent(selectedPage);
    setSaving(false);
  };

  // Page selection view
  if (!selectedPage) {
    return (
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">Content Manager</h2>
        <p className="text-muted-foreground mb-6">Select a page to edit its content</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PAGE_DEFINITIONS.map((page) => (
            <Card
              key={page.slug}
              className="cursor-pointer hover:border-foreground/30 transition-colors group"
              onClick={() => setSelectedPage(page.slug)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{page.label}</h3>
                    <p className="text-xs text-muted-foreground">{page.sections.length} sections</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Section editing view
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedPage(null); setSections([]); setEditedSections({}); }}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div>
            <h2 className="text-2xl font-display font-bold">{selectedPageDef?.label}</h2>
            <p className="text-xs text-muted-foreground">{selectedPageDef?.sections.length} editable sections</p>
          </div>
        </div>
        <Button onClick={saveAllSections} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save All Changes
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {selectedPageDef?.sections.map((sectionDef, index) => {
            const existingSection = sections.find((s) => s.section_key === sectionDef.key);
            const hasContent = !!existingSection;

            return (
              <Card key={sectionDef.key}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <span className="text-muted-foreground">#{index + 1}</span>
                      {sectionDef.label}
                      <Badge variant={sectionDef.type === "json" ? "outline" : "secondary"} className="text-xs ml-2">
                        {sectionDef.type}
                      </Badge>
                    </CardTitle>
                    {hasContent && (
                      <Badge variant="default" className="text-xs gap-1">
                        <Check className="h-3 w-3" /> Saved
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {sectionDef.type === "text" ? (
                    <Input
                      value={editedSections[sectionDef.key] || ""}
                      onChange={(e) => handleContentChange(sectionDef.key, e.target.value)}
                      placeholder={`Enter ${sectionDef.label.toLowerCase()}...`}
                    />
                  ) : sectionDef.type === "textarea" || sectionDef.type === "html" ? (
                    <Textarea
                      value={editedSections[sectionDef.key] || ""}
                      onChange={(e) => handleContentChange(sectionDef.key, e.target.value)}
                      placeholder={`Enter ${sectionDef.label.toLowerCase()}...`}
                      rows={4}
                    />
                  ) : sectionDef.type === "json" ? (
                    <div>
                      <Textarea
                        value={editedSections[sectionDef.key] || ""}
                        onChange={(e) => handleContentChange(sectionDef.key, e.target.value)}
                        placeholder={`Enter JSON data for ${sectionDef.label.toLowerCase()}...`}
                        rows={10}
                        className="font-mono text-xs"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        ⚠️ JSON format required. Invalid JSON will break the page display.
                      </p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContentManager;
