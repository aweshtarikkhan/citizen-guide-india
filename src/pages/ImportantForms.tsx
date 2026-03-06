import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const forms = [
  {
    form: "Form 6",
    title: "New Voter Registration",
    purpose: "To apply for inclusion of your name in the electoral roll as a new voter.",
    who: "Indian citizens who have turned 18 (on or before 1st January of the revision year) and whose name is not yet on the electoral roll.",
    documents: [
      "Proof of age: Birth certificate, Class 10 marksheet, passport, Aadhaar card, or PAN card.",
      "Proof of address: Aadhaar card, utility bill (electricity, water, gas), bank/post office passbook, ration card, or rent agreement.",
      "Two recent passport-sized colour photographs.",
      "Declaration of nationality and age.",
    ],
    process: [
      "Visit the NVSP portal or download the Voter Helpline App.",
      "Fill in personal details, constituency, and upload documents.",
      "Submit the form online — you'll receive a reference number.",
      "A Booth Level Officer (BLO) will visit your address for verification.",
      "Once verified, your name is added to the electoral roll and your EPIC is issued.",
    ],
    link: "https://www.nvsp.in/Forms/Forms/form6",
  },
  {
    form: "Form 6B",
    title: "Aadhaar Linking with Voter ID",
    purpose: "To link your Aadhaar number with your Voter ID for de-duplication and authentication purposes.",
    who: "All existing registered voters. This is voluntary but encouraged by the ECI.",
    documents: [
      "Your EPIC (Voter ID) number.",
      "Your Aadhaar number.",
      "No additional documents required.",
    ],
    process: [
      "Visit NVSP portal or use the Voter Helpline App.",
      "Select Form 6B and enter your EPIC and Aadhaar numbers.",
      "Submit — no BLO visit is required for this form.",
      "Your Aadhaar will be linked for electoral verification purposes.",
      "Your Aadhaar data is not used for any purpose beyond electoral roll management.",
    ],
    link: "https://www.nvsp.in/",
  },
  {
    form: "Form 7",
    title: "Objection to Inclusion / Deletion of Name",
    purpose: "To object to the inclusion of a name in the electoral roll, or to request deletion of a name (e.g., deceased voter, shifted voter).",
    who: "Any registered voter who wants to report a deceased person's name, a person who has shifted, or duplicate entries in the roll.",
    documents: [
      "Details of the person whose name is to be removed.",
      "Evidence supporting the objection (e.g., death certificate, address proof of relocation).",
      "Your own EPIC details as the objector.",
    ],
    process: [
      "Visit the NVSP portal and select Form 7.",
      "Provide details of the entry you're objecting to.",
      "Upload supporting evidence.",
      "The ERO will verify the objection and hold a hearing if necessary.",
      "If the objection is upheld, the entry is removed from the roll.",
    ],
    link: "https://www.nvsp.in/",
  },
  {
    form: "Form 8",
    title: "Correction of Entries in Electoral Roll",
    purpose: "To correct errors in your existing voter registration — name spelling, date of birth, gender, photo, or other details.",
    who: "Any registered voter who has incorrect details in the electoral roll.",
    documents: [
      "Proof of the correct information (e.g., correct name on Aadhaar/passport for name correction).",
      "Your existing EPIC number.",
      "Updated passport-sized photograph if correcting photo.",
    ],
    process: [
      "Visit NVSP and select Form 8.",
      "Select the specific fields you want to correct.",
      "Upload supporting documents for each correction.",
      "Submit — corrections are typically processed within 15–30 days.",
      "You may receive a new EPIC with corrected details.",
    ],
    link: "https://www.nvsp.in/",
  },
  {
    form: "Form 8A",
    title: "Transposition of Entry (Address Change within Same Constituency)",
    purpose: "To update your address in the electoral roll when you move within the same assembly constituency.",
    who: "Voters who have moved to a new address but remain in the same constituency.",
    documents: [
      "Proof of new address within the same constituency.",
      "Your existing EPIC number.",
    ],
    process: [
      "Visit NVSP and select Form 8A.",
      "Enter your new address details.",
      "Upload proof of new address.",
      "BLO verification may be conducted at your new address.",
      "Your polling station assignment will be updated accordingly.",
    ],
    link: "https://www.nvsp.in/",
  },
  {
    form: "Form 001",
    title: "Overseas (NRI) Voter Registration",
    purpose: "To register as an overseas elector if you are an Indian citizen living abroad.",
    who: "Indian citizens residing outside India who have a valid Indian passport and whose name is not in any electoral roll in India.",
    documents: [
      "Valid Indian passport (self-attested copy).",
      "Details of your last place of ordinary residence in India.",
      "Current overseas address proof.",
      "Declaration that you have not acquired citizenship of any other country.",
    ],
    process: [
      "Visit the NVSP portal and select the overseas voter registration option.",
      "Fill in your passport details, Indian address, and overseas address.",
      "Upload required documents.",
      "Your application is forwarded to the ERO of your Indian constituency.",
      "Once approved, you are enrolled as an overseas elector — but you must vote in person at your Indian constituency on polling day.",
    ],
    link: "https://www.nvsp.in/",
  },
];

const ImportantFormsPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 bg-background">
      <div className="container max-w-4xl">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Important Forms</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-3 text-foreground">
          Every Form You Need
        </h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Complete guide to all voter-related forms — who needs them, what documents are required, and how to submit them.
        </p>
      </div>
    </section>

    <section className="pb-20 bg-background">
      <div className="container max-w-4xl space-y-10">
        {forms.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-card shadow-card p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-background" />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-bold bg-foreground text-background px-2 py-1 rounded">{item.form}</span>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">{item.title}</h2>
                </div>
                <p className="text-muted-foreground mt-2">{item.purpose}</p>
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">Who Needs This</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.who}</p>
            </div>

            <div className="mb-5">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">Documents Required</h3>
              <ul className="space-y-2">
                {item.documents.map((d, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-foreground text-sm mt-0.5">•</span>
                    <span className="text-muted-foreground text-sm leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">How to Submit</h3>
              <ul className="space-y-2">
                {item.process.map((p, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="text-foreground font-bold text-sm mt-0.5 flex-shrink-0">{j + 1}.</span>
                    <span className="text-muted-foreground text-sm leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full font-semibold">
                Fill {item.form} Online <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        ))}
      </div>
    </section>

    <FooterSection />
  </div>
);

export default ImportantFormsPage;
