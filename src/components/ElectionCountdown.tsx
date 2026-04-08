import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Upcoming 2026 State Assembly Elections
const UPCOMING_ELECTIONS = [
  {
    name: "Assam Assembly Election 2026",
    date: new Date("2026-04-09T00:00:00+05:30"),
    type: "State Assembly",
    state: "Assam",
    slug: "assam",
  },
  {
    name: "Kerala Assembly Election 2026",
    date: new Date("2026-04-09T00:00:00+05:30"),
    type: "State Assembly",
    state: "Kerala",
    slug: "kerala",
  },
  {
    name: "Puducherry Assembly Election 2026",
    date: new Date("2026-04-09T00:00:00+05:30"),
    type: "UT Assembly",
    state: "Puducherry",
    slug: "puducherry",
  },
  {
    name: "Tamil Nadu Assembly Election 2026",
    date: new Date("2026-04-23T00:00:00+05:30"),
    type: "State Assembly",
    state: "Tamil Nadu",
    slug: "tamil-nadu",
  },
  {
    name: "West Bengal Assembly Election 2026",
    date: new Date("2026-04-23T00:00:00+05:30"),
    type: "State Assembly (Phase 1: 23 Apr, Phase 2: 29 Apr)",
    state: "West Bengal",
    slug: "west-bengal",
  },
];

const ElectionCountdown = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(UPCOMING_ELECTIONS[0].date));

  function getTimeLeft(targetDate: Date) {
    const diff = targetDate.getTime() - Date.now();
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
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(UPCOMING_ELECTIONS[currentIndex].date));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const currentElection = UPCOMING_ELECTIONS[currentIndex];

  const nextElection = () => {
    setCurrentIndex((prev) => (prev + 1) % UPCOMING_ELECTIONS.length);
  };

  const prevElection = () => {
    setCurrentIndex((prev) => (prev - 1 + UPCOMING_ELECTIONS.length) % UPCOMING_ELECTIONS.length);
  };

  const blocks = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div 
      className="relative overflow-hidden rounded-2xl bg-foreground text-background p-8 md:p-10 cursor-pointer hover:opacity-95 transition-opacity"
      onClick={() => navigate(`/upcoming-election/${currentElection.slug}`)}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-background/5" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-background/5" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 opacity-60" />
            <span className="text-xs font-semibold uppercase tracking-widest opacity-60">
              Upcoming Elections
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); prevElection(); }}
              className="p-1.5 rounded-lg bg-background/10 hover:bg-background/20 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs px-2 opacity-60">{currentIndex + 1}/{UPCOMING_ELECTIONS.length}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); nextElection(); }}
              className="p-1.5 rounded-lg bg-background/10 hover:bg-background/20 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-display font-bold mb-1">{currentElection.name}</h3>
        <p className="text-sm opacity-60 mb-6">
          {currentElection.type} • {currentElection.date.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>

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
