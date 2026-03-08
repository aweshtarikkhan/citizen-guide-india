import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePageContent } from "@/hooks/usePageContent";

const faqCategories = [
  {
    category: "Registration & Voter ID",
    faqs: [
      {
        q: "What is the minimum age to register as a voter?",
        a: "You must be 18 years old on or before 1st January of the year of revision of the electoral roll. For example, if the revision year is 2025, you must have turned 18 on or before 1st January 2025.",
      },
      {
        q: "Can I register to vote online?",
        a: "Yes. You can register through the National Voter Service Portal (nvsp.in) or the Voter Helpline App. You'll need to fill Form 6 and upload proof of age and address. A BLO will visit your address for verification.",
      },
      {
        q: "How long does voter registration take?",
        a: "Typically 15–30 days from the date of application. During special summary revision periods before elections, the process may be expedited. You can track your application status on the NVSP portal.",
      },
      {
        q: "Can I be registered in two constituencies?",
        a: "No. You can only be registered in one constituency at a time. If you move, you must apply for transfer (Form 6 for new constituency, or Form 8A for within the same constituency). Dual registration is a punishable offence.",
      },
      {
        q: "I lost my Voter ID card. How do I get a replacement?",
        a: "Apply for a duplicate EPIC through the NVSP portal or at your local ERO office. You'll need to provide your EPIC number (if you remember it) or search for your details on the electoral roll. There's no fee for a replacement.",
      },
      {
        q: "Is Aadhaar linking with Voter ID mandatory?",
        a: "No, it is voluntary. The Election Commission encourages linking for de-duplication purposes, but you cannot be denied your right to vote for not linking Aadhaar. Use Form 6B for linking.",
      },
    ],
  },
  {
    category: "Voting Process",
    faqs: [
      {
        q: "What happens inside the polling booth?",
        a: "You enter, show your ID, get your finger inked, enter the voting compartment alone, press the button next to your chosen candidate on the EVM, verify the VVPAT slip (displayed for 7 seconds), and exit. The entire process takes about 2–3 minutes.",
      },
      {
        q: "What if my name is on the voter list but the polling officer denies me entry?",
        a: "If your name is on the list and you have valid ID, the Presiding Officer must allow you to vote. If denied, insist on speaking to the Presiding Officer, and if still denied, file a complaint on the cVIGIL app or call 1950 immediately.",
      },
      {
        q: "Can I vote if I'm in a different city on election day?",
        a: "No, you must vote at your assigned polling station in your registered constituency. There is no provision for voting from a different location yet. However, some categories (service voters, election duty staff) have special provisions.",
      },
      {
        q: "What is the VVPAT and why does it matter?",
        a: "VVPAT (Voter Verifiable Paper Audit Trail) is a printer attached to the EVM that generates a paper slip showing the candidate name and symbol you voted for. It's displayed for 7 seconds before falling into a sealed box. This provides a physical audit trail to verify EVM accuracy.",
      },
      {
        q: "What if the EVM malfunctions while I'm voting?",
        a: "If the EVM malfunctions, the Presiding Officer will replace it with a reserve EVM. Your vote on the malfunctioned machine is not recorded, and you will be allowed to vote again on the new machine. This is documented in the official records.",
      },
      {
        q: "Is there a holiday on election day?",
        a: "Yes. Election day is a paid holiday for all workers. Under Section 135B of the Representation of the People Act, 1951, every employer must grant a paid holiday on polling day. Violation is punishable with a fine.",
      },
    ],
  },
  {
    category: "EVMs & Security",
    faqs: [
      {
        q: "Can EVMs be hacked remotely?",
        a: "No. Indian EVMs are standalone machines with no internet, Wi-Fi, Bluetooth, or any wireless connectivity. They use one-time programmable (OTP) chips that cannot be reprogrammed. The source code is burned into the chip at the time of manufacturing.",
      },
      {
        q: "Who manufactures EVMs in India?",
        a: "EVMs are manufactured by two government-owned companies: Bharat Electronics Limited (BEL) and Electronics Corporation of India Limited (ECIL). Both operate under strict security protocols with no private sector involvement.",
      },
      {
        q: "How are EVMs allocated to constituencies?",
        a: "EVMs go through multiple rounds of randomisation. First, they're randomly allocated to constituencies, then to specific booths. The allocation is done in the presence of political party representatives using computer-generated random numbers.",
      },
      {
        q: "What security measures protect EVMs?",
        a: "Multiple layers: tamper-evident seals, strong rooms with 24/7 CCTV and armed guards, two-stage randomisation, first-level checking (FLC) open to party representatives, mock polls before voting, and VVPAT verification.",
      },
    ],
  },
  {
    category: "Special Categories",
    faqs: [
      {
        q: "Can NRIs vote in Indian elections?",
        a: "Yes, NRIs with valid Indian passports can register as overseas electors using Form 001 on the NVSP portal. However, they must currently vote in person at their registered constituency. Postal voting for NRIs is being considered.",
      },
      {
        q: "How do persons with disabilities vote?",
        a: "The ECI ensures accessible polling stations with ramps, ground-floor booths, wheelchairs, Braille-enabled EVMs, and the option to bring a companion for assistance. Special transport may also be arranged.",
      },
      {
        q: "Can homeless persons vote?",
        a: "Yes. Homeless persons can register to vote by providing the address of a shelter or their usual place of stay. The ECI has special drives to register homeless voters through Systematic Voters' Education and Electoral Participation (SVEEP) programs.",
      },
      {
        q: "Can transgender persons vote?",
        a: "Absolutely. Transgender persons can register as 'third gender' on the voter registration form. The ECI recognises the third gender category following the Supreme Court's NALSA judgment (2014).",
      },
      {
        q: "What about senior citizens and very old voters?",
        a: "Voters above 80 years and persons with 40%+ disability can apply for postal ballot facility. The ECI also deploys special teams and provides priority service at polling stations for senior citizens.",
      },
    ],
  },
  {
    category: "After the Election",
    faqs: [
      {
        q: "How can I check election results?",
        a: "Results are available in real-time on the ECI website (results.eci.gov.in) during counting day. They are also broadcast on news channels and published in newspapers the following day.",
      },
      {
        q: "Can I challenge election results?",
        a: "Yes. Any candidate or elector can file an election petition in the High Court within 45 days of the result declaration. Grounds include corrupt practices, non-compliance with election law, or improper nomination handling.",
      },
      {
        q: "What happens if a by-election is needed?",
        a: "By-elections are held when a seat falls vacant due to death, resignation, or disqualification of the elected representative. The ECI announces by-election dates, and the same full election process is followed for that constituency.",
      },
      {
        q: "How do I hold my elected representative accountable?",
        a: "Attend public grievance sessions, write to your MP/MLA, use the Parliament/Assembly question mechanisms, track their performance on platforms like PRS Legislative Research, and most importantly — vote in the next election based on their performance.",
      },
    ],
  },
];

const FAQPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 bg-background">
      <div className="container max-w-4xl">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">FAQ</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-3 text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Comprehensive answers to the most common questions about voting, elections, and democratic participation in India.
        </p>
      </div>
    </section>

    <section className="pb-20 bg-background">
      <div className="container max-w-4xl space-y-12">
        {faqCategories.map((cat, i) => (
          <div key={i}>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">{cat.category}</h2>
            <Accordion type="multiple" className="space-y-3">
              {cat.faqs.map((faq, j) => (
                <AccordionItem key={j} value={`${i}-${j}`} className="rounded-xl border border-border bg-card shadow-card px-6">
                  <AccordionTrigger className="text-left font-display font-semibold text-foreground text-sm md:text-base py-5 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </section>

    <FooterSection />
  </div>
);

export default FAQPage;
