import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Clock, Calendar, FileCheck, Megaphone, Vote, BarChart3, Trophy, AlertTriangle } from "lucide-react";

const phases = [
  {
    icon: Calendar,
    title: "1. Announcement of Election Dates",
    desc: "The Election Commission of India (ECI) announces the election schedule, including dates for nominations, campaigning, polling, and counting.",
    details: [
      "The Model Code of Conduct (MCC) comes into effect immediately upon announcement.",
      "Political parties and candidates cannot use government resources for campaign purposes after this date.",
      "All ongoing government schemes and announcements are frozen to ensure a level playing field.",
      "The ECI typically announces dates 4–8 weeks before polling day.",
      "Separate schedules are announced for multi-phase elections across different states.",
    ],
  },
  {
    icon: FileCheck,
    title: "2. Filing of Nominations",
    desc: "Candidates file their nomination papers with the Returning Officer of their constituency.",
    details: [
      "Candidates must submit an affidavit declaring their criminal record, assets, liabilities, and educational qualifications.",
      "A security deposit of ₹25,000 (₹12,500 for SC/ST candidates) is required for Lok Sabha elections.",
      "For state assembly elections, the deposit is ₹10,000 (₹5,000 for SC/ST candidates).",
      "Independent candidates need no party backing but must meet all eligibility criteria.",
      "Nomination papers are available from the Returning Officer's office free of charge.",
      "Candidates must be Indian citizens and meet the minimum age requirement (25 for Lok Sabha/Vidhan Sabha, 30 for Rajya Sabha/Vidhan Parishad).",
    ],
  },
  {
    icon: AlertTriangle,
    title: "3. Scrutiny of Nominations",
    desc: "The Returning Officer examines all nomination papers for validity and completeness.",
    details: [
      "Nominations are checked for proper signatures, valid proposers, correct constituency, and complete affidavits.",
      "Invalid nominations are rejected with reasons recorded in writing.",
      "Candidates or their representatives can raise objections during scrutiny.",
      "The scrutiny process is transparent and open to candidates and their agents.",
      "Rejected candidates can appeal to the appropriate authority.",
    ],
  },
  {
    icon: Clock,
    title: "4. Withdrawal of Candidature",
    desc: "Candidates may withdraw their nomination before the deadline set by the ECI.",
    details: [
      "Withdrawal must be made in person before the Returning Officer by the deadline.",
      "After the withdrawal deadline, the final list of contesting candidates is published.",
      "Candidates who withdraw forfeit their security deposit.",
      "Strategic withdrawals often happen as parties negotiate seat-sharing arrangements.",
      "The final candidate list includes symbols allocated to each candidate.",
    ],
  },
  {
    icon: Megaphone,
    title: "5. Election Campaign Period",
    desc: "Parties and candidates campaign to win voter support through rallies, advertisements, and outreach.",
    details: [
      "Campaigning must stop 48 hours before polling day (the 'silence period').",
      "Election expenditure is capped — ₹95 lakh for Lok Sabha and ₹40 lakh for Vidhan Sabha (as of 2024 limits).",
      "Candidates must maintain detailed expense accounts and submit them to the ECI.",
      "Paid news, hate speech, and communal appeals are strictly prohibited.",
      "Social media campaigns are now monitored by the ECI's Media Certification and Monitoring Committee.",
      "Door-to-door canvassing, public meetings, and roadshows are common campaign methods.",
      "Exit polls cannot be published until the last phase of polling is complete.",
    ],
  },
  {
    icon: Vote,
    title: "6. Polling Day",
    desc: "Citizens cast their votes at designated polling stations using Electronic Voting Machines (EVMs).",
    details: [
      "Polling hours are typically 7 AM to 6 PM, but may vary by region.",
      "Every voter in the queue at closing time is allowed to vote.",
      "Voters must carry approved identity documents to the polling booth.",
      "The voting process: identity verification → ink marking on finger → pressing the button on the EVM → VVPAT slip verification.",
      "Polling booths are equipped with ramps, braille signage, and assistance for differently-abled voters.",
      "Webcasting is done in sensitive booths for real-time monitoring.",
      "Central Armed Police Forces (CAPF) are deployed for security at polling stations.",
      "Mock polls are conducted before actual voting begins to verify EVM functionality.",
    ],
  },
  {
    icon: BarChart3,
    title: "7. Counting of Votes",
    desc: "Votes are counted at designated counting centres under strict security and supervision.",
    details: [
      "Counting typically begins at 8 AM on the designated counting day.",
      "Postal ballots are counted first, followed by EVM votes round by round.",
      "Each round represents votes from one or more polling stations.",
      "VVPAT slips from 5 randomly selected booths per constituency are physically verified against EVM counts.",
      "Counting agents from all parties observe the process.",
      "Results are declared constituency by constituency as counting is completed.",
      "Any candidate can request a recount if they suspect discrepancies.",
    ],
  },
  {
    icon: Trophy,
    title: "8. Declaration of Results",
    desc: "The candidate with the highest number of votes is declared the winner by the Returning Officer.",
    details: [
      "The Returning Officer issues a certificate of election to the winning candidate.",
      "Results are published on the ECI website in real-time during counting.",
      "Losing candidates can challenge results through an election petition in the High Court within 45 days.",
      "If no party gets a majority, the Governor/President invites the largest party/coalition to form the government.",
      "The entire process from announcement to results typically takes 6–10 weeks.",
      "By-elections follow the same process but for individual constituencies that fall vacant.",
    ],
  },
];

const ElectionTimelinePage = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 bg-background">
      <div className="container max-w-4xl">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Election Timeline</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-3 text-foreground">
          How an Election Unfolds
        </h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-2xl leading-relaxed">
          From announcement to results — understand every phase of India's election process with detailed breakdowns.
        </p>
      </div>
    </section>

    <section className="pb-20 bg-background">
      <div className="container max-w-4xl space-y-10">
        {phases.map((phase, i) => (
          <div key={i} className="rounded-xl border border-border bg-card shadow-card p-8 relative">
            {i < phases.length - 1 && (
              <div className="hidden md:block absolute left-12 top-full w-px h-10 bg-border" />
            )}
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                <phase.icon className="h-6 w-6 text-background" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">{phase.title}</h2>
                <p className="text-muted-foreground mt-1">{phase.desc}</p>
              </div>
            </div>
            <ul className="space-y-3">
              {phase.details.map((d, j) => (
                <li key={j} className="flex items-start gap-3">
                  <span className="text-foreground font-bold text-sm mt-0.5 flex-shrink-0">{String(j + 1).padStart(2, '0')}.</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    <FooterSection />
  </div>
);

export default ElectionTimelinePage;
