const stats = [
  { value: "950M+", label: "Eligible Voters" },
  { value: "543", label: "Parliamentary Constituencies" },
  { value: "4,120+", label: "Assembly Constituencies" },
  { value: "28+8", label: "States & UTs" },
];

const StatsSection = () => (
  <section className="py-16 bg-gradient-warm">
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <div key={i} className="space-y-1 animate-count-up" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">{s.value}</div>
            <div className="text-sm text-primary-foreground/80 font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
