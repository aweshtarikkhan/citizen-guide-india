import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  { name: "Election Commission of India", url: "https://www.eci.gov.in", desc: "Official ECI website for all election-related information." },
  { name: "National Voter Service Portal", url: "https://www.nvsp.in", desc: "Register, update, or search voter details online." },
  { name: "Electoral Search", url: "https://electoralsearch.eci.gov.in", desc: "Check your name in the electoral roll and find your polling station." },
  { name: "Voter Helpline App", url: "https://play.google.com/store/apps/details?id=com.eci.citizen", desc: "ECI's official app for voter services on mobile." },
];

const ContactPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 bg-background">
      <div className="container max-w-4xl">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Contact</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-3 text-foreground">
          Get in Touch
        </h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Have questions, suggestions, or want to collaborate? Reach out to us. For official voter-related queries, we recommend contacting the Election Commission directly.
        </p>
      </div>
    </section>

    <section className="pb-20 bg-background">
      <div className="container max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-xl border border-border bg-card shadow-card p-8">
            <h2 className="text-xl font-display font-bold text-foreground mb-6">Contact Matdaan</h2>
            <div className="space-y-5">
              <a href="mailto:editor@matdaan.com" className="flex items-start gap-3 group">
                <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-background" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Email</p>
                  <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">editor@matdaan.com</p>
                </div>
              </a>
              <a href="tel:+919009036633" className="flex items-start gap-3 group">
                <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-background" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Phone</p>
                  <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">+91 9009036633</p>
                </div>
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-card p-8">
            <h2 className="text-xl font-display font-bold text-foreground mb-6">Official Helplines</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-background" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">National Voter Helpline</p>
                  <p className="text-muted-foreground text-sm">1950 (toll-free)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-background" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">ECI Grievance Portal</p>
                  <a href="https://eci-citizenservices.eci.nic.in/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-foreground transition-colors underline">
                    eci-citizenservices.eci.nic.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-display font-bold text-foreground mb-6">Useful Resources</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {resources.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-card shadow-card p-6 hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-semibold text-foreground">{r.name}</h3>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>

    <FooterSection />
  </div>
);

export default ContactPage;
