export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blogs: {
        Row: {
          author_id: string
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          external_links: Json | null
          featured_image: string | null
          id: string
          images: string[] | null
          published_at: string | null
          social_links: Json | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          external_links?: Json | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          published_at?: string | null
          social_links?: Json | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          external_links?: Json | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          published_at?: string | null
          social_links?: Json | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      candidate_cache: {
        Row: {
          age: number | null
          candidate_id: string
          candidate_name: string
          constituency: string
          criminal_cases: number | null
          criminal_details: Json | null
          detail_scraped: boolean | null
          education: string | null
          id: string
          immovable_assets: Json | null
          income_details: Json | null
          liabilities: string | null
          movable_assets: Json | null
          myneta_url: string | null
          pan_status: string | null
          party: string | null
          raw_markdown: string | null
          scraped_at: string | null
          self_profession: string | null
          source_of_income: Json | null
          spouse_profession: string | null
          total_assets: string | null
        }
        Insert: {
          age?: number | null
          candidate_id: string
          candidate_name: string
          constituency: string
          criminal_cases?: number | null
          criminal_details?: Json | null
          detail_scraped?: boolean | null
          education?: string | null
          id?: string
          immovable_assets?: Json | null
          income_details?: Json | null
          liabilities?: string | null
          movable_assets?: Json | null
          myneta_url?: string | null
          pan_status?: string | null
          party?: string | null
          raw_markdown?: string | null
          scraped_at?: string | null
          self_profession?: string | null
          source_of_income?: Json | null
          spouse_profession?: string | null
          total_assets?: string | null
        }
        Update: {
          age?: number | null
          candidate_id?: string
          candidate_name?: string
          constituency?: string
          criminal_cases?: number | null
          criminal_details?: Json | null
          detail_scraped?: boolean | null
          education?: string | null
          id?: string
          immovable_assets?: Json | null
          income_details?: Json | null
          liabilities?: string | null
          movable_assets?: Json | null
          myneta_url?: string | null
          pan_status?: string | null
          party?: string | null
          raw_markdown?: string | null
          scraped_at?: string | null
          self_profession?: string | null
          source_of_income?: Json | null
          spouse_profession?: string | null
          total_assets?: string | null
        }
        Relationships: []
      }
      constituency_overrides: {
        Row: {
          constituency_name: string
          id: string
          mp_name: string | null
          party: string | null
          state_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          constituency_name: string
          id?: string
          mp_name?: string | null
          party?: string | null
          state_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          constituency_name?: string
          id?: string
          mp_name?: string | null
          party?: string | null
          state_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      exit_polls: {
        Row: {
          agency: string
          created_at: string
          created_by: string | null
          id: string
          is_featured: boolean
          methodology: string | null
          poll_date: string | null
          predictions: Json
          sample_size: string | null
          sort_order: number
          source_url: string | null
          state_name: string
          state_slug: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          agency: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_featured?: boolean
          methodology?: string | null
          poll_date?: string | null
          predictions?: Json
          sample_size?: string | null
          sort_order?: number
          source_url?: string | null
          state_name: string
          state_slug: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          agency?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_featured?: boolean
          methodology?: string | null
          poll_date?: string | null
          predictions?: Json
          sample_size?: string | null
          sort_order?: number
          source_url?: string | null
          state_name?: string
          state_slug?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      live_results: {
        Row: {
          alliance: string | null
          candidate_name: string
          constituency: string
          created_at: string
          fetched_at: string
          id: string
          is_leading: boolean
          party: string | null
          round_number: number | null
          state_slug: string
          status: string
          total_rounds: number | null
          votes: number
        }
        Insert: {
          alliance?: string | null
          candidate_name: string
          constituency: string
          created_at?: string
          fetched_at?: string
          id?: string
          is_leading?: boolean
          party?: string | null
          round_number?: number | null
          state_slug: string
          status?: string
          total_rounds?: number | null
          votes?: number
        }
        Update: {
          alliance?: string | null
          candidate_name?: string
          constituency?: string
          created_at?: string
          fetched_at?: string
          id?: string
          is_leading?: boolean
          party?: string | null
          round_number?: number | null
          state_slug?: string
          status?: string
          total_rounds?: number | null
          votes?: number
        }
        Relationships: []
      }
      live_status: {
        Row: {
          id: string
          is_active: boolean
          last_error: string | null
          last_run_at: string | null
          last_success_at: string | null
          states_active: string[] | null
          updated_at: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          last_error?: string | null
          last_run_at?: string | null
          last_success_at?: string | null
          states_active?: string[] | null
          updated_at?: string
        }
        Update: {
          id?: string
          is_active?: boolean
          last_error?: string | null
          last_run_at?: string | null
          last_success_at?: string | null
          states_active?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content: string
          content_type: string
          id: string
          page_slug: string
          section_key: string
          section_label: string
          sort_order: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: string
          content_type?: string
          id?: string
          page_slug: string
          section_key: string
          section_label?: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string
          content_type?: string
          id?: string
          page_slug?: string
          section_key?: string
          section_label?: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          game_high_score: number
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          game_high_score?: number
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          game_high_score?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reading_history: {
        Row: {
          blog_id: string
          created_at: string
          id: string
          last_read_at: string
          read_progress: number
          reading_time_seconds: number
          user_id: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          id?: string
          last_read_at?: string
          read_progress?: number
          reading_time_seconds?: number
          user_id: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          id?: string
          last_read_at?: string
          read_progress?: number
          reading_time_seconds?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_history_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      translation_cache: {
        Row: {
          created_at: string
          id: string
          source_lang: string
          source_text_hash: string
          target_lang: string
          translated_text: string
        }
        Insert: {
          created_at?: string
          id?: string
          source_lang?: string
          source_text_hash: string
          target_lang: string
          translated_text: string
        }
        Update: {
          created_at?: string
          id?: string
          source_lang?: string
          source_text_hash?: string
          target_lang?: string
          translated_text?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteer_applications: {
        Row: {
          availability: string
          created_at: string | null
          email: string
          experience: string | null
          full_name: string
          id: string
          phone: string
          resume_url: string | null
          skills: string[] | null
          status: string | null
          updated_at: string | null
          why_join_us: string
        }
        Insert: {
          availability: string
          created_at?: string | null
          email: string
          experience?: string | null
          full_name: string
          id?: string
          phone: string
          resume_url?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
          why_join_us: string
        }
        Update: {
          availability?: string
          created_at?: string | null
          email?: string
          experience?: string | null
          full_name?: string
          id?: string
          phone?: string
          resume_url?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
          why_join_us?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_super_admin: { Args: { uid: string }; Returns: boolean }
      is_super_or_vice: { Args: { uid: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "editor"
        | "super_admin"
        | "vice_super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "moderator",
        "user",
        "editor",
        "super_admin",
        "vice_super_admin",
      ],
    },
  },
} as const
