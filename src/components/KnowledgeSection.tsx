import { Landmark, Users, BookOpen, Vote } from "lucide-react";

const topics = [
  { icon: Vote, title: "How Elections Work", desc: "Understand the complete election process — from nominations to results" },
  { icon: Landmark, title: "Parliament & Legislatures", desc: "Learn how laws are made and how your representatives serve you" },
  { icon: Users, title: "Your Representatives", desc: "Know the roles of MPs, MLAs, councillors, and their responsibilities" },
  { icon: BookOpen, title: "Policies That Matter", desc: "How public policies on education, health, and welfare impact your life" },
];

const KnowledgeSection = () => (
  <section id="knowledge" className="py-20 md:py-28 bg-muted/50">
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Civic Knowledge Hub</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 text-foreground">
            Know Your Democracy
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-lg leading-relaxed">
            Democracy works best when citizens understand it. Explore how India's democratic institutions function and how you can engage with them.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {topics.map((t, i) => (
            <div key={i} className="p-5 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-all duration-300 group cursor-pointer">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-gradient-warm transition-colors">
                <t.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{t.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default KnowledgeSection;
