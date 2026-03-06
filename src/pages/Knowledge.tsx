import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Landmark, Users, BookOpen, Vote, Scale, Globe, Shield, FileText } from "lucide-react";

const topics = [
  {
    icon: Vote,
    title: "How Elections Work in India",
    content: [
      "India follows a First-Past-The-Post (FPTP) system where the candidate with the most votes wins, regardless of majority.",
      "General Elections (Lok Sabha) are held every 5 years to elect 543 Members of Parliament from constituencies across India.",
      "State Assembly Elections elect MLAs to state legislatures. These can happen independently of general elections.",
      "The Election Commission of India (ECI) is an autonomous constitutional body that oversees free and fair elections.",
      "The process includes: announcement of dates → filing of nominations → scrutiny → withdrawal → campaigning → polling → counting → results.",
      "Electronic Voting Machines (EVMs) have been used since 2004. VVPAT (Voter Verifiable Paper Audit Trail) was introduced to add a layer of verification.",
    ],
  },
  {
    icon: Landmark,
    title: "Parliament & Legislatures",
    content: [
      "India's Parliament has two houses: Lok Sabha (House of the People, 543 elected + 2 nominated) and Rajya Sabha (Council of States, 245 members).",
      "Lok Sabha members are directly elected by citizens. Rajya Sabha members are elected by state legislators.",
      "A bill must be passed by both houses and receive Presidential assent to become law.",
      "Money Bills can only be introduced in Lok Sabha. Rajya Sabha can suggest amendments but cannot reject them.",
      "State Legislatures function similarly — Vidhan Sabha (Legislative Assembly) is the lower house; some states have a Vidhan Parishad (Legislative Council).",
      "Question Hour, Zero Hour, and debates are mechanisms through which representatives raise public issues in Parliament.",
    ],
  },
  {
    icon: Users,
    title: "Your Representatives & Their Roles",
    content: [
      "Member of Parliament (MP) — represents your constituency in Lok Sabha, participates in lawmaking, and raises issues of national importance.",
      "Member of Legislative Assembly (MLA) — represents your constituency in the state assembly, focuses on state-level legislation and local issues.",
      "Councillors/Corporators — represent you in municipal bodies, handle local governance like roads, water, sanitation, and urban planning.",
      "Sarpanch/Gram Panchayat — elected head of the village panchayat, responsible for rural development and local dispute resolution.",
      "Each representative has constituency development funds (MPLAD/MLALAD) to spend on local infrastructure and welfare projects.",
      "You can meet your representatives during public grievance sessions or write to them about issues affecting your area.",
    ],
  },
  {
    icon: BookOpen,
    title: "Policies That Affect Your Life",
    content: [
      "Right to Education (RTE) — guarantees free and compulsory education for children aged 6–14 in India.",
      "MGNREGA — provides 100 days of guaranteed wage employment per year to rural households.",
      "Ayushman Bharat — provides health insurance coverage of ₹5 lakh per family per year for secondary and tertiary hospitalisation.",
      "PM-KISAN — provides ₹6,000 per year in three instalments to small and marginal farmer families.",
      "Digital India — initiative to transform India into a digitally empowered society and knowledge economy.",
      "Your vote influences which policies get prioritised, funded, and implemented at national and state levels.",
    ],
  },
  {
    icon: Scale,
    title: "The Judiciary & Rule of Law",
    content: [
      "India has an independent judiciary with the Supreme Court at the apex, followed by High Courts and District Courts.",
      "The Supreme Court is the guardian of the Constitution and has the power of judicial review.",
      "Public Interest Litigations (PILs) allow citizens to approach courts on matters of public interest.",
      "Fundamental Rights (Articles 14–32) are justiciable — you can approach courts if they are violated.",
      "The judiciary ensures that laws passed by Parliament and state legislatures conform to the Constitution.",
      "Legal aid is available free of cost to economically weaker sections under the Legal Services Authorities Act.",
    ],
  },
  {
    icon: Shield,
    title: "Fundamental Rights & Duties",
    content: [
      "Six Fundamental Rights: Right to Equality, Right to Freedom, Right against Exploitation, Right to Freedom of Religion, Cultural and Educational Rights, Right to Constitutional Remedies.",
      "Article 21 — Right to Life and Personal Liberty is the most expansive, covering right to privacy, dignity, clean environment, and more.",
      "Fundamental Duties (Article 51A) include respecting the Constitution, national flag, anthem, and promoting harmony and the spirit of common brotherhood.",
      "Directive Principles of State Policy guide the government in making laws for social and economic welfare.",
      "Rights and duties together form the foundation of democratic citizenship in India.",
      "Awareness of your rights empowers you to hold the state accountable and participate meaningfully in governance.",
    ],
  },
];

const KnowledgePage = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 bg-background">
      <div className="container max-w-4xl">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Civic Knowledge Hub</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-3 text-foreground">
          Know Your Democracy
        </h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Democracy works best when citizens understand it. Explore how India's democratic institutions function, what your rights are, and how you can engage meaningfully.
        </p>
      </div>
    </section>

    <section className="pb-20 bg-background">
      <div className="container max-w-4xl space-y-12">
        {topics.map((topic, i) => (
          <div key={i} className="rounded-xl border border-border bg-card shadow-card p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                <topic.icon className="h-6 w-6 text-background" />
              </div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">{topic.title}</h2>
            </div>
            <ul className="space-y-4">
              {topic.content.map((point, j) => (
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

export default KnowledgePage;
