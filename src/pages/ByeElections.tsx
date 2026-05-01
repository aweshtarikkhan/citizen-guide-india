import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import FeedbackSection from "@/components/FeedbackSection";
import { ArrowLeft, Calendar, MapPin, Users, AlertCircle, Vote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Candidate {
  name: string;
  party: string;
  alliance?: string;
  note?: string;
}

interface Schedule {
  gazette: string;
  lastNomination: string;
  scrutiny: string;
  withdrawal: string;
  poll: string;
  counting: string;
  completion: string;
}

interface SeatBlock {
  no: number;
  state: string;
  constituency: string;
  acNumber: string;
  reservation?: string;
  vacancyReason: string;
  previousMLA: string;
  previousParty: string;
  totalCandidates: number;
  candidates: Candidate[];
  keyContest: string;
  schedule: Schedule;
}

const SCHEDULE_A: Schedule = {
  gazette: "16 March 2026 (Monday)",
  lastNomination: "23 March 2026 (Monday)",
  scrutiny: "24 March 2026 (Tuesday)",
  withdrawal: "26 March 2026 (Thursday)",
  poll: "9 April 2026 (Thursday)",
  counting: "4 May 2026 (Monday)",
  completion: "6 May 2026 (Wednesday)",
};

const SCHEDULE_B: Schedule = {
  gazette: "30 March 2026 (Monday)",
  lastNomination: "6 April 2026 (Monday)",
  scrutiny: "7 April 2026 (Tuesday)",
  withdrawal: "9 April 2026 (Thursday)",
  poll: "23 April 2026 (Thursday)",
  counting: "4 May 2026 (Monday)",
  completion: "6 May 2026 (Wednesday)",
};

const SEATS: SeatBlock[] = [
  {
    no: 1,
    state: "Goa",
    constituency: "Ponda",
    acNumber: "21-Ponda",
    vacancyReason: "Death of sitting MLA Sh. Ravi Naik (BJP)",
    previousMLA: "Ravi Naik",
    previousParty: "BJP",
    totalCandidates: 5,
    candidates: [
      { name: "Ritesh Naik", party: "BJP", alliance: "NDA", note: "Son of late Ravi Naik" },
      { name: "Ketan Bhatikar", party: "INC", alliance: "INDIA" },
      { name: "Rama Kankonkar", party: "AAP" },
      { name: "Mahesh Amonkar", party: "RGP (Revolutionary Goans Party)" },
      { name: "Independent candidates", party: "Independent" },
    ],
    keyContest: "Triangular contest between BJP (sympathy wave for late Ravi Naik), Congress and AAP. RGP is positioning as the regionalist alternative.",
    schedule: SCHEDULE_A,
  },
  {
    no: 2,
    state: "Karnataka",
    constituency: "Bagalkot",
    acNumber: "24-Bagalkot",
    vacancyReason: "Death of sitting MLA Sh. H. Y. Meti (Congress)",
    previousMLA: "Meti Hullappa Yamanappa (H. Y. Meti)",
    previousParty: "INC",
    totalCandidates: 16,
    candidates: [
      { name: "H. Y. Meti's family nominee", party: "INC", alliance: "INDIA", note: "Sympathy candidate fielded by Congress" },
      { name: "P. H. Pujar", party: "BJP", alliance: "NDA" },
      { name: "JD(S) nominee", party: "JD(S)", alliance: "NDA" },
      { name: "13 other candidates", party: "Independents & smaller parties" },
    ],
    keyContest: "Direct BJP vs Congress contest. Bagalkot saw 26 nominations filed; final fray is 16 candidates after scrutiny and withdrawal.",
    schedule: SCHEDULE_A,
  },
  {
    no: 3,
    state: "Karnataka",
    constituency: "Davanagere South",
    acNumber: "107-Davanagere South",
    vacancyReason: "Death of veteran MLA Sh. Shamanur Shivashankarappa (Congress)",
    previousMLA: "Shamanur Shivashankarappa",
    previousParty: "INC",
    totalCandidates: 18,
    candidates: [
      { name: "S. S. Mallikarjun", party: "INC", alliance: "INDIA", note: "Son of late Shamanur Shivashankarappa, sitting minister" },
      { name: "BJP nominee (Lingayat strongman)", party: "BJP", alliance: "NDA" },
      { name: "JD(S) nominee", party: "JD(S)", alliance: "NDA" },
      { name: "15 other candidates", party: "Independents & smaller parties" },
    ],
    keyContest: "Considered a Congress stronghold (Lingayat veerashaiva belt). Sympathy factor strongly favours INC. 18 candidates after withdrawal.",
    schedule: SCHEDULE_A,
  },
  {
    no: 4,
    state: "Nagaland",
    constituency: "Koridang (ST)",
    acNumber: "28-Koridang",
    reservation: "Reserved (ST)",
    vacancyReason: "Death of sitting MLA Sh. Imkong L. Imchen (NCP)",
    previousMLA: "Imkong L. Imchen",
    previousParty: "NCP",
    totalCandidates: 7,
    candidates: [
      { name: "NDPP nominee", party: "NDPP", alliance: "NDA / PDA (ruling)" },
      { name: "BJP did not field", party: "BJP", note: "Supporting NDPP under seat-sharing" },
      { name: "NCP nominee", party: "NCP", alliance: "PDA" },
      { name: "Congress nominee", party: "INC", alliance: "INDIA" },
      { name: "NPF nominee", party: "NPF" },
      { name: "2 Independents", party: "Independent" },
    ],
    keyContest: "Multi-cornered contest in Mokokchung district. Ruling NDPP-BJP-NCP alliance is internally split with NCP also fielding a candidate.",
    schedule: SCHEDULE_A,
  },
  {
    no: 5,
    state: "Tripura",
    constituency: "Dharmanagar",
    acNumber: "56-Dharmanagar",
    vacancyReason: "Death of sitting MLA Sh. Biswa Bandhu Sen (BJP)",
    previousMLA: "Biswa Bandhu Sen",
    previousParty: "BJP",
    totalCandidates: 4,
    candidates: [
      { name: "BJP nominee", party: "BJP", alliance: "NDA (ruling)" },
      { name: "CPI(M) nominee", party: "CPI(M)", alliance: "Left Front" },
      { name: "TIPRA Motha nominee", party: "TIPRA Motha", alliance: "NDA ally" },
      { name: "1 Independent", party: "Independent" },
    ],
    keyContest: "BJP defends the seat with sympathy factor. CPI(M) is the principal opposition. TIPRA Motha fielding a candidate despite being part of the ruling alliance.",
    schedule: SCHEDULE_A,
  },
  {
    no: 6,
    state: "Gujarat",
    constituency: "Umreth",
    acNumber: "111-Umreth",
    vacancyReason: "Death of sitting MLA Sh. Govindbhai Raijibhai Parmar (BJP)",
    previousMLA: "Govindbhai Raijibhai Parmar",
    previousParty: "BJP",
    totalCandidates: 6,
    candidates: [
      { name: "BJP nominee", party: "BJP", alliance: "NDA (ruling)" },
      { name: "Congress nominee", party: "INC", alliance: "INDIA" },
      { name: "BNJD nominee", party: "Bharatiya National Janata Dal" },
      { name: "3 Independents", party: "Independent" },
    ],
    keyContest: "Six-cornered contest in Anand district. Direct fight between BJP (incumbent) and Congress; AAP is not in the fray this time.",
    schedule: SCHEDULE_B,
  },
  {
    no: 7,
    state: "Maharashtra",
    constituency: "Rahuri",
    acNumber: "223-Rahuri",
    vacancyReason: "Death of sitting MLA Sh. Shivaji Bhanudas Kardile (BJP)",
    previousMLA: "Shivaji Bhanudas Kardile",
    previousParty: "BJP",
    totalCandidates: 8,
    candidates: [
      { name: "Akshay Kardile", party: "BJP", alliance: "Mahayuti", note: "Son of late Shivaji Kardile" },
      { name: "Govind Mokate", party: "NCP (SP)", alliance: "MVA" },
      { name: "Congress (INC) candidate", party: "INC", alliance: "MVA", note: "Internal MVA conflict — Congress also filed nomination" },
      { name: "5 Independents", party: "Independent" },
    ],
    keyContest: "BJP vs NCP-SP. MVA alliance has internal friction with Congress also contesting. Prajakt Tanpure withdrew before NCP-SP nominated Mokate.",
    schedule: SCHEDULE_B,
  },
  {
    no: 8,
    state: "Maharashtra",
    constituency: "Baramati",
    acNumber: "201-Baramati",
    vacancyReason: "Death of sitting MLA & Deputy CM Sh. Ajit Anatarao Pawar (NCP)",
    previousMLA: "Ajit Anatarao Pawar (Deputy CM)",
    previousParty: "NCP (Ajit Pawar faction)",
    totalCandidates: 23,
    candidates: [
      { name: "Sunetra Pawar", party: "NCP (Ajit Pawar faction)", alliance: "Mahayuti", note: "Wife of late Ajit Pawar; Rajya Sabha MP" },
      { name: "Congress withdrew", party: "INC", note: "INC withdrew to honour Pawar family in Baramati" },
      { name: "NCP (SP) did not field", party: "NCP (SP)", note: "Sharad Pawar declined to contest against family" },
      { name: "22 Independent candidates", party: "Independent", note: "Including local activists denying Sunetra Pawar a walkover" },
    ],
    keyContest: "Effectively unopposed for Sunetra Pawar by major parties — both Congress and NCP (SP) opted out. 22 Independents are the only challengers.",
    schedule: SCHEDULE_B,
  },
];

const ScheduleBlock = ({ s }: { s: Schedule }) => {
  const rows: [string, string][] = [
    ["Gazette Notification", s.gazette],
    ["Last Date of Nominations", s.lastNomination],
    ["Scrutiny of Nominations", s.scrutiny],
    ["Last Date of Withdrawal", s.withdrawal],
    ["Date of Poll", s.poll],
    ["Date of Counting (Result)", s.counting],
    ["Election to be Completed By", s.completion],
  ];
  return (
    <dl className="text-sm divide-y divide-border">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 py-2">
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="font-medium text-foreground text-right">{v}</dd>
        </div>
      ))}
    </dl>
  );
};

const ByeElections = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <Badge variant="outline" className="mb-3">
            <Calendar className="h-3 w-3 mr-1" /> April – May 2026
          </Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Assembly Bye-Elections 2026
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            The Election Commission of India has announced bye-elections to 8 Assembly
            Constituencies across 6 states — Goa, Gujarat, Karnataka, Maharashtra, Nagaland and
            Tripura. All seats are vacant due to the death of the sitting MLA. Polling is split into
            two phases (9 April & 23 April 2026); counting for all seats is on 4 May 2026.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { icon: MapPin, label: "Total Seats", value: "8" },
            { icon: Users, label: "States Involved", value: "6" },
            { icon: Vote, label: "Counting Day", value: "4 May 2026" },
            { icon: Calendar, label: "Phases", value: "2" },
          ].map((s) => (
            <Card key={s.label} className="border-border">
              <CardContent className="p-4 flex items-start gap-3">
                <s.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-semibold text-foreground text-sm">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Per-Seat Blocks */}
        <div className="space-y-8">
          {SEATS.map((seat) => (
            <Card key={seat.acNumber} className="border-border overflow-hidden">
              <CardHeader className="bg-muted/40 border-b border-border">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <Badge variant="outline" className="mb-2 text-xs">
                      Seat #{seat.no} • {seat.state}
                    </Badge>
                    <CardTitle className="text-xl md:text-2xl font-display">
                      {seat.constituency}{" "}
                      <span className="text-muted-foreground font-normal text-base">
                        ({seat.acNumber})
                      </span>
                    </CardTitle>
                  </div>
                  {seat.reservation && (
                    <Badge variant="secondary">{seat.reservation}</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Vacancy reason */}
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-foreground mb-1">Reason for Vacancy</p>
                    <p className="text-muted-foreground">{seat.vacancyReason}</p>
                    <p className="text-muted-foreground mt-1">
                      <span className="font-medium text-foreground">Previous MLA:</span>{" "}
                      {seat.previousMLA} ({seat.previousParty})
                    </p>
                  </div>
                </div>

                {/* Candidates */}
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Candidates in Fray ({seat.totalCandidates} total)
                  </h4>
                  <div className="space-y-2">
                    {seat.candidates.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-3 p-3 border border-border rounded-lg"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm">{c.name}</p>
                          {c.note && (
                            <p className="text-xs text-muted-foreground mt-0.5">{c.note}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-medium text-foreground">{c.party}</p>
                          {c.alliance && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {c.alliance}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key contest */}
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">Key Contest</h4>
                  <p className="text-sm text-muted-foreground">{seat.keyContest}</p>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/50 rounded-xl p-6 text-center text-sm text-muted-foreground mt-10">
          <p>
            Source: Election Commission of India (ECI) official notification dated 15 March 2026.
            Candidate lists reflect status after the withdrawal deadline. For the most current
            information visit{" "}
            <a
              href="https://eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              eci.gov.in
            </a>
            .
          </p>
        </div>
      </main>
      <FeedbackSection />
      <FooterSection />
    </div>
  );
};

export default ByeElections;
