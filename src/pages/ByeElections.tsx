import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ByeSeat {
  state: string;
  ac: string;
  reason: string;
  group: "A" | "B";
}

const SEATS: ByeSeat[] = [
  { state: "Goa", ac: "21-Ponda", reason: "Death of Sh. Ravi Naik", group: "A" },
  { state: "Gujarat", ac: "111-Umreth", reason: "Death of Sh. Govindbhai Raijibhai Parmar", group: "B" },
  { state: "Karnataka", ac: "24-Bagalkot", reason: "Death of Sh. Meti Hullappa Yamanappa (H. Y. Meti)", group: "A" },
  { state: "Karnataka", ac: "107-Davanagere South", reason: "Death of Sh. Shamanur Shivashankarappa", group: "A" },
  { state: "Maharashtra", ac: "223-Rahuri", reason: "Death of Sh. Shivaji Bhanudas Kardile", group: "B" },
  { state: "Maharashtra", ac: "201-Baramati", reason: "Death of Sh. Ajit Anatarao Pawar", group: "B" },
  { state: "Nagaland", ac: "28-Koridang (ST)", reason: "Death of Sh. Imkong L. Imchen", group: "A" },
  { state: "Tripura", ac: "56-Dharmanagar", reason: "Death of Sh. Biswa Bandhu Sen", group: "A" },
];

const GROUP_A = {
  title: "समूह A: Goa, Karnataka, Nagaland, Tripura",
  rows: [
    ["गजट अधिसूचना जारी", "16 मार्च 2026 (सोमवार)"],
    ["नामांकन की अंतिम तिथि", "23 मार्च 2026 (सोमवार)"],
    ["नामांकन की जांच", "24 मार्च 2026 (मंगलवार)"],
    ["नाम वापसी की अंतिम तिथि", "26 मार्च 2026 (गुरुवार)"],
    ["मतदान तिथि", "9 अप्रैल 2026 (गुरुवार)"],
    ["मतगणना", "4 मई 2026 (सोमवार)"],
    ["चुनाव पूर्ण होने की तिथि", "6 मई 2026 (बुधवार)"],
  ],
};

const GROUP_B = {
  title: "समूह B: Gujarat, Maharashtra",
  rows: [
    ["गजट अधिसूचना जारी", "30 मार्च 2026 (सोमवार)"],
    ["नामांकन की अंतिम तिथि", "6 अप्रैल 2026 (सोमवार)"],
    ["नामांकन की जांच", "7 अप्रैल 2026 (मंगलवार)"],
    ["नाम वापसी की अंतिम तिथि", "9 अप्रैल 2026 (गुरुवार)"],
    ["मतदान तिथि", "23 अप्रैल 2026 (गुरुवार)"],
    ["मतगणना", "4 मई 2026 (सोमवार)"],
    ["चुनाव पूर्ण होने की तिथि", "6 मई 2026 (बुधवार)"],
  ],
};

const ByeElections = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> होम पेज पर वापस
        </Link>

        <div className="mb-8">
          <Badge variant="outline" className="mb-3">
            <Calendar className="h-3 w-3 mr-1" /> अप्रैल 2026
          </Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            उपचुनाव 2026 — 8 विधानसभा सीटें
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            भारत निर्वाचन आयोग (ECI) ने Goa, Gujarat, Karnataka, Maharashtra, Nagaland और Tripura की
            8 विधानसभा सीटों पर उपचुनाव की घोषणा की है। सभी सीटें मौजूदा विधायकों के निधन के कारण रिक्त हुई हैं।
          </p>
        </div>

        {/* Vacant Seats */}
        <div className="mb-10">
          <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> रिक्त सीटें और रिक्ति का कारण
          </h2>
          <Card className="border-border">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">क्र.</TableHead>
                    <TableHead>राज्य/UT</TableHead>
                    <TableHead>विधानसभा क्षेत्र (AC)</TableHead>
                    <TableHead>रिक्ति का कारण</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SEATS.map((s, i) => (
                    <TableRow key={s.ac}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell className="font-semibold">{s.state}</TableCell>
                      <TableCell>{s.ac}</TableCell>
                      <TableCell className="text-muted-foreground">{s.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Schedule */}
        <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" /> ECI आधिकारिक चुनाव कार्यक्रम
        </h2>
        <div className="grid gap-4 md:grid-cols-2 mb-10">
          {[GROUP_A, GROUP_B].map((g) => (
            <Card key={g.title} className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{g.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <dl className="text-sm divide-y divide-border">
                  {g.rows.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-2">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium text-foreground text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/50 rounded-xl p-6 text-center text-sm text-muted-foreground">
          <p>
            ⚠️ स्रोत: भारत निर्वाचन आयोग (ECI) आधिकारिक अधिसूचना। नवीनतम जानकारी के लिए{" "}
            <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              eci.gov.in
            </a>{" "}
            देखें।
          </p>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default ByeElections;
