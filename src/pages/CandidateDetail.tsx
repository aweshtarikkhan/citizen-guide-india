import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Scale, GraduationCap, IndianRupee, AlertTriangle,
  User, Briefcase, FileText, ExternalLink, Shield, BookOpen
} from "lucide-react";
import { mynetaApi, CandidateDetail as CandidateDetailType } from "@/lib/api/myneta";

const CandidateDetailPage = () => {
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get("id");
  const [candidate, setCandidate] = useState<CandidateDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!candidateId) return;
    setLoading(true);
    setError(null);
    mynetaApi.getCandidateDetail(candidateId).then((res) => {
      if (res.success && res.data) {
        setCandidate(res.data);
      } else {
        setError(res.error || "Failed to load candidate data");
      }
      setLoading(false);
    });
  }, [candidateId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-8 bg-foreground">
        <div className="container max-w-5xl">
          <Link to="/constituency" className="inline-flex items-center gap-2 text-background/60 hover:text-background transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Constituencies
          </Link>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-96 bg-background/10" />
              <Skeleton className="h-6 w-64 bg-background/10" />
            </div>
          ) : candidate ? (
            <>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-background">
                {candidate.candidate_name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <Badge className="bg-background/20 text-background border-background/30">
                  {candidate.constituency}
                </Badge>
                <Badge className="bg-primary text-primary-foreground">
                  {candidate.party}
                </Badge>
                {candidate.age && (
                  <span className="text-background/60 text-sm">Age: {candidate.age}</span>
                )}
              </div>
              {candidate.myneta_url && (
                <a href={candidate.myneta_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-background/50 hover:text-background mt-2 transition-colors">
                  <ExternalLink className="h-3 w-3" /> View on MyNeta.info
                </a>
              )}
            </>
          ) : (
            <h1 className="text-3xl font-bold text-background">Candidate Not Found</h1>
          )}
        </div>
      </section>

      <section className="py-8">
        <div className="container max-w-5xl">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Card key={i}><CardContent className="p-6"><Skeleton className="h-32" /></CardContent></Card>
              ))}
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
                <p className="text-destructive font-medium">{error}</p>
                <p className="text-muted-foreground text-sm mt-2">Scraping may take a moment. Please try again.</p>
                <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : candidate ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard
                  icon={<AlertTriangle className="h-5 w-5" />}
                  label="Criminal Cases"
                  value={String(candidate.criminal_cases || 0)}
                  color={candidate.criminal_cases > 0 ? "text-destructive" : "text-green-600"}
                />
                <SummaryCard
                  icon={<GraduationCap className="h-5 w-5" />}
                  label="Education"
                  value={candidate.education || "N/A"}
                  color="text-primary"
                />
                <SummaryCard
                  icon={<IndianRupee className="h-5 w-5" />}
                  label="Total Assets"
                  value={candidate.total_assets || "N/A"}
                  color="text-foreground"
                />
                <SummaryCard
                  icon={<Scale className="h-5 w-5" />}
                  label="Liabilities"
                  value={candidate.liabilities || "N/A"}
                  color="text-foreground"
                />
              </div>

              {/* Profession */}
              {(candidate.self_profession || candidate.spouse_profession) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Briefcase className="h-5 w-5 text-primary" /> Profession
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {candidate.self_profession && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Self</span>
                        <span className="font-medium text-foreground">{candidate.self_profession}</span>
                      </div>
                    )}
                    {candidate.spouse_profession && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Spouse</span>
                        <span className="font-medium text-foreground">{candidate.spouse_profession}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Criminal Details */}
              {candidate.criminal_details && (
                <Card className={candidate.criminal_cases > 0 ? "border-destructive/30" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-destructive" /> Criminal Record Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {candidate.criminal_details.charges?.length > 0 ? (
                      <ul className="space-y-2">
                        {candidate.criminal_details.charges.map((charge: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-destructive mt-1">•</span>
                            <span className="text-foreground">{charge}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-green-600 font-medium">No criminal cases declared</p>
                    )}
                    {candidate.criminal_details.hasConvictions && (
                      <Badge variant="destructive" className="mt-3">Has Convictions</Badge>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* PAN & Income Tax */}
              {candidate.income_details && candidate.income_details.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-primary" /> PAN & Income Tax Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {candidate.income_details.map((entry: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs capitalize">{entry.relation}</Badge>
                            <Badge variant={entry.panGiven === 'Y' ? 'default' : 'destructive'} className="text-xs">
                              PAN: {entry.panGiven === 'Y' ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{entry.details}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Source of Income */}
              {candidate.source_of_income && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-primary" /> Sources of Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(candidate.source_of_income).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">{key}</span>
                        <span className="font-medium text-foreground">{String(val)}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Data Source */}
              <p className="text-xs text-muted-foreground text-center">
                Data sourced from MyNeta.info (ADR). Self-declared affidavit information filed during elections.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

const SummaryCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
  <Card>
    <CardContent className="p-4 text-center">
      <div className={`mx-auto mb-2 ${color}`}>{icon}</div>
      <p className={`text-sm font-bold ${color} break-words`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </CardContent>
  </Card>
);

export default CandidateDetailPage;
