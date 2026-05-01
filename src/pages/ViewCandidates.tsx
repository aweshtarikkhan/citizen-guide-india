import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Users,
  MapPin,
  Trophy,
  History,
  Building2,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import FeedbackSection from "@/components/FeedbackSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCandidates,
  hasCandidates,
  LAST_ELECTION,
  STATE_DISPLAY,
  ALLIANCE_TONE,
  type ConstituencyCandidates,
} from "@/data/assemblyCandidates";

const ViewCandidates = () => {
  const { stateSlug = "" } = useParams();
  const slug = stateSlug.toLowerCase();
  const stateName = STATE_DISPLAY[slug] || stateSlug;
  const all = getCandidates(slug);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [allianceFilter, setAllianceFilter] = useState<string>("all");
  const [selected, setSelected] = useState<ConstituencyCandidates | null>(null);

  const districts = useMemo(
    () =>
      Array.from(new Set(all.map((c) => c.district).filter(Boolean))) as string[],
    [all]
  );

  const alliances = useMemo(() => {
    const set = new Set<string>();
    all.forEach((c) => c.candidates.forEach((cd) => set.add(cd.alliance)));
    return Array.from(set);
  }, [all]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter((c) => {
      if (districtFilter !== "all" && c.district !== districtFilter) return false;
      if (
        allianceFilter !== "all" &&
        !c.candidates.some((x) => x.alliance === allianceFilter)
      )
        return false;
      if (!q) return true;
      if (c.constituency.toLowerCase().includes(q)) return true;
      if (c.district?.toLowerCase().includes(q)) return true;
      return c.candidates.some(
        (x) =>
          x.candidate?.toLowerCase().includes(q) ||
          x.party?.toLowerCase().includes(q)
      );
    });
  }, [all, search, districtFilter, allianceFilter]);

  const lastResult = LAST_ELECTION[slug];

  if (!hasCandidates(slug)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Candidates Coming Soon</h1>
          <p className="text-muted-foreground mb-8">
            Candidate list for {stateName} will be published once finalised by
            the parties.
          </p>
          <Link to={`/upcoming-election/${slug}`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
        </main>
        <FeedbackSection />
      <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <Link
          to={`/upcoming-election/${slug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {stateName} 2026
        </Link>

        <div className="mb-10">
          <Badge variant="outline" className="mb-3">
            <Users className="h-3 w-3 mr-1" /> Assembly Election 2026
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            {stateName} Candidates
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Browse all {all.length} constituency candidates contesting the{" "}
            {stateName} Assembly Election 2026, grouped by alliance.
          </p>
        </div>

        <Tabs defaultValue="candidates" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="candidates">
              <Users className="h-4 w-4 mr-2" /> Candidates 2026
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" /> Last Election
            </TabsTrigger>
          </TabsList>

          {/* CANDIDATES TAB */}
          <TabsContent value="candidates" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search constituency, party or candidate"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={districtFilter} onValueChange={setDistrictFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All districts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All districts</SelectItem>
                      {districts.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={allianceFilter} onValueChange={setAllianceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All alliances" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All alliances</SelectItem>
                      {alliances.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary">
                    Showing {filtered.length} of {all.length}
                  </Badge>
                  {alliances.map((a) => (
                    <span
                      key={a}
                      className={`px-2 py-0.5 rounded-full border text-xs ${ALLIANCE_TONE[a] || "bg-muted border-border"}`}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Constituency cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((c) => (
                <button
                  key={`${c.district}-${c.constituency}`}
                  onClick={() => setSelected(c)}
                  className="text-left group"
                >
                  <Card className="h-full hover:border-foreground/40 hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg leading-tight">
                            {c.constituency}
                          </CardTitle>
                          {c.district && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {c.district}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {c.candidates.map((cd, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between gap-2 p-2 rounded-md border text-sm ${ALLIANCE_TONE[cd.alliance] || "bg-muted/30 border-border"}`}
                        >
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {cd.candidate || "—"}
                            </div>
                            <div className="text-[10px] uppercase tracking-wide opacity-80">
                              {cd.alliance} · {cd.party || "—"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                No candidates match your filters.
              </div>
            )}
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history">
            {lastResult ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Year", value: lastResult.year },
                    { label: "Total Seats", value: lastResult.totalSeats },
                    { label: "Turnout", value: lastResult.turnout },
                    { label: "Winner", value: `${lastResult.winner} (${lastResult.winnerSeats})` },
                  ].map((s) => (
                    <Card key={s.label}>
                      <CardContent className="pt-6">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {s.label}
                        </p>
                        <p className="text-xl font-bold mt-1">{s.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" /> {lastResult.year} Results
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Government formed by{" "}
                      <span className="font-medium text-foreground">
                        {lastResult.cm}
                      </span>
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2 font-medium">Party</th>
                            <th className="text-left py-3 px-2 font-medium">Alliance</th>
                            <th className="text-right py-3 px-2 font-medium">Seats</th>
                            <th className="text-right py-3 px-2 font-medium">Vote %</th>
                            <th className="text-left py-3 px-2 font-medium hidden md:table-cell">Share</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lastResult.results.map((r) => {
                            const pct = (r.seats / lastResult.totalSeats) * 100;
                            return (
                              <tr key={r.party} className="border-b last:border-0">
                                <td className="py-3 px-2 font-medium">{r.party}</td>
                                <td className="py-3 px-2">
                                  <span className={`text-xs px-2 py-0.5 rounded-full border ${ALLIANCE_TONE[r.alliance] || "bg-muted border-border"}`}>
                                    {r.alliance}
                                  </span>
                                </td>
                                <td className="py-3 px-2 text-right font-mono">{r.seats}</td>
                                <td className="py-3 px-2 text-right font-mono">{r.voteShare}</td>
                                <td className="py-3 px-2 hidden md:table-cell">
                                  <div className="h-2 bg-muted rounded-full overflow-hidden w-32">
                                    <div
                                      className="h-full bg-foreground"
                                      style={{ width: `${Math.min(pct, 100)}%` }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-center py-16 text-muted-foreground">
                Last election data unavailable.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Selected constituency modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-2">
                <Building2 className="h-3 w-3 mr-1" />{" "}
                {selected.district || "Constituency"}
              </Badge>
              <CardTitle className="text-2xl">{selected.constituency}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Major alliance candidates contesting Assembly 2026
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {selected.candidates.map((cd, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border ${ALLIANCE_TONE[cd.alliance] || "bg-muted/30 border-border"}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {cd.alliance}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {cd.party || "—"}
                    </Badge>
                  </div>
                  <div className="text-lg font-semibold">
                    {cd.candidate || "Candidate not yet announced"}
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setSelected(null)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <FooterSection />
    </div>
  );
};

export default ViewCandidates;
