# Project Memory

## Core
- Platform: Matdaan, Voter Help Centre simplifying Indian democratic processes. Temporal context is March 2026.
- Aesthetic: Minimalist B&W. Fonts: Quicksand (primary), Alegreya (MATDAAN brand). Party colors (BJP orange, INC blue) for data.
- Stack: Supabase (Auth, DB, Edge), Plain Leaflet (react-leaflet disabled for React 18 bugs), Gemini Flash (AI/Translation).
- Rules: NO category filters (GEN/SC/ST) in UI.
- Auth: Logout action is strictly restricted to the Admin sidebar to prevent accidental sign-outs.

## Memories
- [Color Palette](mem://style/color-palette) — Minimalist B&W aesthetic, specific party colors for data visualization
- [Typography](mem://style/typography) — Quicksand primary, Alegreya for brand, Admin global override
- [Brand Identity](mem://brand/identity) — Circular logo with ink mark, translated brand name across 14 languages
- [State Data Pages](mem://features/state-data-pages) — High-density data, static isolated interactive state maps, MLA tables
- [About Us](mem://features/about-us-page) — Animation, timeline, interactive India map, 4-step methodology
- [Join Us Recruitment](mem://features/join-us-recruitment) — Multi-field application form linked from About Us
- [Constituency Database](mem://features/constituency-database) — 543 LS seats, synced dropdowns, filters excluded
- [Candidate Scraping](mem://features/candidate-data-scraping) — Firecrawl MyNeta.info scraping, Supabase caching
- [Civic Engagement](mem://features/civic-engagement-tools) — Gemini AI Voting Assistant, quiz, daily fact, 2026 countdown
- [Blog System](mem://features/blog-system) — Rich text, Editor/Admin roles, image galleries
- [Map Engine](mem://tech-stack/map-engine) — Plain Leaflet initialized in ref, strict SVG background control
- [FAQ Knowledge Base](mem://features/faq-knowledge-base) — 80+ Q&A pairs organized into 10 categories
- [Constituency Details](mem://features/constituency-detail-pages) — 6-card grid for Lok Sabha statistics, candidate profiles
- [Assembly Dataset](mem://data/assembly-constituency-dataset) — 4100+ Vidhan Sabha constituencies, ongoing audit for gaps
- [Temporal Context](mem://general/temporal-context) — Fixed to March 2026, specific upcoming election dates
- [Navigation Structure](mem://navigation/structure) — Multi-page structure, conditional auth, admin sidebar logout
- [Admin UX](mem://auth/admin-ux) — Dashboard floating action button, quick-save, live site view
- [Backend Stack](mem://tech-stack/backend) — Supabase, Edge Functions for Gemini Flash, Storage buckets
- [Admin System](mem://auth/admin-system) — Role-based access, Constituency Manager, Site Settings config
- [CMS Site-Wide](mem://cms/site-wide) — Custom section-wise CMS using Supabase database
- [Translation AI](mem://translation/ai-system) — Gemini Flash for 22 languages, database cache for optimization
- [Constituency Visualization](mem://features/constituency-visualization) — Interactive donut pie chart for 2024 seat distribution
- [Lok Sabha 2024](mem://data/lok-sabha-2024) — Official verified results, audit corrections
- [Upcoming Elections](mem://features/upcoming-election-pages) — 2026 state assembly elections, party profiles, manifestos
- [Role Hierarchy](mem://auth/role-hierarchy) — Super Admin > Vice Super Admin > Admin > Editor, DB-level protection
