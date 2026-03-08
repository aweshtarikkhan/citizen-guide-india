import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PageSection {
  id: string;
  page_slug: string;
  section_key: string;
  section_label: string;
  content_type: string;
  content: string;
  sort_order: number;
}

export const usePageContent = (pageSlug: string) => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("page_content")
        .select("*")
        .eq("page_slug", pageSlug)
        .order("sort_order", { ascending: true });
      setSections((data as PageSection[]) || []);
      setLoading(false);
    };
    fetchContent();
  }, [pageSlug]);

  const getContent = (sectionKey: string, fallback: string = ""): string => {
    const section = sections.find((s) => s.section_key === sectionKey);
    return section?.content || fallback;
  };

  const getJsonContent = <T,>(sectionKey: string, fallback: T): T => {
    const section = sections.find((s) => s.section_key === sectionKey);
    if (!section?.content) return fallback;
    try {
      return JSON.parse(section.content) as T;
    } catch {
      return fallback;
    }
  };

  return { sections, loading, getContent, getJsonContent };
};

// All pages and their editable sections
export const PAGE_DEFINITIONS: {
  slug: string;
  label: string;
  sections: { key: string; label: string; type: "text" | "textarea" | "json" | "html" }[];
}[] = [
  {
    slug: "home",
    label: "Home Page",
    sections: [
      { key: "hero_title", label: "Hero Title", type: "text" },
      { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" },
      { key: "hero_cta_primary", label: "Hero Primary Button Text", type: "text" },
      { key: "hero_cta_secondary", label: "Hero Secondary Button Text", type: "text" },
      { key: "whoweare_label", label: "Who We Are - Label", type: "text" },
      { key: "whoweare_title", label: "Who We Are - Title", type: "text" },
      { key: "whoweare_desc", label: "Who We Are - Description", type: "textarea" },
      { key: "explore_title", label: "Explore Matdaan - Title", type: "text" },
      { key: "testimonials", label: "Testimonials (JSON)", type: "json" },
      { key: "contact_title", label: "Contact Section Title", type: "text" },
      { key: "contact_desc", label: "Contact Section Description", type: "textarea" },
    ],
  },
  {
    slug: "about",
    label: "About Us",
    sections: [
      { key: "page_label", label: "Page Label", type: "text" },
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "page_desc", label: "Page Description", type: "textarea" },
      { key: "mission_title", label: "Mission Title", type: "text" },
      { key: "mission_desc", label: "Mission Description", type: "textarea" },
      { key: "vision_title", label: "Vision Title", type: "text" },
      { key: "vision_desc", label: "Vision Description", type: "textarea" },
    ],
  },
  {
    slug: "contact",
    label: "Contact",
    sections: [
      { key: "page_label", label: "Page Label", type: "text" },
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "page_desc", label: "Page Description", type: "textarea" },
      { key: "email", label: "Email Address", type: "text" },
      { key: "phone", label: "Phone Number", type: "text" },
      { key: "address", label: "Address", type: "textarea" },
    ],
  },
  {
    slug: "faq",
    label: "FAQ",
    sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "page_desc", label: "Page Description", type: "textarea" },
      { key: "faq_data", label: "FAQ Categories & Questions (JSON)", type: "json" },
    ],
  },
  {
    slug: "knowledge",
    label: "Know Your Democracy",
    sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "page_desc", label: "Page Description", type: "textarea" },
      { key: "topics", label: "Topics Data (JSON)", type: "json" },
    ],
  },
  {
    slug: "myths",
    label: "Myth Busters",
    sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "page_desc", label: "Page Description", type: "textarea" },
      { key: "myths_data", label: "Myths Data (JSON)", type: "json" },
    ],
  },
  {
    slug: "voter-rights",
    label: "Voter Rights",
    sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "page_desc", label: "Page Description", type: "textarea" },
      { key: "rights_data", label: "Rights Data (JSON)", type: "json" },
    ],
  },
  {
    slug: "election-timeline",
    label: "Election Timeline",
    sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "page_desc", label: "Page Description", type: "textarea" },
      { key: "phases_data", label: "Phases Data (JSON)", type: "json" },
    ],
  },
  {
    slug: "important-forms",
    label: "Important Forms",
    sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "page_desc", label: "Page Description", type: "textarea" },
      { key: "forms_data", label: "Forms Data (JSON)", type: "json" },
    ],
  },
  {
    slug: "election-results",
    label: "Election Results & News",
    sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "page_desc", label: "Page Description", type: "textarea" },
      { key: "election_data", label: "Election Data (JSON)", type: "json" },
    ],
  },
  {
    slug: "political-parties",
    label: "Political Parties",
    sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "page_desc", label: "Page Description", type: "textarea" },
      { key: "national_parties", label: "National Parties (JSON)", type: "json" },
      { key: "state_parties", label: "State Parties (JSON)", type: "json" },
    ],
  },
  {
    slug: "constitution-laws",
    label: "Constitution & Laws",
    sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "page_desc", label: "Page Description", type: "textarea" },
      { key: "articles", label: "Fundamental Articles (JSON)", type: "json" },
      { key: "key_laws", label: "Key Laws (JSON)", type: "json" },
      { key: "amendments", label: "Amendments (JSON)", type: "json" },
    ],
  },
  {
    slug: "help-desk",
    label: "Voter Help Desk",
    sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "page_desc", label: "Page Description", type: "textarea" },
      { key: "services_data", label: "Services Data (JSON)", type: "json" },
    ],
  },
  {
    slug: "join-us",
    label: "Join Us",
    sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "page_desc", label: "Page Description", type: "textarea" },
      { key: "benefits_title", label: "Benefits Section Title", type: "text" },
    ],
  },
];
