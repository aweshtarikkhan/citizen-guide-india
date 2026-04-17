import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { ArrowLeft, Users, FileText, Target, Calendar, MapPin, Vote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PartyInfo {
  name: string;
  symbol: string;
  alliance?: string;
  keyLeaders: string[];
  manifesto: string[];
  schemes: string[];
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
    parties: [
      {
        name: "Bharatiya Janata Party (BJP)",
        symbol: "🪷",
        alliance: "NDA",
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
        name: "Indian National Congress (INC)",
        symbol: "✋",
        alliance: "INDIA Alliance",
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
        name: "Asom Gana Parishad (AGP)",
        symbol: "🐘",
        alliance: "NDA",
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
        name: "All India United Democratic Front (AIUDF)",
        symbol: "🔒",
        alliance: "INDIA Alliance",
        keyLeaders: ["Badruddin Ajmal"],
        manifesto: [
          "Protection of minority rights",
          "Equal access to education and healthcare",
          "Poverty eradication programmes",
        ],
        schemes: [
          "Minority welfare fund",
          "Education scholarship scheme",
        ],
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
  },
  kerala: {
    stateName: "Kerala",
    dateInfo: "9 April 2026",
    totalSeats: 140,
    totalVoters: "~27 million",
    currentRuling: "LDF – CPI(M) (Pinarayi Vijayan)",
    overview:
      "Kerala will vote across 140 constituencies. The traditional contest is between the LDF (Left) and the UDF (Congress-led alliance). The BJP is also working to expand its footprint in the state.",
    parties: [
      {
        name: "CPI(M) – Left Democratic Front (LDF)",
        symbol: "⚒️",
        alliance: "LDF",
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
        name: "Indian National Congress (UDF)",
        symbol: "✋",
        alliance: "UDF",
        keyLeaders: ["V. D. Satheesan", "K. Sudhakaran", "Oommen Chandy"],
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
        name: "Bharatiya Janata Party (BJP)",
        symbol: "🪷",
        alliance: "NDA",
        keyLeaders: ["K. Surendran", "Metroman E. Sreedharan"],
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
    parties: [
      {
        name: "NR Congress",
        symbol: "🏠",
        alliance: "NDA",
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
        name: "Indian National Congress (INC)",
        symbol: "✋",
        alliance: "INDIA Alliance / DMK alliance",
        keyLeaders: ["V. Narayanasamy"],
        manifesto: [
          "Full statehood",
          "Protect the rights of the Union Territory",
          "Unemployment allowance",
          "Women's empowerment",
        ],
        schemes: [
          "5 Guarantees scheme",
          "Mahila Samman Nidhi",
        ],
      },
      {
        name: "DMK",
        symbol: "☀️",
        alliance: "INDIA Alliance",
        keyLeaders: ["R. Siva"],
        manifesto: [
          "Social justice and equality",
          "Improvements in education and health",
          "Protection of Tamil language and culture",
        ],
        schemes: [
          "Kalaignar insurance scheme",
          "Free bus passes",
        ],
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
    parties: [
      {
        name: "DMK (Dravida Munnetra Kazhagam)",
        symbol: "☀️",
        alliance: "INDIA Alliance",
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
          "Chief Minister's Breakfast Scheme – free breakfast in government schools",
          "Naam Kudumbam Naam Urimai – family card",
          "Ilam Tamilagam – youth skill development",
        ],
      },
      {
        name: "AIADMK",
        symbol: "🍃",
        alliance: "NDA (likely)",
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
        name: "Bharatiya Janata Party (BJP)",
        symbol: "🪷",
        alliance: "NDA",
        keyLeaders: ["K. Annamalai"],
        manifesto: [
          "BJP's development model for Tamil Nadu",
          "Corruption-free governance",
          "Free Hindu temples from government control",
          "Defence and IT industry growth",
        ],
        schemes: [
          "PM Awas Yojana",
          "Ayushman Bharat",
          "Startup India",
        ],
      },
      {
        name: "Pattali Makkal Katchi (PMK)",
        symbol: "🥭",
        alliance: "NDA",
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
    parties: [
      {
        name: "Trinamool Congress (TMC)",
        symbol: "🌸",
        alliance: "INDIA Alliance",
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
          "Swasthya Sathi – free health insurance up to ₹5 lakh",
          "Sabuj Sathi – bicycles for students",
          "Rupashree – marriage assistance",
        ],
      },
      {
        name: "Bharatiya Janata Party (BJP)",
        symbol: "🪷",
        alliance: "NDA",
        keyLeaders: ["Sukanta Majumdar", "Dilip Ghosh"],
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
        symbol: "⚒️",
        alliance: "Left–Congress alliance",
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
        name: "Indian National Congress (INC)",
        symbol: "✋",
        alliance: "Left–Congress alliance",
        keyLeaders: ["Adhir Ranjan Chowdhury"],
        manifesto: [
          "Restoration of democracy in Bengal",
          "Unemployment allowance",
          "Women's safety",
          "Increase MGNREGA wages",
        ],
        schemes: [
          "5 Guarantees scheme",
          "Mahila Samman Nidhi",
        ],
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

const UpcomingElection = () => {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const data = stateSlug ? electionData[stateSlug] : null;

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Election data not available</h1>
          <Link to="/" className="text-primary underline">Go to Home</Link>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Header — centered hero */}
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 mx-auto">
            <Calendar className="h-3 w-3 mr-1" /> {data.dateInfo}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 tracking-tight">
            {data.stateName} Assembly Election 2026
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">{data.overview}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { icon: MapPin, label: "Total Seats", value: data.totalSeats },
            { icon: Users, label: "Total Voters", value: data.totalVoters },
            { icon: Vote, label: "Current Government", value: data.currentRuling },
            { icon: Calendar, label: "Polling Date", value: data.dateInfo },
          ].map((s) => (
            <Card key={s.label} className="border-border text-center">
              <CardContent className="p-5 flex flex-col items-center gap-2">
                <s.icon className="h-6 w-6 text-primary" />
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <p className="font-semibold text-foreground text-sm leading-snug">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ECI Schedule — vertical tree timeline */}
        {data.schedule && data.schedule.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                Official ECI Election Schedule
              </h2>
              <p className="text-sm text-muted-foreground">
                Key dates from the Election Commission of India
              </p>
            </div>

            <div className={`grid gap-8 ${data.schedule.length > 1 ? "md:grid-cols-2" : "max-w-2xl mx-auto"}`}>
              {data.schedule.map((p) => {
                const steps = [
                  { label: "Gazette Notification", value: p.gazette },
                  { label: "Last Date of Nominations", value: p.lastNomination },
                  { label: "Scrutiny of Nominations", value: p.scrutiny },
                  { label: "Last Date of Withdrawal", value: p.withdrawal },
                  { label: "Date of Poll", value: p.poll, highlight: true },
                  { label: "Date of Counting", value: p.counting, highlight: true },
                  { label: "Election to be Completed By", value: p.completion },
                ];
                return (
                  <Card key={p.label} className="border-border shadow-card">
                    <CardHeader className="text-center border-b border-border pb-4">
                      <Badge variant="outline" className="mx-auto mb-2 w-fit">
                        <Calendar className="h-3 w-3 mr-1" /> Schedule
                      </Badge>
                      <CardTitle className="text-lg">{p.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8 pb-6">
                      <ol className="relative border-l-2 border-border ml-4 space-y-6">
                        {steps.map((step, i) => (
                          <li key={step.label} className="ml-6 relative">
                            <span
                              className={`absolute -left-[34px] flex items-center justify-center w-7 h-7 rounded-full ring-4 ring-background text-xs font-semibold ${
                                step.highlight
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground border border-border"
                              }`}
                            >
                              {i + 1}
                            </span>
                            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">
                              {step.label}
                            </p>
                            <p
                              className={`font-semibold ${
                                step.highlight ? "text-primary text-base" : "text-foreground text-sm"
                              }`}
                            >
                              {step.value}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-6 text-center">
              Source: Election Commission of India (ECI) official notification
            </p>
          </section>
        )}

        {/* Key Issues */}
        <section className="mb-16 text-center">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">Key Election Issues</h2>
            <p className="text-sm text-muted-foreground">Topics shaping the voter conversation</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
            {data.keyIssues.map((issue) => (
              <Badge key={issue} variant="secondary" className="text-sm py-1.5 px-4">
                {issue}
              </Badge>
            ))}
          </div>
        </section>

        {/* Parties */}
        <section className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">Major Political Parties</h2>
            <p className="text-sm text-muted-foreground">Manifestos, leadership and flagship schemes</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {data.parties.map((party) => (
              <Card key={party.name} className="border-border overflow-hidden flex flex-col shadow-card">
                <CardHeader className="text-center bg-muted/40 border-b border-border pb-5">
                  <div className="text-4xl mb-2">{party.symbol}</div>
                  <CardTitle className="text-lg leading-tight">{party.name}</CardTitle>
                  {party.alliance && (
                    <Badge variant="outline" className="mx-auto mt-2 w-fit text-xs">
                      {party.alliance}
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    <span className="font-medium text-foreground">Key Leaders:</span>{" "}
                    {party.keyLeaders.join(", ")}
                  </p>
                </CardHeader>
                <CardContent className="pt-5 space-y-5 flex-1">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" /> Manifesto Highlights
                    </h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {party.manifesto.map((point, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" /> Key Schemes
                    </h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {party.schemes.map((scheme, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{scheme}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="bg-muted/50 rounded-xl p-6 text-center text-sm text-muted-foreground">
          <p>
            ⚠️ This data is for educational purposes. For official information, visit the{" "}
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
