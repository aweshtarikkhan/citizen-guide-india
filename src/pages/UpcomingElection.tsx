import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { ArrowLeft, Users, FileText, Target, Calendar, MapPin, Vote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PartyInfo {
  name: string;
  symbol: string;
  alliance?: string;
  keyLeaders: string[];
  manifesto: string[];
  schemes: string[];
}

interface SchedulePhase {
  label: string;
  gazette: string;
  lastNomination: string;
  scrutiny: string;
  withdrawal: string;
  poll: string;
  counting: string;
  completion: string;
}

interface ElectionData {
  stateName: string;
  dateInfo: string;
  totalSeats: number;
  totalVoters: string;
  currentRuling: string;
  overview: string;
  parties: PartyInfo[];
  keyIssues: string[];
  schedule?: SchedulePhase[];
}

const PHASE_1_EARLY: SchedulePhase = {
  label: "एकल चरण (All ACs)",
  gazette: "16 मार्च 2026 (सोमवार)",
  lastNomination: "23 मार्च 2026 (सोमवार)",
  scrutiny: "24 मार्च 2026 (मंगलवार)",
  withdrawal: "26 मार्च 2026 (गुरुवार)",
  poll: "9 अप्रैल 2026 (गुरुवार)",
  counting: "4 मई 2026 (सोमवार)",
  completion: "6 मई 2026 (बुधवार)",
};

const PHASE_LATE: SchedulePhase = {
  label: "एकल चरण (All ACs)",
  gazette: "30 मार्च 2026 (सोमवार)",
  lastNomination: "6 अप्रैल 2026 (सोमवार)",
  scrutiny: "7 अप्रैल 2026 (मंगलवार)",
  withdrawal: "9 अप्रैल 2026 (गुरुवार)",
  poll: "23 अप्रैल 2026 (गुरुवार)",
  counting: "4 मई 2026 (सोमवार)",
  completion: "6 मई 2026 (बुधवार)",
};

const electionData: Record<string, ElectionData> = {
  assam: {
    stateName: "Assam",
    dateInfo: "9 अप्रैल 2026",
    totalSeats: 126,
    totalVoters: "~2.4 करोड़",
    currentRuling: "BJP (हिमन्त बिस्वा शर्मा)",
    overview: "असम विधानसभा चुनाव 2026 में 126 सीटों पर मतदान होगा। वर्तमान में BJP सरकार है जिसका नेतृत्व मुख्यमंत्री हिमन्त बिस्वा शर्मा कर रहे हैं। यह चुनाव NDA और विपक्षी गठबंधन के बीच कड़ी टक्कर का होने की उम्मीद है।",
    parties: [
      {
        name: "भारतीय जनता पार्टी (BJP)",
        symbol: "🪷",
        alliance: "NDA",
        keyLeaders: ["हिमन्त बिस्वा शर्मा", "सर्बानन्द सोनोवाल"],
        manifesto: [
          "असम को भारत का विकास इंजन बनाना",
          "बाढ़ नियंत्रण और जल प्रबंधन में बड़ा निवेश",
          "चाय बागान श्रमिकों के लिए ₹5000 मासिक वेतन गारंटी",
          "अवैध घुसपैठ रोकने के लिए कड़े कदम",
          "NRC अपडेट और नागरिकता सुनिश्चित करना",
        ],
        schemes: [
          "ओरुनोदोई योजना – महिलाओं को ₹1250/माह",
          "अरुंधति गोल्ड स्कीम – शादी में सोना",
          "असम दर्शन – पर्यटन विकास",
          "मिशन बसुंधरा – भूमि अधिकार",
        ],
      },
      {
        name: "भारतीय राष्ट्रीय कांग्रेस (INC)",
        symbol: "✋",
        alliance: "INDIA Alliance",
        keyLeaders: ["भूपेन बोरा", "गौरव गोगोई"],
        manifesto: [
          "चाय बागान श्रमिकों को ₹600 दैनिक मजदूरी",
          "CAA और NRC का विरोध",
          "बेरोजगारी भत्ता ₹5000/माह",
          "महिला सशक्तिकरण और शिक्षा में निवेश",
          "किसानों के लिए MSP गारंटी",
        ],
        schemes: [
          "5 गारंटी – रोजगार, शिक्षा, स्वास्थ्य, महिला, किसान",
          "युवा रोजगार मिशन",
          "फ्री बिजली 200 यूनिट",
        ],
      },
      {
        name: "असम गण परिषद (AGP)",
        symbol: "🐘",
        alliance: "NDA",
        keyLeaders: ["अतुल बोरा", "फणीभूषण चौधरी"],
        manifesto: [
          "असमीया जाति-मात अस्मिता की रक्षा",
          "क्लॉज 6 लागू करने की मांग",
          "स्थानीय लोगों को रोजगार में प्राथमिकता",
        ],
        schemes: [
          "स्थानीय उद्योग विकास योजना",
          "असमीया भाषा संरक्षण कोष",
        ],
      },
      {
        name: "ऑल इंडिया यूनाइटेड डेमोक्रेटिक फ्रंट (AIUDF)",
        symbol: "🔒",
        alliance: "INDIA Alliance",
        keyLeaders: ["बदरुद्दीन अजमल"],
        manifesto: [
          "अल्पसंख्यक अधिकारों की रक्षा",
          "समान शिक्षा और स्वास्थ्य सुविधाएं",
          "गरीबी उन्मूलन कार्यक्रम",
        ],
        schemes: [
          "अल्पसंख्यक कल्याण कोष",
          "शिक्षा छात्रवृत्ति योजना",
        ],
      },
    ],
    keyIssues: ["बाढ़ और जल प्रबंधन", "NRC और नागरिकता", "चाय बागान श्रमिकों की मजदूरी", "बेरोजगारी", "अवैध घुसपैठ", "असमीया अस्मिता"],
    schedule: [PHASE_1_EARLY],
  },
  kerala: {
    stateName: "Kerala",
    dateInfo: "9 अप्रैल 2026",
    totalSeats: 140,
    totalVoters: "~2.7 करोड़",
    currentRuling: "LDF – CPM (पिनराई विजयन)",
    overview: "केरल में 140 सीटों पर मतदान होगा। LDF (वामपंथी) और UDF (कांग्रेस गठबंधन) के बीच पारंपरिक मुकाबला है। BJP भी यहां अपनी उपस्थिति बढ़ाने की कोशिश में है।",
    parties: [
      {
        name: "CPI(M) – वामपंथी लोकतांत्रिक मोर्चा (LDF)",
        symbol: "⚒️",
        alliance: "LDF",
        keyLeaders: ["पिनराई विजयन", "एम.बी. राजेश"],
        manifesto: [
          "केरल को ज्ञान आधारित अर्थव्यवस्था बनाना",
          "K-Rail (सिल्वर लाइन) परियोजना",
          "सभी के लिए आवास – LIFE Mission विस्तार",
          "सार्वजनिक स्वास्थ्य प्रणाली मजबूत करना",
          "IT और स्टार्टअप इकोसिस्टम विकास",
        ],
        schemes: [
          "LIFE Mission – गरीबों को पक्का घर",
          "कुदुम्बश्री – महिला सशक्तिकरण",
          "K-DISC – नवाचार परिषद",
          "सामाजिक सुरक्षा पेंशन ₹1600/माह",
        ],
      },
      {
        name: "भारतीय राष्ट्रीय कांग्रेस (UDF)",
        symbol: "✋",
        alliance: "UDF",
        keyLeaders: ["वी.डी. सतीशन", "के. सुधाकरन", "ऊमन चांडी"],
        manifesto: [
          "K-Rail परियोजना रद्द करना",
          "भ्रष्टाचार मुक्त शासन",
          "NREGA मजदूरी बढ़ाना",
          "कृषि और मत्स्य पालन में निवेश",
          "युवा रोजगार पैकेज",
        ],
        schemes: [
          "युवा स्वरोजगार मिशन",
          "किसान ऋण माफी",
          "महिला उद्यमी कोष",
        ],
      },
      {
        name: "भारतीय जनता पार्टी (BJP)",
        symbol: "🪷",
        alliance: "NDA",
        keyLeaders: ["के. सुरेंद्रन", "मेट्रोमैन श्रीधरन"],
        manifesto: [
          "केरल में विकास का BJP मॉडल",
          "Love Jihad विरोधी कानून",
          "मंदिर प्रशासन में सुधार",
          "पर्यटन और IT निवेश बढ़ाना",
        ],
        schemes: [
          "वन नेशन वन राशन कार्ड",
          "PM आवास योजना विस्तार",
          "स्टार्टअप इंडिया केरल",
        ],
      },
    ],
    keyIssues: ["K-Rail परियोजना", "बेरोजगारी", "भ्रष्टाचार", "गल्फ प्रवासी संकट", "बाढ़ प्रबंधन", "स्वास्थ्य सेवाएं"],
    schedule: [PHASE_1_EARLY],
  },
  puducherry: {
    stateName: "Puducherry",
    dateInfo: "9 अप्रैल 2026",
    totalSeats: 30,
    totalVoters: "~10.5 लाख",
    currentRuling: "NR Congress-BJP (एन. रंगासामी)",
    overview: "पुडुचेरी में 30 सीटों पर मतदान होगा। NR Congress-BJP गठबंधन वर्तमान में सत्ता में है। कांग्रेस और DMK गठबंधन विपक्ष में है।",
    parties: [
      {
        name: "NR Congress",
        symbol: "🏠",
        alliance: "NDA",
        keyLeaders: ["एन. रंगासामी"],
        manifesto: [
          "पुडुचेरी को पूर्ण राज्य का दर्जा दिलाना",
          "रोजगार सृजन और उद्योग विकास",
          "पर्यटन को बढ़ावा देना",
          "मछुआरों के लिए कल्याण योजनाएं",
        ],
        schemes: [
          "मुफ्त चावल योजना",
          "मछुआरा कल्याण कोष",
          "शिक्षा छात्रवृत्ति",
        ],
      },
      {
        name: "भारतीय राष्ट्रीय कांग्रेस (INC)",
        symbol: "✋",
        alliance: "INDIA Alliance / DMK गठबंधन",
        keyLeaders: ["वी. नारायणसामी"],
        manifesto: [
          "पूर्ण राज्य का दर्जा",
          "केंद्र शासित प्रदेश के अधिकारों की रक्षा",
          "बेरोजगारी भत्ता",
          "महिला सशक्तिकरण",
        ],
        schemes: [
          "5 गारंटी योजना",
          "महिला सम्मान निधि",
        ],
      },
      {
        name: "DMK",
        symbol: "☀️",
        alliance: "INDIA Alliance",
        keyLeaders: ["आर. श्रीधर"],
        manifesto: [
          "सामाजिक न्याय और समानता",
          "शिक्षा और स्वास्थ्य में सुधार",
          "तमिल भाषा और संस्कृति की रक्षा",
        ],
        schemes: [
          "कलैगनार बीमा योजना",
          "मुफ्त बस पास",
        ],
      },
    ],
    keyIssues: ["पूर्ण राज्य का दर्जा", "बेरोजगारी", "LG vs CM अधिकार विवाद", "मछुआरों की समस्याएं", "पर्यटन विकास"],
    schedule: [PHASE_1_EARLY],
  },
  "tamil-nadu": {
    stateName: "Tamil Nadu",
    dateInfo: "23 अप्रैल 2026",
    totalSeats: 234,
    totalVoters: "~6.2 करोड़",
    currentRuling: "DMK (एम.के. स्टालिन)",
    overview: "तमिलनाडु में 234 सीटों पर मतदान होगा। DMK वर्तमान में सत्ता में है। AIADMK और BJP गठबंधन मुख्य विपक्ष है। द्रविड़ राजनीति यहां का प्रमुख कारक है।",
    parties: [
      {
        name: "DMK (द्रविड़ मुनेत्र कड़गम)",
        symbol: "☀️",
        alliance: "INDIA Alliance",
        keyLeaders: ["एम.के. स्टालिन", "उदयनिधि स्टालिन"],
        manifesto: [
          "तमिलनाडु को $1 ट्रिलियन अर्थव्यवस्था बनाना",
          "सामाजिक न्याय और आरक्षण की रक्षा",
          "NEET परीक्षा से छूट",
          "महिलाओं के लिए 1000 रुपये मासिक सहायता",
          "EV और ग्रीन एनर्जी हब बनाना",
        ],
        schemes: [
          "कलैगनार मगलिर उरिमै थोगाई – ₹1000/माह महिलाओं को",
          "मुख्यमंत्री नाश्ता योजना – सरकारी स्कूलों में मुफ्त नाश्ता",
          "நம் कुडुम्बम் நம் உரிமை – परिवार कार्ड",
          "इलम तमिलगम – युवा कौशल विकास",
        ],
      },
      {
        name: "AIADMK",
        symbol: "🍃",
        alliance: "NDA (संभावित)",
        keyLeaders: ["एडप्पादी के. पलानीस्वामी"],
        manifesto: [
          "अम्मा ब्रांड योजनाएं पुनः शुरू करना",
          "कानून-व्यवस्था सुधार",
          "किसानों के लिए मुफ्त बिजली जारी रखना",
          "शिक्षा और स्वास्थ्य में सुधार",
        ],
        schemes: [
          "अम्मा कैंटीन – सस्ता भोजन",
          "अम्मा फार्मेसी – सस्ती दवाइयां",
          "कृषि ऋण माफी",
        ],
      },
      {
        name: "भारतीय जनता पार्टी (BJP)",
        symbol: "🪷",
        alliance: "NDA",
        keyLeaders: ["के. अन्नामलई"],
        manifesto: [
          "तमिलनाडु में विकास का BJP मॉडल",
          "भ्रष्टाचार मुक्त शासन",
          "हिंदू मंदिरों को सरकारी नियंत्रण से मुक्त करना",
          "रक्षा और IT उद्योग विकास",
        ],
        schemes: [
          "PM आवास योजना",
          "आयुष्मान भारत",
          "स्टार्टअप इंडिया",
        ],
      },
      {
        name: "पट्टालि मक्कल कट्चि (PMK)",
        symbol: "🥭",
        alliance: "NDA",
        keyLeaders: ["अनबुमणि रामदास"],
        manifesto: [
          "वन्नियार समुदाय के लिए 20% आरक्षण",
          "शराबबंदी",
          "कृषि विकास",
        ],
        schemes: [
          "समुदाय कल्याण कोष",
          "शराब मुक्त तमिलनाडु अभियान",
        ],
      },
    ],
    keyIssues: ["NEET परीक्षा", "सामाजिक न्याय / आरक्षण", "द्रविड़ अस्मिता", "बेरोजगारी", "जल संकट", "मंदिर प्रशासन", "शिक्षा नीति"],
    schedule: [PHASE_LATE],
  },
  "west-bengal": {
    stateName: "West Bengal",
    dateInfo: "23 और 29 अप्रैल 2026 (2 चरण)",
    totalSeats: 294,
    totalVoters: "~7.3 करोड़",
    currentRuling: "TMC (ममता बनर्जी)",
    overview: "पश्चिम बंगाल में 294 सीटों पर 2 चरणों में मतदान होगा। TMC वर्तमान में सत्ता में है और ममता बनर्जी मुख्यमंत्री हैं। BJP मुख्य विपक्ष है और कांग्रेस-वाम गठबंधन भी मैदान में है।",
    parties: [
      {
        name: "तृणमूल कांग्रेस (TMC)",
        symbol: "🌸",
        alliance: "INDIA Alliance",
        keyLeaders: ["ममता बनर्जी", "अभिषेक बनर्जी"],
        manifesto: [
          "बंगाल की अस्मिता और संस्कृति की रक्षा",
          "महिला सशक्तिकरण – लक्ष्मीर भंडार विस्तार",
          "युवा रोजगार और कौशल विकास",
          "किसानों के लिए MSP गारंटी",
          "अल्पसंख्यक कल्याण कार्यक्रम",
        ],
        schemes: [
          "लक्ष्मीर भंडार – ₹1000/माह महिलाओं को",
          "कन्याश्री – बालिका शिक्षा प्रोत्साहन",
          "स्वास्थ्य साथी – मुफ्त स्वास्थ्य बीमा ₹5 लाख",
          "सबूज साथी – छात्रों को साइकिल",
          "रूपश्री – विवाह सहायता",
        ],
      },
      {
        name: "भारतीय जनता पार्टी (BJP)",
        symbol: "🪷",
        alliance: "NDA",
        keyLeaders: ["सुकांत मजूमदार", "दिलीप घोष"],
        manifesto: [
          "बंगाल में भ्रष्टाचार मुक्त शासन",
          "कानून-व्यवस्था में सुधार",
          "उद्योग और निवेश आकर्षित करना",
          "शिक्षा भर्ती घोटाला जांच",
          "CAA लागू करना",
        ],
        schemes: [
          "PM किसान सम्मान निधि",
          "आयुष्मान भारत",
          "PM आवास योजना",
          "उज्ज्वला योजना",
        ],
      },
      {
        name: "CPI(M) – वामपंथी मोर्चा",
        symbol: "⚒️",
        alliance: "वाम-कांग्रेस गठबंधन",
        keyLeaders: ["मोहम्मद सलीम", "सूर्यकांत मिश्र"],
        manifesto: [
          "भूमि सुधार और किसान अधिकार",
          "श्रमिक अधिकारों की रक्षा",
          "शिक्षा और स्वास्थ्य का सार्वजनिक विस्तार",
          "सांप्रदायिकता का विरोध",
        ],
        schemes: [
          "ऑपरेशन बर्गा – भूमि वितरण",
          "पंचायती राज सुदृढ़ीकरण",
        ],
      },
      {
        name: "भारतीय राष्ट्रीय कांग्रेस (INC)",
        symbol: "✋",
        alliance: "वाम-कांग्रेस गठबंधन",
        keyLeaders: ["अधीर रंजन चौधरी"],
        manifesto: [
          "बंगाल में लोकतंत्र बहाली",
          "बेरोजगारी भत्ता",
          "महिला सुरक्षा",
          "MNREGA मजदूरी बढ़ाना",
        ],
        schemes: [
          "5 गारंटी योजना",
          "महिला सम्मान निधि",
        ],
      },
    ],
    keyIssues: ["शिक्षा भर्ती घोटाला", "कानून-व्यवस्था", "बेरोजगारी", "CAA/NRC", "महिला सुरक्षा", "भ्रष्टाचार", "बंगाल की अस्मिता"],
    schedule: [
      {
        label: "चरण 1 (152 ACs)",
        gazette: "30 मार्च 2026 (सोमवार)",
        lastNomination: "6 अप्रैल 2026 (सोमवार)",
        scrutiny: "7 अप्रैल 2026 (मंगलवार)",
        withdrawal: "9 अप्रैल 2026 (गुरुवार)",
        poll: "23 अप्रैल 2026 (गुरुवार)",
        counting: "4 मई 2026 (सोमवार)",
        completion: "6 मई 2026 (बुधवार)",
      },
      {
        label: "चरण 2 (142 ACs)",
        gazette: "2 अप्रैल 2026 (गुरुवार)",
        lastNomination: "9 अप्रैल 2026 (गुरुवार)",
        scrutiny: "10 अप्रैल 2026 (शुक्रवार)",
        withdrawal: "13 अप्रैल 2026 (सोमवार)",
        poll: "29 अप्रैल 2026 (बुधवार)",
        counting: "4 मई 2026 (सोमवार)",
        completion: "6 मई 2026 (बुधवार)",
      },
    ],
  },
};

const UpcomingElection = () => {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const data = stateSlug ? electionData[stateSlug] : null;

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">चुनाव डेटा उपलब्ध नहीं</h1>
          <Link to="/" className="text-primary underline">होम पेज पर जाएं</Link>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> होम पेज पर वापस
        </Link>

        {/* Header */}
        <div className="mb-8">
          <Badge variant="outline" className="mb-3">
            <Calendar className="h-3 w-3 mr-1" /> {data.dateInfo}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            {data.stateName} विधानसभा चुनाव 2026
          </h1>
          <p className="text-muted-foreground max-w-3xl">{data.overview}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: MapPin, label: "कुल सीटें", value: data.totalSeats },
            { icon: Users, label: "कुल मतदाता", value: data.totalVoters },
            { icon: Vote, label: "वर्तमान सत्ता", value: data.currentRuling },
            { icon: Calendar, label: "मतदान तिथि", value: data.dateInfo },
          ].map((s) => (
            <Card key={s.label} className="border-border">
              <CardContent className="p-4 flex items-start gap-3">
                <s.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-semibold text-foreground text-sm">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Issues */}
        <div className="mb-10">
          <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" /> प्रमुख चुनावी मुद्दे
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.keyIssues.map((issue) => (
              <Badge key={issue} variant="secondary" className="text-sm py-1.5 px-3">
                {issue}
              </Badge>
            ))}
          </div>
        </div>

        {/* Parties */}
        <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> प्रमुख राजनीतिक दल
        </h2>
        <div className="space-y-6 mb-10">
          {data.parties.map((party) => (
            <Card key={party.name} className="border-border overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="text-2xl">{party.symbol}</span>
                  <div>
                    <span className="text-foreground">{party.name}</span>
                    {party.alliance && (
                      <Badge variant="outline" className="ml-2 text-xs">{party.alliance}</Badge>
                    )}
                  </div>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  प्रमुख नेता: {party.keyLeaders.join(", ")}
                </p>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> घोषणापत्र (Manifesto) के प्रमुख बिंदु
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {party.manifesto.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" /> प्रमुख योजनाएं (Schemes)
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {party.schemes.map((scheme, i) => (
                      <li key={i}>{scheme}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/50 rounded-xl p-6 text-center text-sm text-muted-foreground">
          <p>⚠️ यह डेटा शैक्षिक उद्देश्यों के लिए है। आधिकारिक जानकारी के लिए <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary underline">भारत निर्वाचन आयोग</a> की वेबसाइट देखें।</p>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default UpcomingElection;
