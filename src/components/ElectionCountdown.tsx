import { useState, useEffect } from "react";
import { Clock, Calendar } from "lucide-react";

// Next major election - can be updated
const NEXT_ELECTION = {
  name: "Bihar Assembly Election 2025",
  date: new Date("2025-11-01T00:00:00+05:30"),
  type: "State Assembly",
};

const ElectionCountdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = NEXT_ELECTION.date.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      passed: false,
    };
  }

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const blocks = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-foreground text-background p-8 md:p-10">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-background/5" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-background/5" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-5 w-5 opacity-60" />
          <span className="text-xs font-semibold uppercase tracking-widest opacity-60">
            Upcoming Election
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-display font-bold mb-1">{NEXT_ELECTION.name}</h3>
        <p className="text-sm opacity-60 mb-6">{NEXT_ELECTION.type} • {NEXT_ELECTION.date.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>

        {timeLeft.passed ? (
          <p className="text-lg font-semibold">Election phase is underway! 🗳️</p>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {blocks.map((b) => (
              <div key={b.label} className="text-center">
                <div className="bg-background/10 backdrop-blur-sm rounded-xl py-3 px-2 mb-1.5">
                  <span className="text-2xl md:text-3xl font-display font-bold tabular-nums">
                    {String(b.value).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[10px] md:text-xs uppercase tracking-wider opacity-60">{b.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 text-xs opacity-50">
          <Clock className="h-3.5 w-3.5" />
          <span>Live countdown • Dates subject to ECI announcement</span>
        </div>
      </div>
    </div>
  );
};

export default ElectionCountdown;
