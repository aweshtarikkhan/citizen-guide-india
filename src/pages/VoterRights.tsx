import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Shield, Lock, Accessibility, AlertOctagon, Scale, HandHeart, Eye, Gavel } from "lucide-react";

const rights = [
  {
    icon: Shield,
    title: "Right to Vote",
    content: [
      "Every Indian citizen aged 18 or above (on the qualifying date) has the right to vote, guaranteed under Article 326 of the Constitution.",
      "No person can be denied the right to vote on grounds of religion, race, caste, sex, or place of birth.",
      "Universal Adult Suffrage ensures that every eligible citizen has equal voting power — one person, one vote, one value.",
      "Persons of unsound mind (as declared by a competent court) and those disqualified under election law are exceptions.",
      "Convicted prisoners serving sentences cannot vote, but undertrial prisoners retain their voting rights (Supreme Court ruling).",
      "Your right to vote is protected by the Representation of the People Act, 1950 and 1951.",
    ],
  },
  {
    icon: Lock,
    title: "Right to Secret Ballot",
    content: [
      "Your vote is absolutely secret. No one — not the government, not your employer, not even the Presiding Officer — can know whom you voted for.",
      "The design of polling booths ensures privacy — voting compartments are screened.",
      "EVMs do not store any data linking voter identity to the vote cast.",
      "It is a criminal offence for anyone to try to find out or reveal how a person voted.",
      "Even in election disputes, courts cannot compel a voter to reveal their vote.",
      "The secrecy provision is enshrined in Rule 49-O of the Conduct of Elections Rules, 1961.",
    ],
  },
  {
    icon: Accessibility,
    title: "Rights of Differently-Abled Voters",
    content: [
      "Every polling station must be accessible to persons with disabilities — ramps, ground-floor booths, and assistance are mandatory.",
      "Blind or infirm voters can bring a companion to assist them in voting (the companion must be over 18 and not a polling agent).",
      "Braille-enabled ballot papers and EVMs with Braille labels are available.",
      "Wheelchairs are provided at polling stations for voters who need them.",
      "The ECI's 'Accessible Elections' initiative aims to make every booth barrier-free.",
      "Special transport arrangements are made for differently-abled voters in many constituencies.",
    ],
  },
  {
    icon: AlertOctagon,
    title: "Right to Report Violations",
    content: [
      "You can report voter intimidation, booth capturing, bribing, or any election malpractice to the authorities.",
      "The cVIGIL app allows citizens to report Model Code of Conduct violations with photos/videos — reports reach the ECI in minutes.",
      "Complaints can also be filed with the Returning Officer, District Election Officer, or the ECI directly.",
      "The national voter helpline 1950 accepts complaints 24/7 during election periods.",
      "Whistleblower identities are protected under ECI guidelines.",
      "Filing a false complaint is also an offence — report responsibly with evidence.",
    ],
  },
  {
    icon: Scale,
    title: "Right to NOTA",
    content: [
      "The Supreme Court ruled in 2013 (PUCL vs Union of India) that voters have the right to reject all candidates.",
      "NOTA (None of the Above) is the last option on every EVM.",
      "NOTA votes are counted and officially recorded in election results.",
      "However, even if NOTA receives the most votes, the candidate with the highest votes among contestants wins.",
      "NOTA empowers voters to formally register dissatisfaction without invalidating their participation.",
      "Several democracies worldwide have adopted similar provisions following India's example.",
    ],
  },
  {
    icon: HandHeart,
    title: "Right to Free and Fair Elections",
    content: [
      "The Constitution guarantees free and fair elections through an independent Election Commission (Article 324).",
      "The Model Code of Conduct ensures a level playing field during elections.",
      "No government authority can influence voters through announcements, schemes, or threats during the election period.",
      "Security forces are deployed to ensure peaceful voting — booth capturing and rigging carry severe criminal penalties.",
      "Election observers appointed by the ECI monitor every constituency for fairness.",
      "Media coverage is monitored to prevent paid news and biased reporting during elections.",
    ],
  },
  {
    icon: Eye,
    title: "Right to Information About Candidates",
    content: [
      "Every candidate must file an affidavit declaring criminal cases, assets, liabilities, and educational qualifications.",
      "These affidavits are public documents — anyone can access them on the ECI or ADR (Association for Democratic Reforms) website.",
      "Candidates must also declare their sources of income and those of their spouse and dependents.",
      "You have the right to know if your candidate has pending criminal cases before you vote.",
      "The Supreme Court has ruled that voters' right to information is part of the right to freedom of expression (Article 19).",
      "NGOs like ADR and MyNeta.info compile and present candidate data in accessible formats.",
    ],
  },
  {
    icon: Gavel,
    title: "Right to Challenge Election Results",
    content: [
      "Any candidate or elector can challenge election results by filing an election petition in the High Court.",
      "Election petitions must be filed within 45 days of the result declaration.",
      "Grounds for challenge include corrupt practices, non-compliance with election law, and improper acceptance/rejection of nominations.",
      "The High Court can order a recount, declare the election void, or declare another candidate as the winner.",
      "Appeals against High Court decisions can be made to the Supreme Court.",
      "This mechanism ensures accountability and upholds democratic integrity.",
    ],
  },
];

const VoterRightsPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 bg-background">
      <div className="container max-w-4xl">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Voter Rights</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-3 text-foreground">
          Know Your Rights as a Voter
        </h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-2xl leading-relaxed">
          As a citizen of India, you have powerful rights that protect your vote and your voice. Know them, exercise them, and defend them.
        </p>
      </div>
    </section>

    <section className="pb-20 bg-background">
      <div className="container max-w-4xl space-y-10">
        {rights.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-card shadow-card p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                <item.icon className="h-6 w-6 text-background" />
              </div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">{item.title}</h2>
            </div>
            <ul className="space-y-3">
              {item.content.map((point, j) => (
                <li key={j} className="flex items-start gap-3">
                  <span className="text-foreground font-bold text-sm mt-0.5 flex-shrink-0">{String(j + 1).padStart(2, '0')}.</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{point}</span>
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

export default VoterRightsPage;
