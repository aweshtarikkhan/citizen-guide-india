import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Scale, BookOpen, FileText, Landmark } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";

const fundamentalArticles = [
  { article: "Article 326", title: "Adult Suffrage", desc: "Elections to the Lok Sabha and State Assemblies shall be on the basis of adult suffrage — every citizen who is 18+ years of age has the right to vote." },
  { article: "Article 324", title: "Election Commission", desc: "The superintendence, direction, and control of all elections shall be vested in the Election Commission of India." },
  { article: "Article 325", title: "No Discrimination", desc: "No person shall be ineligible for inclusion in the electoral roll on grounds of religion, race, caste, sex, or any of them." },
  { article: "Article 327", title: "Power of Parliament", desc: "Parliament may make laws regarding all matters relating to elections including preparation of electoral rolls." },
  { article: "Article 328", title: "Power of State Legislature", desc: "State Legislature may make laws regarding elections to State Legislature including preparation of electoral rolls." },
  { article: "Article 329", title: "Bar to Courts", desc: "No court shall interfere with electoral matters once the election process has been set in motion by the Election Commission." },
];

const keyLaws = [
  { name: "Representation of the People Act, 1950", desc: "Provides for allocation of seats, delimitation of constituencies, and preparation of electoral rolls.", year: "1950" },
  { name: "Representation of the People Act, 1951", desc: "Deals with conduct of elections, qualifications and disqualifications, corrupt practices, and election disputes.", year: "1951" },
  { name: "Anti-Defection Law (52nd Amendment)", desc: "Prevents elected representatives from switching political parties for personal gain after elections.", year: "1985" },
  { name: "Model Code of Conduct", desc: "Guidelines for political parties and candidates during elections to ensure free and fair polls.", year: "Ongoing" },
  { name: "EVM & VVPAT Rules", desc: "Conduct of Elections Rules amended to include Electronic Voting Machines and Voter Verified Paper Audit Trail.", year: "2013" },
  { name: "Delimitation Act", desc: "Provides for readjustment of allocation of seats in Lok Sabha and State Assemblies based on census.", year: "2002" },
];

const amendments = [
  { number: "61st", year: "1989", desc: "Reduced voting age from 21 to 18 years." },
  { number: "52nd", year: "1985", desc: "Added the Tenth Schedule (Anti-Defection Law)." },
  { number: "91st", year: "2003", desc: "Strengthened anti-defection provisions, limited Council of Ministers size." },
  { number: "73rd", year: "1992", desc: "Established Panchayati Raj system with elected local bodies." },
  { number: "74th", year: "1992", desc: "Established elected municipalities and urban local bodies." },
];

const ConstitutionLaws = () => {
  const { getContent } = usePageContent("constitution-laws");

  return (
  <div className="min-h-screen">
    <Navbar />

    <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-muted/50">
      <div className="container max-w-5xl text-center">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Legal Framework</span>
        <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 text-foreground">
          {getContent("page_title", "Constitution & Election Laws")}
        </h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          {getContent("page_desc", "Understand the constitutional provisions and laws that form the backbone of Indian democracy.")}
        </p>
      </div>
    </section>

    {/* Constitutional Articles */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-5xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center">
            <Landmark className="h-5 w-5 text-background" />
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground">Constitutional Articles</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {fundamentalArticles.map((a, i) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-card">
              <span className="px-3 py-1 bg-foreground text-background rounded-full text-xs font-bold">{a.article}</span>
              <h3 className="text-lg font-display font-bold text-foreground mt-3 mb-2">{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Key Laws */}
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container max-w-5xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center">
            <Scale className="h-5 w-5 text-background" />
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground">Key Election Laws</h2>
        </div>
        <div className="space-y-4">
          {keyLaws.map((law, i) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-card flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-sm font-display font-bold text-foreground">{law.name}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{law.year}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{law.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Key Amendments */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-5xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-background" />
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground">Key Constitutional Amendments</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {amendments.map((a, i) => (
            <div key={i} className="p-5 rounded-xl bg-card border border-border shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-display font-bold text-foreground">{a.number}</span>
                <span className="text-xs text-muted-foreground">Amendment</span>
              </div>
              <span className="text-xs font-semibold text-foreground/60">{a.year}</span>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <FooterSection />
  </div>
);

export default ConstitutionLaws;
