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
    const { candidate_id } = await req.json();

    if (!candidate_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'candidate_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if detail already scraped
    const { data: cached } = await supabase
      .from('candidate_cache')
      .select('*')
      .eq('candidate_id', candidate_id)
      .eq('detail_scraped', true)
      .single();

    if (cached) {
      return new Response(
        JSON.stringify({ success: true, data: cached, source: 'cache' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = `https://www.myneta.info/LokSabha2024/candidate.php?candidate_id=${candidate_id}`;
    console.log('Scraping candidate:', url);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 2000,
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
    const parsed = parseCandidateDetail(markdown);

    // Update cache
    const { error: upsertError } = await supabase
      .from('candidate_cache')
      .upsert({
        candidate_id,
        candidate_name: parsed.name || 'Unknown',
        constituency: parsed.constituency || 'Unknown',
        party: parsed.party,
        criminal_cases: parsed.criminalCases,
        education: parsed.education,
        total_assets: parsed.totalAssets,
        liabilities: parsed.liabilities,
        age: parsed.age,
        self_profession: parsed.selfProfession,
        spouse_profession: parsed.spouseProfession,
        pan_status: parsed.panStatus,
        income_details: parsed.incomeDetails,
        criminal_details: parsed.criminalDetails,
        source_of_income: parsed.sourceOfIncome,
        raw_markdown: markdown,
        detail_scraped: true,
        myneta_url: url,
        scraped_at: new Date().toISOString(),
      }, { onConflict: 'candidate_id' });

    if (upsertError) console.error('Upsert error:', upsertError);

    // Fetch the full record back
    const { data: updated } = await supabase
      .from('candidate_cache')
      .select('*')
      .eq('candidate_id', candidate_id)
      .single();

    return new Response(
      JSON.stringify({ success: true, data: updated || parsed, source: 'scraped' }),
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

function parseCandidateDetail(markdown: string) {
  const result: any = {
    name: '',
    constituency: '',
    party: '',
    criminalCases: 0,
    education: '',
    educationDetails: '',
    totalAssets: '',
    liabilities: '',
    age: null,
    selfProfession: '',
    spouseProfession: '',
    panStatus: '',
    incomeDetails: null,
    criminalDetails: null,
    sourceOfIncome: null,
  };

  // Extract name
  const nameMatch = markdown.match(/##\s+(.+?)\s*\(Winner\)/);
  if (nameMatch) result.name = nameMatch[1].trim();

  // Constituency
  const constMatch = markdown.match(/#{3,5}\s+(.+?)\s*\(/);
  if (constMatch) result.constituency = constMatch[1].trim();

  // Party
  const partyMatch = markdown.match(/\*\*Party:\*\*\s*(.+)/);
  if (partyMatch) result.party = partyMatch[1].trim();

  // Age
  const ageMatch = markdown.match(/\*\*Age:\*\*\s*(\d+)/);
  if (ageMatch) result.age = parseInt(ageMatch[1]);

  // Self Profession
  const profMatch = markdown.match(/\*\*Self Profession:\*\*\s*(.+)/);
  if (profMatch) result.selfProfession = profMatch[1].trim();

  // Spouse Profession
  const spouseMatch = markdown.match(/\*\*Spouse Profession:\*\*\s*(.+)/);
  if (spouseMatch) result.spouseProfession = spouseMatch[1].trim();

  // Criminal cases count
  const crimMatch = markdown.match(/Number of Criminal Cases:\s*(\d+)/);
  if (crimMatch) result.criminalCases = parseInt(crimMatch[1]);

  // Education
  const eduSection = markdown.match(/### Educational Details[\s\S]*?Category:\s*(.+)/);
  if (eduSection) result.education = eduSection[1].trim();
  
  // Education details (everything between Educational Details and next section)
  const eduDetailMatch = markdown.match(/### Educational Details[\s\S]*?\n\n([\s\S]*?)(?=\n###|\n\*\*Data Readability)/);
  if (eduDetailMatch) result.educationDetails = eduDetailMatch[1].trim();

  // Assets
  const assetsMatch = markdown.match(/Assets:\s*\|\s*\*\*(.+?)\*\*/);
  if (assetsMatch) result.totalAssets = assetsMatch[1].trim();

  // Liabilities
  const liabMatch = markdown.match(/Liabilities:\s*\|\s*\*\*(.+?)\*\*/);
  if (liabMatch) result.liabilities = liabMatch[1].trim();

  // PAN details
  const panSection = markdown.match(/### Details of PAN and status of Income Tax return([\s\S]*?)(?=\n###)/);
  if (panSection) {
    result.panStatus = panSection[1].trim();
    
    // Parse income details from the ITR table
    const incomeEntries: any[] = [];
    const itrRows = panSection[1].match(/\| (self|spouse|huf|dependent\d*) \| (Y|N) \|(.+)\|/g);
    if (itrRows) {
      for (const row of itrRows) {
        const parts = row.split('|').map(p => p.trim()).filter(p => p);
        if (parts.length >= 3) {
          incomeEntries.push({
            relation: parts[0],
            panGiven: parts[1],
            details: parts.slice(2).join(' ').replace(/\*\*/g, '').trim(),
          });
        }
      }
    }
    if (incomeEntries.length > 0) result.incomeDetails = incomeEntries;
  }

  // Criminal details
  const crimSection = markdown.match(/### Details of Criminal Cases([\s\S]*?)(?=### Details of Movable|### Educational|$)/);
  if (crimSection) {
    const ipcMatch = crimSection[1].match(/Brief Details of IPC[\s\S]*?((?:-\s*.+\n?)+)/);
    const charges: string[] = [];
    if (ipcMatch) {
      const chargeLines = ipcMatch[1].match(/-\s*(.+)/g);
      if (chargeLines) {
        for (const cl of chargeLines) {
          charges.push(cl.replace(/^-\s*/, '').trim());
        }
      }
    }
    
    // Check for convicted cases
    const convictedMatch = crimSection[1].includes('No Cases') ? false : true;
    
    result.criminalDetails = {
      charges,
      hasConvictions: convictedMatch && !crimSection[1].match(/Cases where Convicted[\s\S]*?No Cases/),
    };
  }

  // Source of income
  const incomeSection = markdown.match(/### Sources Of Income[\s\S]*?\| Self \| \*\*(.+?)\*\*/);
  if (incomeSection) {
    const sourceEntries: any = { self: incomeSection[1].trim() };
    const spouseIncome = markdown.match(/### Sources Of Income[\s\S]*?\| Spouse \| \*\*(.+?)\*\*/);
    if (spouseIncome) sourceEntries.spouse = spouseIncome[1].trim();
    result.sourceOfIncome = sourceEntries;
  }

  return result;
}
