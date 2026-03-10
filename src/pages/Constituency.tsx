import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { stateDataMap, Constituency as ConstituencyType } from "@/data/stateConstituencies";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Users, Filter, ChevronDown, AlertTriangle, GraduationCap, IndianRupee, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import IndiaConstituencyMap from "@/components/IndiaConstituencyMap";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { mynetaApi, CandidateSummary } from "@/lib/api/myneta";

// Party color mapping
const partyColors: Record<string, string> = {
  "BJP": "bg-orange-500 text-white",
  "INC": "bg-blue-500 text-white",
  "Congress": "bg-blue-500 text-white",
  "AAP": "bg-cyan-500 text-white",
  "TMC": "bg-green-600 text-white",
  "YSRCP": "bg-blue-700 text-white",
  "TDP": "bg-yellow-500 text-black",
  "JD(U)": "bg-green-500 text-white",
  "DMK": "bg-red-600 text-white",
  "AIADMK": "bg-green-700 text-white",
  "SP": "bg-red-500 text-white",
  "BSP": "bg-blue-600 text-white",
  "NCP": "bg-blue-400 text-white",
  "Shiv Sena": "bg-orange-600 text-white",
  "SS (UBT)": "bg-orange-400 text-white",
  "JMM": "bg-green-600 text-white",
  "BJD": "bg-green-500 text-white",
  "RJD": "bg-green-600 text-white",
  "NC": "bg-red-700 text-white",
  "PDP": "bg-green-700 text-white",
  "AIUDF": "bg-green-500 text-white",
  "LJP(RV)": "bg-blue-500 text-white",
  "HAM(S)": "bg-yellow-600 text-black",
  "AGP": "bg-green-400 text-black",
  "UPPL": "bg-purple-500 text-white",
  "AIP": "bg-gray-600 text-white",
  "IUML": "bg-green-600 text-white",
  "KC(M)": "bg-yellow-400 text-black",
  "RSP": "bg-red-600 text-white",
  "VCK": "bg-blue-800 text-white",
  "CPI(M)": "bg-red-700 text-white",
  "CPI": "bg-red-600 text-white",
  "SAD": "bg-blue-600 text-white",
  "JKNC": "bg-red-600 text-white",
  "NPP": "bg-yellow-500 text-black",
  "NPF": "bg-blue-500 text-white",
  "MNF": "bg-blue-600 text-white",
  "SKM": "bg-red-500 text-white",
  "NDPP": "bg-blue-500 text-white",
  "ZPM": "bg-green-500 text-white",
  "UDP": "bg-purple-600 text-white",
  "IND": "bg-gray-500 text-white",
};

const getPartyColor = (party: string) => {
  return partyColors[party] || "bg-muted text-foreground";
};

// Flatten all constituencies with state info
interface FlatConstituency extends ConstituencyType {
  stateId: string;
  stateName: string;
}

const ConstituencyPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedParty, setSelectedParty] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [mynetaData, setMynetaData] = useState<Record<string, CandidateSummary>>({});
  const [mynetaLoading, setMynetaLoading] = useState(false);

  // Load MyNeta data
  useEffect(() => {
    setMynetaLoading(true);
    mynetaApi.getWinners().then((res) => {
      if (res.success && res.data) {
        const dataMap: Record<string, CandidateSummary> = {};
        res.data.forEach((c) => {
          // Map by constituency name (uppercase for matching)
          dataMap[c.constituency.toUpperCase()] = c;
        });
        setMynetaData(dataMap);
      }
      setMynetaLoading(false);
    }).catch(() => setMynetaLoading(false));
  }, []);

  // Get all constituencies with state info
  const allConstituencies: FlatConstituency[] = useMemo(() => {
    const result: FlatConstituency[] = [];
    Object.values(stateDataMap).forEach((state) => {
      state.constituencies.forEach((c) => {
        result.push({
          ...c,
          stateId: state.id,
          stateName: state.name,
        });
      });
    });
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Get unique parties
  const uniqueParties = useMemo(() => {
    const parties = new Set<string>();
    allConstituencies.forEach((c) => parties.add(c.party));
    return Array.from(parties).sort();
  }, [allConstituencies]);

  // Get unique categories
  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    allConstituencies.forEach((c) => { if (c.category) cats.add(c.category); });
    return Array.from(cats).sort();
  }, [allConstituencies]);

  // Filter constituencies
  const filteredConstituencies = useMemo(() => {
    return allConstituencies.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mp.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.stateName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = selectedState === "all" || c.stateId === selectedState;
      const matchesParty = selectedParty === "all" || c.party === selectedParty;
      const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
      return matchesSearch && matchesState && matchesParty && matchesCategory;
    });
  }, [allConstituencies, searchQuery, selectedState, selectedParty, selectedCategory]);

  // Party-wise count for badges
  const partyWiseCount = useMemo(() => {
    const counts: Record<string, number> = {};
    allConstituencies.forEach((c) => {
      counts[c.party] = (counts[c.party] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]);
  }, [allConstituencies]);

  // Full party-wise data for pie chart
  const pieChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    allConstituencies.forEach((c) => {
      counts[c.party] = (counts[c.party] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [allConstituencies]);

  // Build constituency map data for the interactive map
  const constituencyMapData = useMemo(() => {
    const map: Record<string, { party: string; mp: string; candidateId?: string }> = {};
    allConstituencies.forEach((c) => {
      const mynetaInfo = mynetaData[c.name.toUpperCase()];
      map[c.name.toUpperCase()] = {
        party: c.party,
        mp: c.mp,
        candidateId: mynetaInfo?.candidate_id,
      };
    });
    return map;
  }, [allConstituencies, mynetaData]);

  const PARTY_CHART_COLORS: Record<string, string> = {
    "BJP": "#f97316",
    "INC": "#3b82f6",
    "SP": "#ef4444",
    "TMC": "#16a34a",
    "DMK": "#dc2626",
    "TDP": "#eab308",
    "JD(U)": "#22c55e",
    "SS (UBT)": "#fb923c",
    "Shiv Sena": "#ea580c",
    "NCP": "#60a5fa",
    "YSRCP": "#1d4ed8",
    "AAP": "#06b6d4",
    "BJD": "#4ade80",
    "RJD": "#15803d",
    "CPI(M)": "#b91c1c",
    "JKNC": "#dc2626",
    "IND": "#6b7280",
  };

  const getChartColor = (party: string, index: number) => {
    if (PARTY_CHART_COLORS[party]) return PARTY_CHART_COLORS[party];
    const fallbackColors = ["#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#84cc16", "#6366f1"];
    return fallbackColors[index % fallbackColors.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-background/20 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-background/10 blur-3xl" />
        </div>
        <div className="container relative z-10 max-w-5xl">
          <span className="inline-block text-sm font-semibold text-background/60 uppercase tracking-[0.2em] mb-4">
            Lok Sabha 2024
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-background leading-tight">
            All 543 Constituencies
          </h1>
          <p className="mt-4 text-background/60 text-lg max-w-2xl">
            Explore every Lok Sabha constituency across India — see the 2024 election winners, their parties, and constituency categories.
          </p>

          {/* Quick Stats */}
          {/* Quick Stats - top 8 only */}
          <div className="mt-8 flex flex-wrap gap-3">
            {partyWiseCount.slice(0, 8).map(([party, count]) => (
              <Badge
                key={party}
                className={`${getPartyColor(party)} px-3 py-1.5 text-sm font-medium`}
              >
                {party}: {count}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Party-wise Pie Chart */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-2">
            2024 Lok Sabha Results
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Party-wise seat distribution across all 543 constituencies
          </p>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Pie Chart */}
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={140}
                    paddingAngle={1}
                    dataKey="value"
                    label={({ name, value, percent }) => 
                      percent > 0.03 ? `${name}: ${value}` : ""
                    }
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getChartColor(entry.name, index)}
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value} seats`, name]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Party List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {pieChartData.map((party, index) => (
                <div 
                  key={party.name}
                  className={`flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:shadow-sm transition-all cursor-pointer ${selectedParty === party.name ? 'ring-2 ring-primary shadow-md' : ''}`}
                  onClick={() => setSelectedParty(selectedParty === party.name ? "all" : party.name)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: getChartColor(party.name, index) }}
                    />
                    <span className="font-medium text-foreground">{party.name}</span>
                  </div>
                  <Badge variant="secondary" className="font-bold">
                    {party.value} seats
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* India Constituency Map */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-2">
            Constituency Map of India
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Hover to see MP details, click to view full candidate profile. Zoom in to explore.
          </p>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <IndiaConstituencyMap
                data={constituencyMapData}
                onConstituencyClick={(name) => {
                  setSearchQuery(name);
                }}
              />
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="text-3xl font-bold text-foreground">543</div>
                <div className="text-sm text-muted-foreground">Total Constituencies</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="text-3xl font-bold text-foreground">28+8</div>
                <div className="text-sm text-muted-foreground">States & UTs</div>
              </div>
              {/* Map Legend */}
              <div className="p-4 rounded-lg bg-card border border-border">
                <p className="text-sm font-medium text-foreground mb-3">Party Colors</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { party: "BJP", color: "#f97316" },
                    { party: "INC", color: "#3b82f6" },
                    { party: "SP", color: "#ef4444" },
                    { party: "TMC", color: "#16a34a" },
                    { party: "DMK", color: "#dc2626" },
                    { party: "TDP", color: "#eab308" },
                    { party: "JD(U)", color: "#22c55e" },
                    { party: "AAP", color: "#06b6d4" },
                  ].map(({ party, color }) => (
                    <div key={party} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-muted-foreground">{party}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-sm shrink-0 bg-muted" />
                    <span className="text-muted-foreground">Others</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-background border-b border-border sticky top-16 z-40">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search constituency, MP name, or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors md:hidden"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
            <div className={`flex flex-col md:flex-row gap-3 ${showFilters ? "block" : "hidden md:flex"}`}>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All States</option>
                {Object.values(stateDataMap)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.totalConstituencies})
                    </option>
                  ))}
              </select>
              <select
                value={selectedParty}
                onChange={(e) => setSelectedParty(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm min-w-[180px]"
              >
                <option value="all">All Parties ({allConstituencies.length})</option>
                {partyWiseCount.map(([p, count]) => (
                  <option key={p} value={p}>
                    {p} ({count} seats)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 text-sm text-muted-foreground">
            Showing {filteredConstituencies.length} of {allConstituencies.length} constituencies
          </div>
        </div>
      </section>

      {/* MyNeta Data Loading Indicator */}
      {mynetaLoading && (
        <div className="bg-primary/10 border-b border-border py-3">
          <div className="container max-w-5xl flex items-center gap-2 text-sm text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading candidate data...
          </div>
        </div>
      )}

      {/* Constituencies Grid */}
      <section className="py-12 bg-background">
        <div className="container max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConstituencies.map((c, i) => {
              const mynetaInfo = mynetaData[c.name.toUpperCase()];
              return (
                <Card
                  key={`${c.stateId}-${c.name}-${i}`}
                  className="group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold leading-tight">
                        {c.name}
                      </CardTitle>
                      {c.category && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          {c.category}
                        </Badge>
                      )}
                    </div>
                    <Link
                      to={`/state/${c.stateId}`}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      <MapPin className="h-3 w-3" />
                      {c.stateName}
                    </Link>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {c.mp}
                        </p>
                        <Badge className={`${getPartyColor(c.party)} text-xs mt-1`}>
                          {c.party}
                        </Badge>
                      </div>
                    </div>

                    {/* MyNeta Quick Stats */}
                    {mynetaInfo && (
                      <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <AlertTriangle className="h-3 w-3" /> Cases
                          </span>
                          <span className={`font-bold ${mynetaInfo.criminal_cases > 0 ? 'text-destructive' : 'text-green-600'}`}>
                            {mynetaInfo.criminal_cases}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <GraduationCap className="h-3 w-3" /> Education
                          </span>
                          <span className="font-medium text-foreground truncate ml-2">{mynetaInfo.education || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <IndianRupee className="h-3 w-3" /> Assets
                          </span>
                          <span className="font-medium text-foreground truncate ml-2">
                            {mynetaInfo.total_assets?.replace(/!\[.*?\]\(.*?\)/g, 'N/A').substring(0, 30) || 'N/A'}
                          </span>
                        </div>
                        <Link
                          to={`/candidate?id=${mynetaInfo.candidate_id}`}
                          className="block mt-2"
                        >
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            View Full Profile →
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredConstituencies.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No constituencies found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default ConstituencyPage;
