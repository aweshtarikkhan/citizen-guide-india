import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { stateDataMap } from "@/data/stateConstituencies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { mynetaApi, CandidateSummary, CandidateDetail } from "@/lib/api/myneta";
import {
  MapPin, Users, ArrowLeft, AlertTriangle, GraduationCap,
  IndianRupee, Building2, Vote, UserCheck, TrendingUp, Scale
} from "lucide-react";

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
  "SP": "bg-red-500 text-white",
  "BSP": "bg-blue-600 text-white",
  "NCP": "bg-blue-400 text-white",
  "CPI(M)": "bg-red-700 text-white",
  "CPI": "bg-red-600 text-white",
  "Shiv Sena": "bg-orange-600 text-white",
  "IND": "bg-gray-500 text-white",
};

// Estimated voter data for constituencies (2024 Lok Sabha)
const constituencyVoterData: Record<string, { totalVoters: number; votesPolled: number; winningMargin: number }> = {};

const getPartyColor = (party: string) => partyColors[party] || "bg-muted text-foreground";

const ConstituencyDetailPage = () => {
  const { stateId, name } = useParams<{ stateId: string; name: string }>();
  const [mynetaSummary, setMynetaSummary] = useState<CandidateSummary | null>(null);
  const [mynetaDetail, setMynetaDetail] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const decodedName = decodeURIComponent(name || "");

  const stateData = stateId ? stateDataMap[stateId] : null;
  const constituency = stateData?.constituencies.find(
    (c) => c.name.toLowerCase() === decodedName.toLowerCase()
  );

  // Find neighboring constituencies
  const neighbors = useMemo(() => {
    if (!stateData) return [];
    return stateData.constituencies
      .filter((c) => c.name.toLowerCase() !== decodedName.toLowerCase())
      .slice(0, 6);
  }, [stateData, decodedName]);

  useEffect(() => {
    const fetchMynetaData = async () => {
      if (!constituency) return;
      setLoading(true);
      try {
        const summary = await mynetaApi.getByConstituency(constituency.name);
        if (summary) {
          setMynetaSummary(summary);
          const detail = await mynetaApi.getCandidateDetail(summary.candidate_id);
          if (detail.success && detail.data) {
            setMynetaDetail(detail.data);
          }
        }
      } catch (e) {
        console.error("Error fetching myneta data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMynetaData();
  }, [constituency?.name]);

  if (!stateData || !constituency) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Constituency Not Found</h1>
          <p className="text-muted-foreground mb-6">The constituency you're looking for doesn't exist.</p>
          <Link to="/constituency">
            <Button><ArrowLeft className="h-4 w-4 mr-2" /> Back to All Constituencies</Button>
          </Link>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="container max-w-4xl py-8 md:py-12">
          <Link
            to="/constituency"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> All Constituencies
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {constituency.name}
                </h1>
                {constituency.category && (
                  <Badge variant="outline" className="text-sm">{constituency.category}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <Link to={`/state/${stateId}`} className="hover:text-foreground transition-colors">
                  {stateData.name}
                </Link>
              </div>
            </div>
            <Badge className={`${getPartyColor(constituency.party)} text-lg px-4 py-2`}>
              {constituency.party}
            </Badge>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl py-8 space-y-6">
        {/* Current MP Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Current Member of Parliament
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{constituency.mp}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${getPartyColor(constituency.party)}`}>{constituency.party}</Badge>
                  <span className="text-sm text-muted-foreground">• Lok Sabha 2024</span>
                </div>
                {mynetaDetail && (
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {mynetaDetail.age && (
                      <span>Age: <strong className="text-foreground">{mynetaDetail.age}</strong></span>
                    )}
                    {mynetaDetail.self_profession && (
                      <span>Profession: <strong className="text-foreground">{mynetaDetail.self_profession}</strong></span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Vote className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-lg font-bold text-foreground">{constituency.category || "GEN"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Building2 className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">State</p>
              <p className="text-lg font-bold text-foreground truncate">{stateData.name}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Ruling Party (State)</p>
              <p className="text-lg font-bold text-foreground truncate">{stateData.rulingParty}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Scale className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Total Seats (State)</p>
              <p className="text-lg font-bold text-foreground">{stateData.totalConstituencies}</p>
            </CardContent>
          </Card>
        </div>

        {/* MyNeta Financial & Criminal Data */}
        {loading ? (
          <Card>
            <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ) : (mynetaSummary || mynetaDetail) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                MP Financial & Criminal Profile (MyNeta)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Criminal Cases */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" /> Criminal Record
                  </h3>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-foreground">
                      {mynetaSummary?.criminal_cases ?? 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Criminal Cases</p>
                    {(mynetaSummary?.criminal_cases ?? 0) === 0 && (
                      <Badge className="mt-2 bg-green-100 text-green-800">Clean Record ✓</Badge>
                    )}
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" /> Education
                  </h3>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold text-foreground">
                      {mynetaSummary?.education || "Not Available"}
                    </p>
                  </div>
                </div>

                {/* Total Assets */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-green-600" /> Total Assets
                  </h3>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold text-foreground break-words">
                      {mynetaSummary?.total_assets?.replace(/!\[.*?\]\((.*?)\)/g, '').trim() || "Not Available"}
                    </p>
                  </div>
                </div>

                {/* Liabilities */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Scale className="h-4 w-4 text-orange-600" /> Liabilities
                  </h3>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold text-foreground break-words">
                      {mynetaSummary?.liabilities?.replace(/!\[.*?\]\((.*?)\)/g, '').trim() || "Not Available"}
                    </p>
                  </div>
                </div>
              </div>

              {mynetaSummary?.candidate_id && (
                <div className="mt-6">
                  <Link to={`/candidate?id=${mynetaSummary.candidate_id}`}>
                    <Button className="w-full sm:w-auto">
                      View Full Candidate Profile on MyNeta →
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* State Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              State Information — {stateData.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Capital</p>
                <p className="font-semibold text-foreground">{stateData.capital}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Chief Minister</p>
                <p className="font-semibold text-foreground">{stateData.cm}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Governor</p>
                <p className="font-semibold text-foreground">{stateData.governor}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Area</p>
                <p className="font-semibold text-foreground">{stateData.area}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Population</p>
                <p className="font-semibold text-foreground">{stateData.population}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Lok Sabha Seats</p>
                <p className="font-semibold text-foreground">{stateData.totalConstituencies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Other Constituencies in Same State */}
        {neighbors.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Other Constituencies in {stateData.name}
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {neighbors.map((c) => (
                <Link
                  key={c.name}
                  to={`/constituency/${stateId}/${encodeURIComponent(c.name)}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-all hover:-translate-y-0.5">
                    <CardContent className="p-4">
                      <p className="font-semibold text-foreground text-sm">{c.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground truncate">{c.mp}</p>
                        <Badge className={`${getPartyColor(c.party)} text-xs`}>{c.party}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <FooterSection />
    </div>
  );
};

export default ConstituencyDetailPage;
