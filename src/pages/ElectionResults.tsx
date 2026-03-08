import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { TrendingUp, BarChart3, MapPin, Calendar, Users, Award } from "lucide-react";

const electionData = [
  {
    year: "2024",
    title: "18th Lok Sabha Elections",
    totalSeats: 543,
    results: [
      { party: "BJP", seats: 240, color: "hsl(var(--chart-1))" },
      { party: "INC", seats: 99, color: "hsl(var(--chart-2))" },
      { party: "SP", seats: 37, color: "hsl(var(--chart-3))" },
      { party: "TMC", seats: 29, color: "hsl(var(--chart-4))" },
      { party: "Others", seats: 138, color: "hsl(var(--chart-5))" },
    ],
    turnout: "65.79%",
  },
  {
    year: "2019",
    title: "17th Lok Sabha Elections",
    totalSeats: 543,
    results: [
      { party: "BJP", seats: 303, color: "hsl(var(--chart-1))" },
      { party: "INC", seats: 52, color: "hsl(var(--chart-2))" },
      { party: "DMK", seats: 23, color: "hsl(var(--chart-3))" },
      { party: "TMC", seats: 22, color: "hsl(var(--chart-4))" },
      { party: "Others", seats: 143, color: "hsl(var(--chart-5))" },
    ],
    turnout: "67.40%",
  },
  {
    year: "2014",
    title: "16th Lok Sabha Elections",
    totalSeats: 543,
    results: [
      { party: "BJP", seats: 282, color: "hsl(var(--chart-1))" },
      { party: "INC", seats: 44, color: "hsl(var(--chart-2))" },
      { party: "AIADMK", seats: 37, color: "hsl(var(--chart-3))" },
      { party: "TMC", seats: 34, color: "hsl(var(--chart-4))" },
      { party: "Others", seats: 146, color: "hsl(var(--chart-5))" },
    ],
    turnout: "66.44%",
  },
];

const newsItems = [
  { title: "State Assembly Elections 2025 Schedule Announced", date: "March 2025", category: "Upcoming" },
  { title: "ECI Launches Voter Awareness Campaign", date: "February 2025", category: "News" },
  { title: "New Voter Registration Drive in 5 States", date: "January 2025", category: "Registration" },
  { title: "Digital Voting Pilot Program Update", date: "December 2024", category: "Technology" },
  { title: "Record Youth Voter Turnout in 2024", date: "November 2024", category: "Analysis" },
  { title: "VVPAT Verification Process Explained", date: "October 2024", category: "Education" },
];

const ElectionResults = () => (
  <div className="min-h-screen">
    <Navbar />

    {/* Hero */}
    <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-muted/50">
      <div className="container max-w-5xl text-center">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Election Data</span>
        <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 text-foreground">
          Election Results & News
        </h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Stay updated with latest election results, analysis, and news from across India.
        </p>
      </div>
    </section>

    {/* Key Stats */}
    <section className="py-12 bg-background border-b border-border">
      <div className="container max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, value: "97 Cr+", label: "Registered Voters" },
            { icon: MapPin, value: "543", label: "Lok Sabha Seats" },
            { icon: Calendar, value: "18", label: "General Elections" },
            { icon: Award, value: "67%", label: "Avg. Turnout (2024)" },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-xl bg-card border border-border shadow-card text-center">
              <stat.icon className="h-6 w-6 text-foreground mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Recent Elections */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-5xl">
        <h2 className="text-3xl font-display font-bold text-foreground mb-10">Recent Lok Sabha Results</h2>
        <div className="space-y-8">
          {electionData.map((election, i) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground">{election.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Total Seats: {election.totalSeats} | Voter Turnout: {election.turnout}</p>
                </div>
                <span className="px-4 py-1.5 bg-foreground text-background rounded-full text-sm font-semibold">{election.year}</span>
              </div>
              <div className="flex rounded-lg overflow-hidden h-10 mb-4">
                {election.results.map((r, j) => (
                  <div
                    key={j}
                    style={{ width: `${(r.seats / election.totalSeats) * 100}%`, backgroundColor: r.color }}
                    className="flex items-center justify-center text-xs font-bold text-background transition-all"
                    title={`${r.party}: ${r.seats} seats`}
                  >
                    {r.seats > 30 ? r.seats : ""}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                {election.results.map((r, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-sm text-foreground font-medium">{r.party}</span>
                    <span className="text-sm text-muted-foreground">({r.seats})</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* News */}
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container max-w-5xl">
        <h2 className="text-3xl font-display font-bold text-foreground mb-10">Latest Election News</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {newsItems.map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-card border border-border shadow-card flex items-start gap-4 hover:shadow-elevated transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-background" />
              </div>
              <div>
                <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">{item.category}</span>
                <h3 className="text-sm font-semibold text-foreground mt-0.5">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <FooterSection />
  </div>
);

export default ElectionResults;
