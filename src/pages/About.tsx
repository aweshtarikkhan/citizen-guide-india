import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Heart, Shield, Eye, Users } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Non-Partisan",
    desc: "We are not affiliated with any political party, government body, or ideological group. Our only agenda is informed citizenship.",
  },
  {
    icon: Eye,
    title: "Transparent",
    desc: "All information is sourced from official Election Commission publications, constitutional documents, and verified legal sources.",
  },
  {
    icon: Heart,
    title: "Citizen-First",
    desc: "Built by citizens, for citizens. We believe that an informed voter is the foundation of a healthy democracy.",
  },
  {
    icon: Users,
    title: "Inclusive",
    desc: "We aim to make civic knowledge accessible to every Indian — regardless of language, location, or background.",
  },
];

const AboutPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 bg-background">
      <div className="container max-w-4xl">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">About</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-3 text-foreground">
          About Matdaan
        </h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Matdaan (मतदान) means "the act of voting" in Hindi. We are a non-partisan civic initiative dedicated to empowering Indian citizens with the knowledge and tools they need to participate meaningfully in democracy.
        </p>
      </div>
    </section>

    <section className="pb-16 bg-background">
      <div className="container max-w-4xl">
        <div className="rounded-xl border border-border bg-card shadow-card p-8 mb-12">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            India is the world's largest democracy with over 950 million eligible voters. Yet voter turnout averages around 65–67%, and millions of citizens remain unaware of their rights, the electoral process, or how to resolve basic voter-related issues.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Matdaan exists to bridge this gap. We provide clear, accurate, and accessible information about voting, elections, and democratic institutions — in a format that's easy to understand and act upon.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We don't tell you who to vote for. We help you understand why your vote matters, how the system works, and what your rights and responsibilities are as a citizen.
          </p>
        </div>

        <h2 className="text-2xl font-display font-bold text-foreground mb-8">Our Values</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {values.map((v, i) => (
            <div key={i} className="rounded-xl border border-border bg-card shadow-card p-6">
              <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center mb-4">
                <v.icon className="h-5 w-5 text-background" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card shadow-card p-8">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">Disclaimer</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            Matdaan is an independent civic initiative. We are <strong>not</strong> affiliated with the Election Commission of India, any government department, or any political party.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            All information provided is for educational purposes and is sourced from publicly available official documents. For official processes and legal actions, always refer to the Election Commission of India (<a href="https://www.eci.gov.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">eci.gov.in</a>) or the National Voter Service Portal (<a href="https://www.nvsp.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">nvsp.in</a>).
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We encourage all citizens to verify information through official channels before taking any action.
          </p>
        </div>
      </div>
    </section>

    <FooterSection />
  </div>
);

export default AboutPage;
