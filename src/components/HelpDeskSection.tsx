import { UserPlus, FileText, MapPin, ShieldCheck, AlertCircle, Search, ClipboardCheck, ExternalLink } from "lucide-react";

const items = [
  { icon: UserPlus, title: "Register to Vote", desc: "Step-by-step guidance on new voter registration through Form 6" },
  { icon: FileText, title: "Correct Voter Details", desc: "Update your name, address, photo, or other details in the electoral roll" },
  { icon: MapPin, title: "Find Your Polling Station", desc: "Locate your assigned polling booth using your EPIC number or details" },
  { icon: ShieldCheck, title: "Documents Required", desc: "Know exactly which identity documents you need to carry on polling day" },
  { icon: AlertCircle, title: "Name Missing?", desc: "What to do if your name is missing from the electoral roll before elections" },
  { icon: Search, title: "Check Voter Status", desc: "Verify your registration status and details in the current electoral roll" },
  {
    icon: ClipboardCheck,
    title: "Search Your Name in SIR",
    desc: "Check if your name appears in the Special Intensive Revision (SIR) of the electoral roll on the official ECI portal",
    href: "https://voters.eci.gov.in/",
    external: true,
  },
];

const HelpDeskSection = () => (
  <section id="help-desk" className="py-20 md:py-28 bg-background">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-sm font-semibold text-primary uppercase tracking-widest">Voter Help Desk</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 text-foreground">
          How Can We Help You?
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Simple, step-by-step guidance for all your voter-related needs. We guide you toward official Election Commission services.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="group p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-gradient-warm group-hover:text-primary-foreground transition-colors">
              <item.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HelpDeskSection;
