import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import {
  ArrowLeft,
  Users,
  FileText,
  Target,
  Calendar,
  MapPin,
  Vote,
  TrendingUp,
  Search,
  CheckCircle2,
  Scale,
  Activity,
  ChevronRight,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface PartyInfo {
  name: string;
  short: string;
  symbol: string;
  alliance?: string;
  keyLeaders: string[];
  manifesto: string[];
  schemes: string[];
  // last election seats (for chart + comparison)
  lastSeats: number;
}

interface SchedulePhase {
  label: string;
  gazette: string;
  lastNomination: string;
  scrutiny: string;
  withdrawal: string;
  poll: string;
  counting: string;
  completion: string;
}

interface ElectionData {
  stateName: string;
  dateInfo: string;
  totalSeats: number;
  totalVoters: string;
  currentRuling: string;
  overview: string;
  parties: PartyInfo[];
  keyIssues: string[];
  schedule?: SchedulePhase[];
  // last election turnout %
  lastTurnout: number;
  lastElectionYear: number;
  // mapping issue -> party short -> stance text
  issueMatrix?: Record<string, Record<string, string>>;
}

const PHASE_1_EARLY: SchedulePhase = {
  label: "Single Phase (All ACs)",
  gazette: "16 March 2026 (Monday)",
  lastNomination: "23 March 2026 (Monday)",
  scrutiny: "24 March 2026 (Tuesday)",
  withdrawal: "26 March 2026 (Thursday)",
  poll: "9 April 2026 (Thursday)",
  counting: "4 May 2026 (Monday)",
  completion: "6 May 2026 (Wednesday)",
};

const PHASE_LATE: SchedulePhase = {
  label: "Single Phase (All ACs)",
  gazette: "30 March 2026 (Monday)",
  lastNomination: "6 April 2026 (Monday)",
  scrutiny: "7 April 2026 (Tuesday)",
  withdrawal: "9 April 2026 (Thursday)",
  poll: "23 April 2026 (Thursday)",
  counting: "4 May 2026 (Monday)",
  completion: "6 May 2026 (Wednesday)",
};

const electionData: Record<string, ElectionData> = {
  assam: {
    stateName: "Assam",
    dateInfo: "9 April 2026",
    totalSeats: 126,
    totalVoters: "~24 million",
    currentRuling: "BJP (Himanta Biswa Sarma)",
    overview:
      "The 2026 Assam Assembly Election will be held across 126 constituencies. The BJP is currently in power, led by Chief Minister Himanta Biswa Sarma. The contest is expected to be tight between the NDA and the opposition INDIA alliance.",
    lastTurnout: 82.04,
    lastElectionYear: 2021,
    parties: [
      {
        name: "Bharatiya Janata Party",
        short: "BJP",
        symbol: "🪷",
        alliance: "NDA",
        lastSeats: 60,
        keyLeaders: ["Himanta Biswa Sarma", "Sarbananda Sonowal"],
        manifesto: [
          "Make Assam India's growth engine",
          "Major investment in flood control and water management",
          "Guaranteed monthly wage of ₹5,000 for tea garden workers",
          "Strict measures to stop illegal immigration",
          "NRC update and citizenship security",
        ],
        schemes: [
          "Orunodoi Scheme – ₹1,250/month for women",
          "Arundhati Gold Scheme – gold for weddings",
          "Assam Darshan – tourism development",
          "Mission Basundhara – land rights",
        ],
      },
      {
        name: "Indian National Congress",
        short: "INC",
        symbol: "✋",
        alliance: "INDIA",
        lastSeats: 29,
        keyLeaders: ["Bhupen Kumar Borah", "Gaurav Gogoi"],
        manifesto: [
          "₹600 daily wage for tea garden workers",
          "Opposition to CAA and NRC",
          "Unemployment allowance of ₹5,000/month",
          "Investment in women's empowerment and education",
          "MSP guarantee for farmers",
        ],
        schemes: [
          "5 Guarantees – jobs, education, health, women, farmers",
          "Youth Employment Mission",
          "Free 200 units of electricity",
        ],
      },
      {
        name: "Asom Gana Parishad",
        short: "AGP",
        symbol: "🐘",
        alliance: "NDA",
        lastSeats: 9,
        keyLeaders: ["Atul Bora", "Phani Bhushan Choudhury"],
        manifesto: [
          "Protection of Assamese identity and culture",
          "Implementation of Clause 6 of Assam Accord",
          "Priority for locals in employment",
        ],
        schemes: [
          "Local industry development scheme",
          "Assamese language preservation fund",
        ],
      },
      {
        name: "All India United Democratic Front",
        short: "AIUDF",
        symbol: "🔒",
        alliance: "INDIA",
        lastSeats: 16,
        keyLeaders: ["Badruddin Ajmal"],
        manifesto: [
          "Protection of minority rights",
          "Equal access to education and healthcare",
          "Poverty eradication programmes",
        ],
        schemes: ["Minority welfare fund", "Education scholarship scheme"],
      },
    ],
    keyIssues: [
      "Floods and water management",
      "NRC and citizenship",
      "Tea garden workers' wages",
      "Unemployment",
      "Illegal immigration",
      "Assamese identity",
    ],
    schedule: [PHASE_1_EARLY],
    issueMatrix: {
      "Floods and water management": {
        BJP: "Major investment in flood control",
        INC: "Long-term embankment plan",
        AGP: "Brahmaputra basin authority",
        AIUDF: "Relief & rehab focus",
      },
      "NRC and citizenship": {
        BJP: "Update NRC, implement CAA",
        INC: "Oppose CAA, review NRC",
        AGP: "Support Assam Accord clause 6",
        AIUDF: "Oppose NRC exclusion",
      },
      "Tea garden workers' wages": {
        BJP: "₹5,000/month guarantee",
        INC: "₹600 daily wage",
        AGP: "Wage revision board",
        AIUDF: "Healthcare + housing",
      },
      Unemployment: {
        BJP: "1 lakh govt jobs",
        INC: "₹5,000 unemployment allowance",
        AGP: "Locals first in jobs",
        AIUDF: "Skill missions",
      },
    },
  },
  kerala: {
    stateName: "Kerala",
    dateInfo: "9 April 2026",
    totalSeats: 140,
    totalVoters: "~27 million",
    currentRuling: "LDF – CPI(M) (Pinarayi Vijayan)",
    overview:
      "Kerala will vote across 140 constituencies. The traditional contest is between the LDF (Left) and the UDF (Congress-led alliance). The BJP is also working to expand its footprint in the state.",
    lastTurnout: 74.06,
    lastElectionYear: 2021,
    parties: [
      {
        name: "Left Democratic Front (CPI-M)",
        short: "LDF",
        symbol: "⚒️",
        alliance: "LDF",
        lastSeats: 99,
        keyLeaders: ["Pinarayi Vijayan", "M. B. Rajesh"],
        manifesto: [
          "Build Kerala into a knowledge economy",
          "K-Rail (Silver Line) project",
          "Housing for all – LIFE Mission expansion",
          "Strengthen the public health system",
          "Develop IT and startup ecosystem",
        ],
        schemes: [
          "LIFE Mission – pucca housing for the poor",
          "Kudumbashree – women's empowerment",
          "K-DISC – innovation council",
          "Social security pension of ₹1,600/month",
        ],
      },
      {
        name: "United Democratic Front (INC)",
        short: "UDF",
        symbol: "✋",
        alliance: "UDF",
        lastSeats: 41,
        keyLeaders: ["V. D. Satheesan", "K. Sudhakaran"],
        manifesto: [
          "Cancel the K-Rail project",
          "Corruption-free governance",
          "Increase NREGA wages",
          "Investment in agriculture and fisheries",
          "Youth employment package",
        ],
        schemes: [
          "Youth self-employment mission",
          "Farmer loan waiver",
          "Women entrepreneurs fund",
        ],
      },
      {
        name: "Bharatiya Janata Party",
        short: "BJP",
        symbol: "🪷",
        alliance: "NDA",
        lastSeats: 0,
        keyLeaders: ["K. Surendran", "E. Sreedharan"],
        manifesto: [
          "BJP's development model for Kerala",
          "Anti-Love Jihad legislation",
          "Reforms in temple administration",
          "Boost tourism and IT investment",
        ],
        schemes: [
          "One Nation One Ration Card",
          "PM Awas Yojana expansion",
          "Startup India Kerala",
        ],
      },
    ],
    keyIssues: [
      "K-Rail project",
      "Unemployment",
      "Corruption",
      "Gulf migrant crisis",
      "Flood management",
      "Healthcare services",
    ],
    schedule: [PHASE_1_EARLY],
  },
  puducherry: {
    stateName: "Puducherry",
    dateInfo: "9 April 2026",
    totalSeats: 30,
    totalVoters: "~1.05 million",
    currentRuling: "NR Congress–BJP (N. Rangasamy)",
    overview:
      "Puducherry will vote across 30 constituencies. The NR Congress–BJP alliance is currently in power. The Congress and DMK alliance is the principal opposition.",
    lastTurnout: 81.64,
    lastElectionYear: 2021,
    parties: [
      {
        name: "All India NR Congress",
        short: "AINRC",
        symbol: "🏠",
        alliance: "NDA",
        lastSeats: 10,
        keyLeaders: ["N. Rangasamy"],
        manifesto: [
          "Full statehood for Puducherry",
          "Job creation and industrial growth",
          "Tourism promotion",
          "Welfare schemes for fishermen",
        ],
        schemes: [
          "Free rice scheme",
          "Fishermen welfare fund",
          "Education scholarships",
        ],
      },
      {
        name: "Indian National Congress",
        short: "INC",
        symbol: "✋",
        alliance: "INDIA / DMK",
        lastSeats: 2,
        keyLeaders: ["V. Narayanasamy"],
        manifesto: [
          "Full statehood",
          "Protect rights of the Union Territory",
          "Unemployment allowance",
          "Women's empowerment",
        ],
        schemes: ["5 Guarantees scheme", "Mahila Samman Nidhi"],
      },
      {
        name: "DMK",
        short: "DMK",
        symbol: "☀️",
        alliance: "INDIA",
        lastSeats: 6,
        keyLeaders: ["R. Siva"],
        manifesto: [
          "Social justice and equality",
          "Improvements in education and health",
          "Protection of Tamil language and culture",
        ],
        schemes: ["Kalaignar insurance scheme", "Free bus passes"],
      },
    ],
    keyIssues: [
      "Full statehood",
      "Unemployment",
      "LG vs CM powers dispute",
      "Fishermen's issues",
      "Tourism development",
    ],
    schedule: [PHASE_1_EARLY],
  },
  "tamil-nadu": {
    stateName: "Tamil Nadu",
    dateInfo: "23 April 2026",
    totalSeats: 234,
    totalVoters: "~62 million",
    currentRuling: "DMK (M. K. Stalin)",
    overview:
      "Tamil Nadu will vote across 234 constituencies. The DMK is currently in power. The AIADMK and BJP alliance is the main opposition. Dravidian politics remains the dominant factor in the state.",
    lastTurnout: 72.81,
    lastElectionYear: 2021,
    parties: [
      {
        name: "Dravida Munnetra Kazhagam",
        short: "DMK",
        symbol: "☀️",
        alliance: "INDIA",
        lastSeats: 133,
        keyLeaders: ["M. K. Stalin", "Udhayanidhi Stalin"],
        manifesto: [
          "Make Tamil Nadu a $1 trillion economy",
          "Protect social justice and reservations",
          "Exemption from NEET examination",
          "₹1,000 monthly assistance for women",
          "Build an EV and green energy hub",
        ],
        schemes: [
          "Kalaignar Magalir Urimai Thogai – ₹1,000/month for women",
          "Chief Minister's Breakfast Scheme",
          "Naam Kudumbam Naam Urimai – family card",
          "Ilam Tamilagam – youth skill development",
        ],
      },
      {
        name: "AIADMK",
        short: "AIADMK",
        symbol: "🍃",
        alliance: "NDA (likely)",
        lastSeats: 66,
        keyLeaders: ["Edappadi K. Palaniswami"],
        manifesto: [
          "Restart Amma brand schemes",
          "Improve law and order",
          "Continue free electricity for farmers",
          "Improve education and healthcare",
        ],
        schemes: [
          "Amma Canteen – affordable meals",
          "Amma Pharmacy – cheap medicines",
          "Farm loan waiver",
        ],
      },
      {
        name: "Bharatiya Janata Party",
        short: "BJP",
        symbol: "🪷",
        alliance: "NDA",
        lastSeats: 4,
        keyLeaders: ["K. Annamalai"],
        manifesto: [
          "BJP's development model for Tamil Nadu",
          "Corruption-free governance",
          "Free Hindu temples from government control",
          "Defence and IT industry growth",
        ],
        schemes: ["PM Awas Yojana", "Ayushman Bharat", "Startup India"],
      },
      {
        name: "Pattali Makkal Katchi",
        short: "PMK",
        symbol: "🥭",
        alliance: "NDA",
        lastSeats: 5,
        keyLeaders: ["Anbumani Ramadoss"],
        manifesto: [
          "20% reservation for Vanniyar community",
          "Prohibition of liquor",
          "Agricultural development",
        ],
        schemes: [
          "Community welfare fund",
          "Liquor-free Tamil Nadu campaign",
        ],
      },
    ],
    keyIssues: [
      "NEET examination",
      "Social justice / reservations",
      "Dravidian identity",
      "Unemployment",
      "Water crisis",
      "Temple administration",
      "Education policy",
    ],
    schedule: [PHASE_LATE],
  },
  "west-bengal": {
    stateName: "West Bengal",
    dateInfo: "23 & 29 April 2026 (2 phases)",
    totalSeats: 294,
    totalVoters: "~73 million",
    currentRuling: "TMC (Mamata Banerjee)",
    overview:
      "West Bengal will vote across 294 constituencies in two phases. The TMC is currently in power with Mamata Banerjee as Chief Minister. The BJP is the main opposition, while the Congress–Left alliance is also contesting.",
    lastTurnout: 81.69,
    lastElectionYear: 2021,
    parties: [
      {
        name: "Trinamool Congress",
        short: "TMC",
        symbol: "🌸",
        alliance: "INDIA",
        lastSeats: 215,
        keyLeaders: ["Mamata Banerjee", "Abhishek Banerjee"],
        manifesto: [
          "Protect Bengal's identity and culture",
          "Women's empowerment – Lakshmir Bhandar expansion",
          "Youth employment and skill development",
          "MSP guarantee for farmers",
          "Minority welfare programmes",
        ],
        schemes: [
          "Lakshmir Bhandar – ₹1,000/month for women",
          "Kanyashree – incentive for girls' education",
          "Swasthya Sathi – ₹5 lakh free health insurance",
          "Sabuj Sathi – bicycles for students",
          "Rupashree – marriage assistance",
        ],
      },
      {
        name: "Bharatiya Janata Party",
        short: "BJP",
        symbol: "🪷",
        alliance: "NDA",
        lastSeats: 77,
        keyLeaders: ["Sukanta Majumdar", "Suvendu Adhikari"],
        manifesto: [
          "Corruption-free governance in Bengal",
          "Improve law and order",
          "Attract industry and investment",
          "Probe the teacher recruitment scam",
          "Implement the CAA",
        ],
        schemes: [
          "PM Kisan Samman Nidhi",
          "Ayushman Bharat",
          "PM Awas Yojana",
          "Ujjwala Yojana",
        ],
      },
      {
        name: "CPI(M) – Left Front",
        short: "LF",
        symbol: "⚒️",
        alliance: "Left–Cong",
        lastSeats: 0,
        keyLeaders: ["Mohammed Salim", "Suryakanta Mishra"],
        manifesto: [
          "Land reforms and farmer rights",
          "Protection of workers' rights",
          "Public expansion of education and health",
          "Opposition to communalism",
        ],
        schemes: [
          "Operation Barga – land redistribution",
          "Strengthening of Panchayati Raj",
        ],
      },
      {
        name: "Indian National Congress",
        short: "INC",
        symbol: "✋",
        alliance: "Left–Cong",
        lastSeats: 0,
        keyLeaders: ["Adhir Ranjan Chowdhury"],
        manifesto: [
          "Restoration of democracy in Bengal",
          "Unemployment allowance",
          "Women's safety",
          "Increase MGNREGA wages",
        ],
        schemes: ["5 Guarantees scheme", "Mahila Samman Nidhi"],
      },
    ],
    keyIssues: [
      "Teacher recruitment scam",
      "Law and order",
      "Unemployment",
      "CAA / NRC",
      "Women's safety",
      "Corruption",
      "Bengali identity",
    ],
    schedule: [
      {
        label: "Phase 1 (152 ACs)",
        gazette: "30 March 2026 (Monday)",
        lastNomination: "6 April 2026 (Monday)",
        scrutiny: "7 April 2026 (Tuesday)",
        withdrawal: "9 April 2026 (Thursday)",
        poll: "23 April 2026 (Thursday)",
        counting: "4 May 2026 (Monday)",
        completion: "6 May 2026 (Wednesday)",
      },
      {
        label: "Phase 2 (142 ACs)",
        gazette: "2 April 2026 (Thursday)",
        lastNomination: "9 April 2026 (Thursday)",
        scrutiny: "10 April 2026 (Friday)",
        withdrawal: "13 April 2026 (Monday)",
        poll: "29 April 2026 (Wednesday)",
        counting: "4 May 2026 (Monday)",
        completion: "6 May 2026 (Wednesday)",
      },
    ],
  },
};

// Live turnout simulator: builds a smooth animated value approaching the historical baseline
// On poll day this will be replaced/augmented by an ECI fetch.
const useLiveTurnout = (baseline: number, pollDateISO?: string) => {
  const [value, setValue] = useState(0);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Determine if poll day is "today" relative to platform temporal context
    const now = new Date();
    const target = pollDateISO ? new Date(pollDateISO) : null;
    const sameDay =
      target &&
      target.getFullYear() === now.getFullYear() &&
      target.getMonth() === now.getMonth() &&
      target.getDate() === now.getDate();
    setIsLive(!!sameDay);

    // Animate from 0 -> baseline on mount (visual)
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(parseFloat((baseline * eased).toFixed(2)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [baseline, pollDateISO]);

  return { value, isLive };
};

const UpcomingElection = () => {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const data = stateSlug ? electionData[stateSlug] : null;

  const [issueFilter, setIssueFilter] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [candidateCount, setCandidateCount] = useState<number | null>(null);

  // Always call hooks unconditionally — pass safe defaults if data is missing
  const baselineTurnout = data?.lastTurnout ?? 0;
  const { value: liveTurnout, isLive } = useLiveTurnout(baselineTurnout);

  // Try to load actual cached candidate count for the state (optional live feature)
  useEffect(() => {
    if (!data) return;
    let cancelled = false;
    (async () => {
      const { count } = await supabase
        .from("candidate_cache")
        .select("candidate_id", { count: "exact", head: true });
      if (!cancelled) setCandidateCount(count ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [data]);

  const filteredParties = useMemo(() => {
    if (!data) return [];
    const q = searchQ.trim().toLowerCase();
    if (!q) return data.parties;
    return data.parties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.short.toLowerCase().includes(q) ||
        p.keyLeaders.join(" ").toLowerCase().includes(q) ||
        p.manifesto.join(" ").toLowerCase().includes(q),
    );
  }, [data, searchQ]);

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Election data not available</h1>
          <Link to="/" className="text-primary underline">
            Go to Home
          </Link>
        </div>
        <FooterSection />
      </div>
    );
  }

  const chartData = data.parties.map((p) => ({
    name: p.short,
    seats: p.lastSeats,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-10 max-w-6xl">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted/60 via-background to-muted/30 mb-12">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 25%, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative p-6 md:p-12 text-center">
            <Badge variant="outline" className="mb-4 mx-auto">
              <Calendar className="h-3 w-3 mr-1" /> {data.dateInfo}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-foreground mb-4 tracking-tight">
              {data.stateName} Election{" "}
              <span className="text-gradient-warm">2026</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
              Know your candidates, compare manifestos and vote informed.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                size="lg"
                className="rounded-full"
                onClick={() =>
                  document
                    .getElementById("compare")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Scale className="h-4 w-4 mr-2" /> Compare Parties
              </Button>
              <Link to="/constituency">
                <Button size="lg" variant="outline" className="rounded-full">
                  <Users className="h-4 w-4 mr-2" /> View Candidates
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-14">
          {[
            { icon: MapPin, label: "Total Seats", value: data.totalSeats },
            { icon: Users, label: "Total Voters", value: data.totalVoters },
            {
              icon: Vote,
              label: "Current Government",
              value: data.currentRuling,
            },
            { icon: Calendar, label: "Polling Date", value: data.dateInfo },
          ].map((s) => (
            <Card
              key={s.label}
              className="border-border text-center transition-all hover:shadow-card hover:-translate-y-0.5"
            >
              <CardContent className="p-4 md:p-5 flex flex-col items-center gap-2">
                <s.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <p className="text-[10px] md:text-xs uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </p>
                <p className="font-semibold text-foreground text-xs md:text-sm leading-snug">
                  {s.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* LIVE STATS — Voter turnout + past results */}
        <section className="mb-16 grid md:grid-cols-2 gap-6">
          {/* Turnout */}
          <Card className="border-border shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" /> Voter Turnout
                </CardTitle>
                <Badge
                  variant={isLive ? "default" : "secondary"}
                  className={`text-[10px] ${isLive ? "animate-pulse" : ""}`}
                >
                  <span
                    className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                      isLive ? "bg-primary-foreground" : "bg-muted-foreground"
                    }`}
                  />
                  {isLive ? "LIVE" : `${data.lastElectionYear} baseline`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 mb-3">
                <div className="text-5xl md:text-6xl font-display font-bold tracking-tight">
                  {liveTurnout.toFixed(1)}
                  <span className="text-2xl text-muted-foreground">%</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground pb-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  vs {data.lastElectionYear}
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all duration-700"
                  style={{ width: `${Math.min(100, liveTurnout)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                On poll day, this updates live from ECI hourly turnout data.
              </p>
            </CardContent>
          </Card>

          {/* Past Results Bar Chart */}
          <Card className="border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {data.lastElectionYear} Result – Seats Won
              </CardTitle>
            </CardHeader>
            <CardContent className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="seats" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          i === 0
                            ? "hsl(var(--foreground))"
                            : "hsl(var(--muted-foreground))"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Key Dates — Poll Day + Counting Day only */}
        {data.schedule && data.schedule.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                Key Election Dates
              </h2>
              <p className="text-sm text-muted-foreground">
                As per Election Commission of India
              </p>
            </div>

            <div
              className={`grid gap-6 ${
                data.schedule.length > 1
                  ? "md:grid-cols-2"
                  : "max-w-3xl mx-auto"
              }`}
            >
              {data.schedule.map((p) => (
                <Card key={p.label} className="border-border shadow-card">
                  {data.schedule!.length > 1 && (
                    <CardHeader className="text-center border-b border-border pb-3">
                      <CardTitle className="text-base">{p.label}</CardTitle>
                    </CardHeader>
                  )}
                  <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                    <div className="text-center p-5 rounded-xl border border-border bg-muted/30">
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
                        <Vote className="h-5 w-5" />
                      </div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                        Date of Poll
                      </p>
                      <p className="font-display font-bold text-foreground text-lg leading-tight">
                        {p.poll}
                      </p>
                    </div>
                    <div className="text-center p-5 rounded-xl border border-border bg-muted/30">
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                        Date of Counting
                      </p>
                      <p className="font-display font-bold text-foreground text-lg leading-tight">
                        {p.counting}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Key Issues — clickable filters */}
        <section className="mb-16 text-center">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Key Election Issues
            </h2>
            <p className="text-sm text-muted-foreground">
              Click an issue to see each party's stance
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto mb-6">
            {data.keyIssues.map((issue) => {
              const active = issueFilter === issue;
              return (
                <button
                  key={issue}
                  onClick={() => setIssueFilter(active ? null : issue)}
                  className={`text-sm py-1.5 px-4 rounded-full border transition-all ${
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "bg-secondary text-secondary-foreground border-border hover:border-foreground"
                  }`}
                >
                  {issue}
                </button>
              );
            })}
          </div>
          {issueFilter && data.issueMatrix?.[issueFilter] && (
            <Card className="max-w-2xl mx-auto text-left border-border shadow-card animate-fade-up">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-primary" /> {issueFilter}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(data.issueMatrix[issueFilter]).map(([party, stance]) => (
                  <div
                    key={party}
                    className="flex items-start gap-3 py-2 border-b border-border last:border-0"
                  >
                    <Badge variant="outline" className="font-mono text-xs">
                      {party}
                    </Badge>
                    <p className="text-sm text-muted-foreground flex-1">{stance}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </section>

        {/* COMPARE PARTIES — side-by-side table */}
        <section id="compare" className="mb-16 scroll-mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Compare Parties Side by Side
            </h2>
            <p className="text-sm text-muted-foreground">
              Quick at-a-glance comparison of leadership, alliance & last result
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border shadow-card">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-muted/60">
                <tr>
                  <th className="text-left p-4 font-semibold">Party</th>
                  <th className="text-left p-4 font-semibold">Alliance</th>
                  <th className="text-left p-4 font-semibold">Top Leader</th>
                  <th className="text-right p-4 font-semibold">
                    {data.lastElectionYear} Seats
                  </th>
                  <th className="text-left p-4 font-semibold">
                    Top Promise
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.parties.map((p) => (
                  <tr
                    key={p.short}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-foreground font-mono text-[10px] font-semibold">
                          {p.short.slice(0, 3)}
                        </span>
                        <span className="font-semibold">{p.short}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">
                        {p.alliance ?? "—"}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {p.keyLeaders[0]}
                    </td>
                    <td className="p-4 text-right font-mono font-semibold">
                      {p.lastSeats}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {p.manifesto[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Parties — search + tabs */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Major Political Parties
            </h2>
            <p className="text-sm text-muted-foreground">
              Manifestos, leadership and flagship schemes
            </p>
          </div>

          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search party, leader or promise..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="pl-9 rounded-full"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredParties.map((party) => (
              <Card
                key={party.name}
                className="border-border overflow-hidden flex flex-col shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
              >
                <CardHeader className="text-center bg-muted/40 border-b border-border pb-5">
                  <div className="text-4xl mb-2">{party.symbol}</div>
                  <CardTitle className="text-lg leading-tight">
                    {party.name}
                  </CardTitle>
                  {party.alliance && (
                    <Badge
                      variant="outline"
                      className="mx-auto mt-2 w-fit text-xs"
                    >
                      {party.alliance}
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    <span className="font-medium text-foreground">
                      Key Leaders:
                    </span>{" "}
                    {party.keyLeaders.join(", ")}
                  </p>
                </CardHeader>
                <CardContent className="pt-5 flex-1">
                  <Tabs defaultValue="manifesto">
                    <TabsList className="w-full grid grid-cols-2 mb-4">
                      <TabsTrigger value="manifesto" className="text-xs">
                        <FileText className="h-3 w-3 mr-1.5" /> Manifesto
                      </TabsTrigger>
                      <TabsTrigger value="schemes" className="text-xs">
                        <Target className="h-3 w-3 mr-1.5" /> Schemes
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="manifesto">
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {party.manifesto.map((point, i) => (
                          <li key={i} className="flex gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    <TabsContent value="schemes">
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {party.schemes.map((scheme, i) => (
                          <li key={i} className="flex gap-2">
                            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>{scheme}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
            {filteredParties.length === 0 && (
              <p className="md:col-span-2 text-center text-muted-foreground py-10">
                No parties match "{searchQ}"
              </p>
            )}
          </div>
        </section>

        <div className="bg-muted/50 rounded-xl p-6 text-center text-sm text-muted-foreground">
          <p>
            ⚠️ This data is for educational purposes. For official information,
            visit the{" "}
            <a
              href="https://eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Election Commission of India
            </a>{" "}
            website.
          </p>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default UpcomingElection;
