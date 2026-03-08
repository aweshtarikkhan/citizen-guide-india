import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { UserPlus, FileText, MapPin, ShieldCheck, AlertCircle, Search, ExternalLink, CheckCircle, Smartphone, Globe, Printer, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageContent } from "@/hooks/usePageContent";

const services = [
  {
    icon: UserPlus,
    title: "Register to Vote",
    desc: "Step-by-step guidance on new voter registration through Form 6.",
    details: [
      "You must be an Indian citizen aged 18 or above on the qualifying date (1st January of the year of revision).",
      "Fill Form 6 online at the National Voter Service Portal (NVSP) or visit your nearest ERO office.",
      "Attach proof of age (birth certificate, Class 10 marksheet, passport) and proof of address (Aadhaar, utility bill, bank passbook).",
      "Your application will be verified through a field visit by the BLO (Booth Level Officer).",
      "Once approved, your name appears in the electoral roll and you receive your EPIC (Voter ID card).",
      "The entire process typically takes 15–30 days from the date of application.",
      "You can track your application status online using your reference number.",
    ],
    link: "https://www.nvsp.in/",
    linkText: "Apply on NVSP →",
  },
  {
    icon: FileText,
    title: "Correct Voter Details",
    desc: "Update your name, address, photo, or other details in the electoral roll.",
    details: [
      "Use Form 8 to correct entries such as name, date of birth, gender, or photo in the electoral roll.",
      "Use Form 8A to update your address within the same constituency.",
      "Submit corrections online via NVSP or at your local ERO/AERO office.",
      "Carry supporting documents for any changes you request.",
      "Corrections are typically processed within 15–30 days.",
      "You can correct multiple fields in a single Form 8 submission.",
      "If your photo is outdated, submit a new passport-sized colour photograph with your correction form.",
    ],
    link: "https://www.nvsp.in/",
    linkText: "Correct Details on NVSP →",
  },
  {
    icon: MapPin,
    title: "Find Your Polling Station",
    desc: "Locate your assigned polling booth using your EPIC number or details.",
    details: [
      "Visit the Electoral Search page on the ECI website or NVSP portal.",
      "Search by your EPIC number (Voter ID number) or by personal details (name, age, constituency).",
      "Your assigned polling station with full address and booth number will be displayed.",
      "On election day, locate the booth early — carry your voter ID or approved alternative.",
      "Facilities for differently-abled and senior citizens are available at every booth.",
      "Google Maps integration on many portals lets you get directions to your booth.",
      "If you've recently moved, verify your new polling station before election day.",
    ],
    link: "https://electoralsearch.eci.gov.in/",
    linkText: "Search Your Booth →",
  },
  {
    icon: ShieldCheck,
    title: "Documents Required on Polling Day",
    desc: "Know exactly which identity documents you need to carry.",
    details: [
      "EPIC (Voter ID Card) is the primary document, but not the only one accepted.",
      "12 alternative documents accepted: Aadhaar, Passport, Driving License, PAN Card, Service ID (Govt.), Student ID (Govt.), Bank/Post Office Passbook with photo, MNREGA Job Card, Health Insurance Smart Card, Pension document with photo, MP/MLA/MLC official ID, Smart Card issued by RGI under NPR.",
      "You need only ONE of these documents — not all.",
      "Ensure the document is valid and the photo is recognisable.",
      "Digital documents on DigiLocker or mAadhaar are also accepted in many states — check local guidelines.",
      "Expired documents may not be accepted — ensure your ID is current and valid.",
    ],
    link: "https://www.eci.gov.in/",
    linkText: "View ECI Guidelines →",
  },
  {
    icon: AlertCircle,
    title: "Name Missing from Electoral Roll?",
    desc: "What to do if your name is missing before elections.",
    details: [
      "Check your name on the Electoral Search portal well before election day.",
      "If missing, file Form 6 for new inclusion — this can be done up to the last date notified by the ECI.",
      "Contact your local BLO (Booth Level Officer) — they can assist with the process.",
      "Call the national voter helpline 1950 for immediate assistance.",
      "On election day, if your name is on the roll but you face issues, the Presiding Officer can help verify your identity.",
      "Names can get deleted during revision if the BLO found your address vacant — always verify after each revision.",
      "Use the Voter Helpline App to get instant updates on your registration status.",
    ],
    link: "https://electoralsearch.eci.gov.in/",
    linkText: "Check Your Name →",
  },
  {
    icon: Search,
    title: "Check Voter Registration Status",
    desc: "Verify your registration status and details in the current electoral roll.",
    details: [
      "Visit the Electoral Search page on the ECI/NVSP portal.",
      "Search using your EPIC number or by entering your name and constituency details.",
      "Verify that your name, age, address, and polling station details are correct.",
      "If any detail is incorrect, file Form 8 for corrections immediately.",
      "Check your status periodically, especially before elections, to avoid last-minute issues.",
      "Download the PDF of your electoral roll to keep a local copy for reference.",
      "Set reminders to check your status at least once a year during revision periods.",
    ],
    link: "https://electoralsearch.eci.gov.in/",
    linkText: "Check Status →",
  },
  {
    icon: Smartphone,
    title: "Voter Helpline App",
    desc: "The ECI's official mobile app for all voter services on the go.",
    details: [
      "Available for free on Android (Google Play) and iOS (App Store).",
      "Register, search, and track voter applications directly from your phone.",
      "Get real-time notifications about election dates, deadlines, and updates.",
      "Report Model Code of Conduct violations using the built-in cVIGIL feature.",
      "Access your digital voter slip (e-EPIC) on the app.",
      "Find your polling station with GPS navigation support.",
      "Available in multiple Indian languages for wider accessibility.",
    ],
    link: "https://play.google.com/store/apps/details?id=com.eci.citizen",
    linkText: "Download App →",
  },
  {
    icon: Printer,
    title: "Download e-EPIC (Digital Voter ID)",
    desc: "Get a digital version of your Voter ID card on your phone.",
    details: [
      "e-EPIC is a digital version of your EPIC (Voter ID Card) in PDF format.",
      "Download it from the NVSP portal or the Voter Helpline App.",
      "You need your EPIC number and registered mobile number to download.",
      "An OTP will be sent to your registered mobile for verification.",
      "The e-EPIC contains a QR code for quick verification at polling stations.",
      "It is accepted as a valid identity document at polling booths.",
      "Keep both digital and physical copies for convenience.",
    ],
    link: "https://www.nvsp.in/",
    linkText: "Download e-EPIC →",
  },
  {
    icon: Globe,
    title: "NRI / Overseas Voter Registration",
    desc: "How Indian citizens living abroad can register and vote.",
    details: [
      "NRIs with valid Indian passports can register as overseas electors using Form 001.",
      "You must not have acquired citizenship of any other country.",
      "Registration is linked to your last place of ordinary residence in India.",
      "Currently, overseas voters must vote in person at their Indian constituency on polling day.",
      "Efforts for postal voting and e-voting for NRIs are being explored by the ECI.",
      "Your registration remains valid as long as your Indian passport is valid.",
      "You can apply online through the NVSP portal's overseas voter section.",
    ],
    link: "https://www.nvsp.in/",
    linkText: "Register as Overseas Voter →",
  },
  {
    icon: Users,
    title: "Assistance for Special Categories",
    desc: "Special provisions for differently-abled, senior citizens, and other categories.",
    details: [
      "Voters with 40%+ disability can opt for postal ballot facility.",
      "Senior citizens (80+) are also eligible for postal ballot facility.",
      "Wheelchairs, ramps, and Braille-enabled EVMs are provided at polling stations.",
      "Companion-assisted voting is available for blind and infirm voters.",
      "Transgender persons can register under the 'third gender' category.",
      "Homeless persons can register using the address of a shelter or usual place of stay.",
      "Service voters (armed forces, diplomatic staff) have special postal voting provisions.",
      "Special transport arrangements are made for voters in remote and difficult terrain.",
    ],
    link: "https://www.eci.gov.in/",
    linkText: "View ECI Provisions →",
  },
];

const HelpDeskPage = () => {
  const { getContent } = usePageContent("help-desk");

  return (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 bg-background">
      <div className="container max-w-4xl">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Voter Help Desk</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-3 text-foreground">
          {getContent("page_title", "How Can We Help You?")}
        </h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-2xl leading-relaxed">
          {getContent("page_desc", "Simple, step-by-step guidance for all your voter-related needs. We guide you toward official Election Commission services — everything here is free and non-partisan.")}
        </p>
      </div>
    </section>

    <section className="pb-20 bg-background">
      <div className="container max-w-4xl space-y-10">
        {services.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-card shadow-card p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                <item.icon className="h-6 w-6 text-background" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">{item.title}</h2>
                <p className="text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {item.details.map((d, j) => (
                <li key={j} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-foreground mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full font-semibold">
                {item.linkText} <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        ))}
      </div>
    </section>

    <FooterSection />
  </div>
  );
};

export default HelpDeskPage;
