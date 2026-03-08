const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if we already have cached data
    const { count } = await supabase
      .from('candidate_cache')
      .select('*', { count: 'exact', head: true });

    if (count && count > 500) {
      // Return cached data
      const { data: cached } = await supabase
        .from('candidate_cache')
        .select('candidate_id, constituency, candidate_name, party, criminal_cases, education, total_assets, liabilities, myneta_url')
        .order('constituency');
      return new Response(
        JSON.stringify({ success: true, data: cached, source: 'cache' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Scraping MyNeta winners list...');

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://www.myneta.info/LokSabha2024/index.php?action=show_winners&sort=default',
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 3000,
      }),
    });

    const scrapeData = await response.json();
    
    if (!response.ok) {
      console.error('Firecrawl error:', scrapeData);
      return new Response(
        JSON.stringify({ success: false, error: scrapeData.error || 'Scrape failed' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
    
    // Parse the winners table from markdown
    const candidates = parseWinnersTable(markdown);
    console.log(`Parsed ${candidates.length} candidates`);

    if (candidates.length > 0) {
      // Upsert in batches of 50
      for (let i = 0; i < candidates.length; i += 50) {
        const batch = candidates.slice(i, i + 50);
        const { error } = await supabase
          .from('candidate_cache')
          .upsert(batch, { onConflict: 'candidate_id' });
        if (error) console.error('Upsert error batch', i, error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: candidates, count: candidates.length, source: 'scraped' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parseWinnersTable(markdown: string) {
  const candidates: any[] = [];
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    // Match table rows with candidate links
    // Pattern: | Sno | [Name](url) | Constituency | Party | Criminal | Education | Assets | Liabilities |
    const candidateMatch = line.match(/\[([^\]]+)\]\(https:\/\/www\.myneta\.info\/LokSabha2024\/candidate\.php\?candidate_id=(\d+)\)/);
    
    if (candidateMatch) {
      const candidateName = candidateMatch[1];
      const candidateId = candidateMatch[2];
      const mynetaUrl = `https://www.myneta.info/LokSabha2024/candidate.php?candidate_id=${candidateId}`;
      
      // Split the row by | to get columns
      const cols = line.split('|').map(c => c.trim()).filter(c => c);
      
      if (cols.length >= 7) {
        // cols: [Sno, Candidate(link), Constituency, Party, Criminal, Education, Assets, Liabilities]
        const constituency = cols[2]?.replace(/\s*\(.*?\)\s*$/, '').trim() || '';
        const party = cols[3]?.trim() || '';
        const criminalStr = cols[4]?.replace(/\*\*/g, '').trim() || '0';
        const criminalCases = parseInt(criminalStr) || 0;
        const education = cols[5]?.trim() || '';
        const totalAssets = cols[6]?.replace(/<br>/g, ' ').trim() || '';
        const liabilities = cols[7]?.replace(/<br>/g, ' ').trim() || '';
        
        candidates.push({
          candidate_id: candidateId,
          candidate_name: candidateName,
          constituency,
          party,
          criminal_cases: criminalCases,
          education,
          total_assets: totalAssets,
          liabilities,
          myneta_url: mynetaUrl,
        });
      }
    }
  }
  
  return candidates;
}
