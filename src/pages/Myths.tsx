import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { XCircle, CheckCircle } from "lucide-react";

const myths = [
  {
    myth: "You cannot vote without a Voter ID card.",
    truth: "You can vote with 12 approved identity documents including Aadhaar, Passport, Driving License, PAN Card, and more. The Voter ID (EPIC) is preferred but not mandatory.",
    source: "Election Commission of India guidelines on alternative identity documents.",
  },
  {
    myth: "NOTA vote is wasted — it doesn't count.",
    truth: "NOTA (None of the Above) is officially recorded and published in election results. It allows voters to formally express dissatisfaction with all candidates. However, even if NOTA gets the highest votes, the candidate with the most votes among contestants still wins.",
    source: "Supreme Court judgment in PUCL vs. Union of India (2013).",
  },
  {
    myth: "Someone can find out who you voted for.",
    truth: "Your vote is completely secret. EVMs do not store any information linking your identity to your vote. The entire system — from booth design to machine architecture — is built to protect voter privacy. Even the Presiding Officer cannot know who you voted for.",
    source: "ECI's EVM security protocols and the Representation of the People Act.",
  },
  {
    myth: "One vote doesn't make a difference.",
    truth: "Many elections in India have been won by margins of 1–5 votes. In the 2019 Lok Sabha elections, several constituencies were decided by a few hundred votes out of millions. In local body elections, single-vote margins are common. In 2017, a Rajasthan panchayat election was decided by a coin toss after a tie.",
    source: "ECI election result archives.",
  },
  {
    myth: "EVMs can be hacked or tampered with.",
    truth: "Indian EVMs are standalone machines with no internet, Wi-Fi, or Bluetooth connectivity. They use one-time programmable chips that cannot be reprogrammed. The ECI conducts randomised allocation, multiple sealing, and VVPAT verification. No court or inquiry has ever found evidence of EVM tampering in Indian elections.",
    source: "ECI technical expert committee reports and Supreme Court observations.",
  },
  {
    myth: "NRIs cannot vote in Indian elections.",
    truth: "NRIs can vote in Indian elections — but only in person at their registered constituency's polling booth. The Representation of the People (Amendment) Act, 2010 allows NRIs to register as overseas voters. Efforts for postal voting and e-voting for NRIs are ongoing.",
    source: "Section 20A of the Representation of the People Act, 1950.",
  },
  {
    myth: "You can only vote if you're 18 on election day.",
    truth: "You must be 18 years old on the qualifying date, which is 1st January of the year of revision of the electoral roll — not on election day itself. If you turn 18 after 1st January but before the election, you may not be eligible for that particular election.",
    source: "Section 14(b) of the Representation of the People Act, 1950.",
  },
  {
    myth: "Voting is compulsory in India.",
    truth: "Voting is a right, not a legal obligation, in India. While Gujarat and some states have experimented with compulsory voting provisions in local body elections, there is no nationwide law mandating citizens to vote. However, voting is a civic duty.",
    source: "Constitutional provisions and state-specific legislation.",
  },
  {
    myth: "Booth capturing is still common in Indian elections.",
    truth: "Booth capturing has been virtually eliminated thanks to EVMs, CCTV surveillance, micro-observers, CAPF deployment, and webcasting. The ECI can nullify results and order re-polling if booth capturing is reported. The Representation of the People Act prescribes imprisonment for booth capturing.",
    source: "Section 135A of the Representation of the People Act, 1951.",
  },
  {
    myth: "Postal ballots are unreliable and can be manipulated.",
    truth: "Postal ballots follow strict protocols — they are issued to specific categories (service voters, senior citizens 80+, PwD voters, election duty officials), sealed in double envelopes, and counted first under observation. The system has robust security measures including bar-coded serial numbers and video recording of the counting process.",
    source: "ECI guidelines on postal ballot procedures.",
  },
  {
    myth: "The ruling party can influence the Election Commission.",
    truth: "The ECI is a constitutionally independent body. The Chief Election Commissioner can only be removed through the same process as a Supreme Court judge (impeachment). Election Commissioners cannot be removed without the CEC's recommendation. The ECI has historically countermanded elections, censured ruling parties, and enforced the Model Code of Conduct against the government of the day.",
    source: "Article 324 of the Constitution of India.",
  },
  {
    myth: "Rich candidates always win elections.",
    truth: "While money power is a concern, India has strict election expenditure limits — ₹95 lakh for Lok Sabha and ₹40 lakh for Vidhan Sabha candidates. The ECI deploys expenditure observers, monitors bank accounts, and conducts raids. Many well-funded candidates have lost to grassroots campaigners. Voters increasingly consider performance over spending.",
    source: "ECI expenditure monitoring guidelines and election result data.",
  },
];

const MythsPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 bg-background">
      <div className="container max-w-4xl">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Myth Busters</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-3 text-foreground">
          Separating Fact from Fiction
        </h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Misconceptions about voting prevent millions from exercising their rights. Here are {myths.length} common myths debunked with facts and official sources.
        </p>
      </div>
    </section>

    <section className="pb-20 bg-background">
      <div className="container max-w-4xl space-y-6">
        {myths.map((m, i) => (
          <div key={i} className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div className="flex items-start gap-3 p-6 border-b border-border bg-muted/30">
              <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-destructive uppercase tracking-wider">Myth #{i + 1}</span>
                <p className="font-display font-semibold text-foreground mt-1">{m.myth}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">Truth</span>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{m.truth}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/70 mt-4 pl-8 italic">Source: {m.source}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <FooterSection />
  </div>
);

export default MythsPage;
