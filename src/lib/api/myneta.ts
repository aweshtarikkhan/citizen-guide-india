import { supabase } from '@/integrations/supabase/client';

export interface CandidateSummary {
  candidate_id: string;
  constituency: string;
  candidate_name: string;
  party: string;
  criminal_cases: number;
  education: string;
  total_assets: string;
  liabilities: string;
  myneta_url: string;
}

export interface CandidateDetail extends CandidateSummary {
  age: number | null;
  self_profession: string | null;
  spouse_profession: string | null;
  pan_status: string | null;
  income_details: any;
  criminal_details: any;
  movable_assets: any;
  immovable_assets: any;
  source_of_income: any;
  raw_markdown: string | null;
  detail_scraped: boolean;
  scraped_at: string;
}

export const mynetaApi = {
  // Get all winners (from cache or scrape)
  async getWinners(): Promise<{ success: boolean; data?: CandidateSummary[]; error?: string }> {
    // First try cache
    const { data: cached, error: cacheError } = await supabase
      .from('candidate_cache')
      .select('candidate_id, constituency, candidate_name, party, criminal_cases, education, total_assets, liabilities, myneta_url')
      .order('constituency');

    if (!cacheError && cached && cached.length > 100) {
      return { success: true, data: cached as CandidateSummary[] };
    }

    // Scrape via edge function
    const { data, error } = await supabase.functions.invoke('scrape-myneta-winners');
    if (error) return { success: false, error: error.message };
    return data;
  },

  // Get single candidate details
  async getCandidateDetail(candidateId: string): Promise<{ success: boolean; data?: CandidateDetail; error?: string }> {
    const { data, error } = await supabase.functions.invoke('scrape-myneta-candidate', {
      body: { candidate_id: candidateId },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  // Search candidates from cache
  async searchCandidates(query: string): Promise<CandidateSummary[]> {
    const { data } = await supabase
      .from('candidate_cache')
      .select('candidate_id, constituency, candidate_name, party, criminal_cases, education, total_assets, liabilities, myneta_url')
      .or(`candidate_name.ilike.%${query}%,constituency.ilike.%${query}%`)
      .order('constituency')
      .limit(50);
    return (data as CandidateSummary[]) || [];
  },

  // Get candidate by constituency name
  async getByConstituency(constituencyName: string): Promise<CandidateSummary | null> {
    const { data } = await supabase
      .from('candidate_cache')
      .select('candidate_id, constituency, candidate_name, party, criminal_cases, education, total_assets, liabilities, myneta_url')
      .ilike('constituency', `%${constituencyName}%`)
      .limit(1)
      .single();
    return data as CandidateSummary | null;
  },
};
