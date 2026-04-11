import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Landmark, Building2, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { stateDataMap } from "@/data/stateConstituencies";
import { assemblyData } from "@/data/assemblyConstituencies";
import StateConstituencyMap from "@/components/StateConstituencyMap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StatePage = () => {
  const { stateId } = useParams<{ stateId: string }>();
  const [search, setSearch] = useState("");
  const [assemblySearch, setAssemblySearch] = useState("");
  const state = stateId ? stateDataMap[stateId] : null;
  const assemblies = stateId ? (assemblyData[stateId] || []) : [];

  if (!state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-display font-bold text-foreground">State Not Found</h1>
          <Link to="/" className="text-primary underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const filtered = state.constituencies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mp.toLowerCase().includes(search.toLowerCase()) ||
    c.party.toLowerCase().includes(search.toLowerCase())
  );

  const partyCount: Record<string, number> = {};
  state.constituencies.forEach((c) => {
    partyCount[c.party] = (partyCount[c.party] || 0) + 1;
  });
  const sortedParties = Object.entries(partyCount).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        {/* Header */}
        <div className="container py-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to India Map
          </Link>

          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground tracking-tight">
                {state.name}
              </h1>

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-card border border-border rounded-xl p-4">
                  <MapPin className="h-5 w-5 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Capital</p>
                  <p className="font-semibold text-foreground text-sm">{state.capital}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <Landmark className="h-5 w-5 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Chief Minister</p>
                  <p className="font-semibold text-foreground text-sm">{state.cm}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <Building2 className="h-5 w-5 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Ruling Party</p>
                  <p className="font-semibold text-foreground text-sm">{state.rulingParty}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <Users className="h-5 w-5 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Lok Sabha Seats</p>
                  <p className="font-semibold text-foreground text-sm">{state.totalConstituencies}</p>
                </div>
              </div>
            </div>

            {/* State Map - zoomed into the specific state */}
            <div className="hidden md:block w-72">
              <StateMapHighlight activeStateId={stateId!} />
            </div>
          </div>


          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground">Area</p>
              <p className="font-semibold text-foreground">{state.area}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground">Population</p>
              <p className="font-semibold text-foreground">{state.population}</p>
            </div>
          </div>

          {/* Party breakdown */}
          <div className="mt-10">
            <h2 className="text-xl font-display font-bold text-foreground mb-4">Party-wise Seats</h2>
            <div className="flex flex-wrap gap-3">
              {sortedParties.map(([party, count]) => (
                <div key={party} className="bg-card border border-border rounded-full px-4 py-2 text-sm">
                  <span className="font-semibold text-foreground">{party}</span>
                  <span className="text-muted-foreground ml-2">({count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Constituencies table */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
              <h2 className="text-xl font-display font-bold text-foreground">
                All Constituencies ({state.totalConstituencies})
              </h2>
              <input
                type="text"
                placeholder="Search constituency, MP, or party..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 w-full md:w-72"
              />
            </div>

            <div className="border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">#</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Constituency</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">MP</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Party</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, i) => (
                      <tr key={c.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="text-sm text-muted-foreground px-4 py-3">{i + 1}</td>
                        <td className="text-sm font-medium text-foreground px-4 py-3">{c.name}</td>
                        <td className="text-sm text-foreground px-4 py-3">{c.mp}</td>
                        <td className="text-sm px-4 py-3">
                          <span className="bg-foreground/10 text-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                            {c.party}
                          </span>
                        </td>
                        <td className="text-sm text-muted-foreground px-4 py-3">{c.category || "GEN"}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted-foreground py-8 text-sm">
                          No constituencies found matching "{search}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Vidhan Sabha (Assembly) Constituencies */}
          {assemblies.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                <h2 className="text-xl font-display font-bold text-foreground">
                  Vidhan Sabha Constituencies ({assemblies.length})
                </h2>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search MLA, constituency, or party..."
                    value={assemblySearch}
                    onChange={(e) => setAssemblySearch(e.target.value)}
                    className="bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 w-full"
                  />
                </div>
              </div>

              {(() => {
                const filteredAssemblies = assemblies.filter((a) =>
                  a.name.toLowerCase().includes(assemblySearch.toLowerCase()) ||
                  a.mla.toLowerCase().includes(assemblySearch.toLowerCase()) ||
                  a.party.toLowerCase().includes(assemblySearch.toLowerCase())
                );

                const assemblyPartyCount: Record<string, number> = {};
                assemblies.forEach((a) => {
                  assemblyPartyCount[a.party] = (assemblyPartyCount[a.party] || 0) + 1;
                });
                const sortedAssemblyParties = Object.entries(assemblyPartyCount).sort((a, b) => b[1] - a[1]);

                return (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {sortedAssemblyParties.map(([party, count]) => (
                        <button
                          key={party}
                          onClick={() => setAssemblySearch(assemblySearch === party ? "" : party)}
                          className={`text-xs rounded-full px-3 py-1 border transition-colors ${
                            assemblySearch === party
                              ? "bg-foreground text-background border-foreground"
                              : "bg-card border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          {party} ({count})
                        </button>
                      ))}
                    </div>

                    <div className="border border-border rounded-xl overflow-hidden">
                      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="w-full">
                          <thead className="sticky top-0 z-10">
                            <tr className="bg-muted/50 border-b border-border">
                              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">#</th>
                              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Constituency</th>
                              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">MLA</th>
                              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Party</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAssemblies.map((a, i) => (
                              <tr key={a.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                <td className="text-sm text-muted-foreground px-4 py-3">{i + 1}</td>
                                <td className="text-sm font-medium text-foreground px-4 py-3">{a.name}</td>
                                <td className="text-sm text-foreground px-4 py-3">{a.mla}</td>
                                <td className="text-sm px-4 py-3">
                                  <span className="bg-foreground/10 text-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                                    {a.party}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {filteredAssemblies.length === 0 && (
                              <tr>
                                <td colSpan={4} className="text-center text-muted-foreground py-8 text-sm">
                                  No assembly constituencies found matching "{assemblySearch}"
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default StatePage;
