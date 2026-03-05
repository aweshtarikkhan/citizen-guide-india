import { XCircle, CheckCircle } from "lucide-react";

const myths = [
  { myth: "You cannot vote without a Voter ID card", truth: "You can vote with 11 other approved identity documents like Aadhaar, passport, or driving license." },
  { myth: "NOTA vote is wasted — it doesn't count", truth: "NOTA is officially recorded. It allows you to express dissatisfaction with all candidates." },
  { myth: "Someone can find out who you voted for", truth: "Your vote is completely secret. The ballot system is designed to protect voter privacy." },
  { myth: "One vote doesn't make a difference", truth: "Many elections have been decided by a margin of just 1–2 votes. Every vote matters." },
];

const MythsSection = () => (
  <section id="myths" className="py-20 md:py-28 bg-background">
    <div className="container max-w-4xl">
      <div className="text-center mb-14">
        <span className="text-sm font-semibold text-primary uppercase tracking-widest">Myth Busters</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 text-foreground">
          Separating Fact from Fiction
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Common misconceptions that prevent citizens from exercising their democratic rights.
        </p>
      </div>
      <div className="space-y-5">
        {myths.map((m, i) => (
          <div key={i} className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div className="flex items-start gap-3 p-5 bg-destructive/5 border-b border-border">
              <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="font-medium text-foreground"><span className="text-destructive font-semibold">Myth:</span> {m.myth}</p>
            </div>
            <div className="flex items-start gap-3 p-5">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground"><span className="text-primary font-semibold">Truth:</span> {m.truth}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MythsSection;
