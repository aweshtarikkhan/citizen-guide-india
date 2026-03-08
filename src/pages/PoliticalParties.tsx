import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Users, Calendar, MapPin, Globe } from "lucide-react";

const nationalParties = [
  { name: "Bharatiya Janata Party (BJP)", founded: "1980", symbol: "Lotus", president: "J.P. Nadda", hq: "New Delhi", ideology: "Right-wing, Hindu nationalism" },
  { name: "Indian National Congress (INC)", founded: "1885", symbol: "Hand", president: "Mallikarjun Kharge", hq: "New Delhi", ideology: "Centre-left, Social liberalism" },
  { name: "Bahujan Samaj Party (BSP)", founded: "1984", symbol: "Elephant", president: "Mayawati", hq: "New Delhi", ideology: "Social justice, Ambedkarism" },
  { name: "Communist Party of India (Marxist)", founded: "1964", symbol: "Hammer, Sickle and Star", president: "Sitaram Yechury", hq: "New Delhi", ideology: "Left-wing, Marxism" },
  { name: "Aam Aadmi Party (AAP)", founded: "2012", symbol: "Broom", president: "Arvind Kejriwal", hq: "New Delhi", ideology: "Centre, Populism" },
  { name: "National People's Party (NPP)", founded: "2013", symbol: "Book", president: "Conrad Sangma", hq: "Meghalaya", ideology: "Centre-right, Regionalism" },
];

const stateParties = [
  { name: "Trinamool Congress (TMC)", state: "West Bengal", founded: "1998" },
  { name: "Dravida Munnetra Kazhagam (DMK)", state: "Tamil Nadu", founded: "1949" },
  { name: "Shiv Sena", state: "Maharashtra", founded: "1966" },
  { name: "Samajwadi Party (SP)", state: "Uttar Pradesh", founded: "1992" },
  { name: "Telegu Desam Party (TDP)", state: "Andhra Pradesh", founded: "1982" },
  { name: "Janata Dal (United)", state: "Bihar", founded: "1999" },
  { name: "Rashtriya Janata Dal (RJD)", state: "Bihar", founded: "1997" },
  { name: "Biju Janata Dal (BJD)", state: "Odisha", founded: "1997" },
  { name: "YSR Congress Party", state: "Andhra Pradesh", founded: "2011" },
  { name: "Jharkhand Mukti Morcha (JMM)", state: "Jharkhand", founded: "1972" },
  { name: "Shiromani Akali Dal (SAD)", state: "Punjab", founded: "1920" },
  { name: "Nationalist Congress Party (NCP)", state: "Maharashtra", founded: "1999" },
];

const PoliticalParties = () => (
  <div className="min-h-screen">
    <Navbar />

    {/* Hero */}
    <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-muted/50">
      <div className="container max-w-5xl text-center">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Democracy</span>
        <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 text-foreground">
          Political Parties of India
        </h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Learn about India's national and state-level political parties, their ideologies, and history.
        </p>
      </div>
    </section>

    {/* National Parties */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-5xl">
        <h2 className="text-3xl font-display font-bold text-foreground mb-10">National Parties</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {nationalParties.map((party, i) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow">
              <h3 className="text-lg font-display font-bold text-foreground mb-3">{party.name}</h3>
              <div className="space-y-2">
                {[
                  { icon: Calendar, label: "Founded", value: party.founded },
                  { icon: Users, label: "President", value: party.president },
                  { icon: MapPin, label: "Headquarters", value: party.hq },
                  { icon: Globe, label: "Ideology", value: party.ideology },
                ].map((item, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item.label}:</span>
                    <span className="text-sm font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">Symbol: </span>
                <span className="text-xs font-semibold text-foreground">{party.symbol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* State Parties */}
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container max-w-5xl">
        <h2 className="text-3xl font-display font-bold text-foreground mb-10">Major State Parties</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stateParties.map((party, i) => (
            <div key={i} className="p-5 rounded-xl bg-card border border-border shadow-card">
              <h3 className="text-sm font-display font-bold text-foreground">{party.name}</h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {party.state}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {party.founded}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Info */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-3xl text-center">
        <h2 className="text-2xl font-display font-bold text-foreground mb-4">How are Parties Recognized?</h2>
        <p className="text-muted-foreground leading-relaxed">
          The Election Commission of India (ECI) classifies parties as <strong className="text-foreground">National</strong> or <strong className="text-foreground">State</strong> parties based on their electoral performance. A party needs to win at least 2% of Lok Sabha seats from 3+ states, or 6% votes in 4+ states with 4 Lok Sabha seats to be recognized as a national party.
        </p>
      </div>
    </section>

    <FooterSection />
  </div>
);

export default PoliticalParties;
