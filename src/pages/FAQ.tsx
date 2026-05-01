import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import FeedbackSection from "@/components/FeedbackSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePageContent } from "@/hooks/usePageContent";

const faqCategories = [
  {
    category: "Registration & Voter ID",
    faqs: [
      { q: "What is the minimum age to register as a voter?", a: "You must be 18 years old on or before 1st January of the year of revision of the electoral roll. For example, if the revision year is 2025, you must have turned 18 on or before 1st January 2025." },
      { q: "Can I register to vote online?", a: "Yes. You can register through the National Voter Service Portal (nvsp.in) or the Voter Helpline App. You'll need to fill Form 6 and upload proof of age and address. A BLO will visit your address for verification." },
      { q: "How long does voter registration take?", a: "Typically 15–30 days from the date of application. During special summary revision periods before elections, the process may be expedited. You can track your application status on the NVSP portal." },
      { q: "Can I be registered in two constituencies?", a: "No. You can only be registered in one constituency at a time. If you move, you must apply for transfer (Form 6 for new constituency, or Form 8A for within the same constituency). Dual registration is a punishable offence." },
      { q: "I lost my Voter ID card. How do I get a replacement?", a: "Apply for a duplicate EPIC through the NVSP portal or at your local ERO office. You'll need to provide your EPIC number (if you remember it) or search for your details on the electoral roll. There's no fee for a replacement." },
      { q: "Is Aadhaar linking with Voter ID mandatory?", a: "No, it is voluntary. The Election Commission encourages linking for de-duplication purposes, but you cannot be denied your right to vote for not linking Aadhaar. Use Form 6B for linking." },
      { q: "What documents are accepted as proof of identity at the polling station?", a: "12 documents are accepted: EPIC (Voter ID), Aadhaar card, Passport, Driving License, PAN card, Service ID of government employees, Passbook with photo (bank/post office), MNREGA job card, Health Insurance Smart Card, Pension document with photo, NPR letter, and Official identity card by MP/MLA/MLC." },
      { q: "What is the Electoral Photo Identity Card (EPIC)?", a: "EPIC is the official Voter ID card issued by the Election Commission of India. It contains your name, photo, address, EPIC number, and constituency details. While not mandatory for voting (other IDs work), it is the primary voter identification document." },
      { q: "How do I check if my name is on the voter list?", a: "You can check on the NVSP portal (nvsp.in), Voter Helpline App, by SMS (type EPIC <your Voter ID number> and send to 1950), or visit your local Electoral Registration Office." },
      { q: "What is Form 6 and when do I need it?", a: "Form 6 is the application for inclusion in the electoral roll. You need it when registering as a voter for the first time or when shifting to a new constituency. It can be filled online on the NVSP portal or submitted at the ERO office." },
      { q: "What is Form 7 used for?", a: "Form 7 is used to object to the inclusion of a name in the electoral roll or to request deletion of a name. It is filed when someone has died, shifted permanently, or is found to be registered fraudulently." },
      { q: "What is Form 8 and Form 8A?", a: "Form 8 is for correcting entries in the electoral roll (name, age, address, photo, etc.). Form 8A is specifically for shifting your registration within the same constituency when you move to a new address." },
      { q: "Who is a BLO?", a: "BLO stands for Booth Level Officer. They are government employees appointed by the ECI for each polling station area. They verify voter registration applications, update the voter list, and distribute voter slips before elections." },
      { q: "Can I register if I don't have a permanent address?", a: "Yes. You can register at the address of your 'ordinary residence' — where you have been living for at least 6 months. Even hostels, rented rooms, and shelters count as valid addresses for registration." },
    ],
  },
  {
    category: "Voting Process",
    faqs: [
      { q: "What happens inside the polling booth?", a: "You enter, show your ID, get your finger inked, enter the voting compartment alone, press the button next to your chosen candidate on the EVM, verify the VVPAT slip (displayed for 7 seconds), and exit. The entire process takes about 2–3 minutes." },
      { q: "What if my name is on the voter list but the polling officer denies me entry?", a: "If your name is on the list and you have valid ID, the Presiding Officer must allow you to vote. If denied, insist on speaking to the Presiding Officer, and if still denied, file a complaint on the cVIGIL app or call 1950 immediately." },
      { q: "Can I vote if I'm in a different city on election day?", a: "No, you must vote at your assigned polling station in your registered constituency. There is no provision for voting from a different location yet. However, some categories (service voters, election duty staff) have special provisions." },
      { q: "What is the VVPAT and why does it matter?", a: "VVPAT (Voter Verifiable Paper Audit Trail) is a printer attached to the EVM that generates a paper slip showing the candidate name and symbol you voted for. It's displayed for 7 seconds before falling into a sealed box. This provides a physical audit trail to verify EVM accuracy." },
      { q: "What if the EVM malfunctions while I'm voting?", a: "If the EVM malfunctions, the Presiding Officer will replace it with a reserve EVM. Your vote on the malfunctioned machine is not recorded, and you will be allowed to vote again on the new machine. This is documented in the official records." },
      { q: "Is there a holiday on election day?", a: "Yes. Election day is a paid holiday for all workers. Under Section 135B of the Representation of the People Act, 1951, every employer must grant a paid holiday on polling day. Violation is punishable with a fine." },
      { q: "What is NOTA and how does it work?", a: "NOTA (None of the Above) is the last option on every EVM ballot. If you don't want to vote for any candidate, you can press NOTA. Your vote is counted and recorded in the results, but even if NOTA gets the most votes, the candidate with the next highest votes wins." },
      { q: "What is the indelible ink used for?", a: "Indelible ink is applied to the left index finger of every voter to prevent duplicate voting. It contains silver nitrate and lasts for 4-6 weeks. It's nearly impossible to remove and is clearly visible under UV light." },
      { q: "What time do polling stations open and close?", a: "Generally, polling stations operate from 7:00 AM to 6:00 PM. However, timings may vary by state or region. In some remote areas, polling may be from 7:00 AM to 3:00 PM. Anyone in the queue before closing time is allowed to vote." },
      { q: "Can someone vote on my behalf (proxy voting)?", a: "Proxy voting is available only for classified service voters (armed forces, para-military, diplomats). Ordinary citizens cannot appoint a proxy. The service voter must apply through their commanding officer." },
      { q: "What is a Voter Slip?", a: "A Voter Slip is a document distributed by BLOs before election day. It contains your name, EPIC number, polling station name and number, and serial number on the voter list. It helps you locate your booth easily but is NOT a valid identity document for voting." },
      { q: "Can I take a photo inside the polling booth?", a: "Absolutely not. Photography, videography, and use of mobile phones inside the polling station are strictly prohibited. Doing so can lead to criminal prosecution under Section 128A of the Representation of the People Act." },
      { q: "What is a Tendered Vote?", a: "If someone has already voted using your name and you arrive at the booth, you can still cast a 'Tendered Vote' on a special ballot paper after providing your identity. Tendered votes are kept separately and counted only if the election result is challenged." },
      { q: "What is a Postal Ballot?", a: "Postal ballot allows certain categories of voters to vote by mail without going to a polling station. Eligible categories include service voters, voters on election duty, voters above 80 years, persons with 40%+ disability, and COVID-positive patients (as applicable)." },
    ],
  },
  {
    category: "EVMs & Security",
    faqs: [
      { q: "Can EVMs be hacked remotely?", a: "No. Indian EVMs are standalone machines with no internet, Wi-Fi, Bluetooth, or any wireless connectivity. They use one-time programmable (OTP) chips that cannot be reprogrammed. The source code is burned into the chip at the time of manufacturing." },
      { q: "Who manufactures EVMs in India?", a: "EVMs are manufactured by two government-owned companies: Bharat Electronics Limited (BEL) and Electronics Corporation of India Limited (ECIL). Both operate under strict security protocols with no private sector involvement." },
      { q: "How are EVMs allocated to constituencies?", a: "EVMs go through multiple rounds of randomisation. First, they're randomly allocated to constituencies, then to specific booths. The allocation is done in the presence of political party representatives using computer-generated random numbers." },
      { q: "What security measures protect EVMs?", a: "Multiple layers: tamper-evident seals, strong rooms with 24/7 CCTV and armed guards, two-stage randomisation, first-level checking (FLC) open to party representatives, mock polls before voting, and VVPAT verification." },
      { q: "What is a Mock Poll?", a: "Before actual voting begins, a mock poll is conducted at every polling station. At least 50 votes are cast on the EVM in the presence of polling agents, and the result is verified with VVPAT slips. Only after a successful mock poll does real voting begin." },
      { q: "How many votes can an EVM record?", a: "Each EVM can record up to 2,000 votes and support up to 384 candidates (using up to 4 Balloting Units). Each Balloting Unit can accommodate up to 16 candidates." },
      { q: "What happens to EVMs after counting?", a: "After counting, EVMs are sealed again and stored in strong rooms under security. They are preserved for a period as specified by the ECI (usually until election petitions are resolved). VVPAT slips are stored for 45 days minimum." },
      { q: "What is the M3 EVM?", a: "M3 is the latest generation EVM introduced in 2013. It has enhanced security features like a tamper detection mechanism that permanently disables the machine if anyone tries to open it, a real-time clock for date-time stamping, and dynamic key coding." },
    ],
  },
  {
    category: "Election Commission & Laws",
    faqs: [
      { q: "What is the Election Commission of India (ECI)?", a: "ECI is an autonomous constitutional body established under Article 324 of the Constitution. It supervises and conducts all elections to Parliament, State Legislatures, and the offices of President and Vice-President. It consists of the Chief Election Commissioner and two Election Commissioners." },
      { q: "What is the Model Code of Conduct (MCC)?", a: "MCC is a set of guidelines issued by the ECI for political parties and candidates during elections. It comes into effect from the date of election announcement until results are declared. It regulates speeches, processions, polling day conduct, and misuse of government machinery." },
      { q: "Can the government announce new schemes during elections?", a: "No. Once the Model Code of Conduct is in effect, the ruling party cannot announce new schemes, projects, or financial grants. This prevents the misuse of government power to influence voters. Violations are taken seriously by the ECI." },
      { q: "What is the cVIGIL app?", a: "cVIGIL (Citizen Vigil) is a mobile app launched by ECI that allows citizens to report election code violations with photos and videos. Reports are geotagged and timestamped. The Flying Squads respond within 100 minutes. Available on Android and iOS." },
      { q: "What is Section 49P of the Conduct of Elections Rules?", a: "This section deals with the secrecy of voting. No person can be compelled to reveal their vote. Any attempt to find out how someone voted is punishable under law. This is a cornerstone of free and fair elections." },
      { q: "What is the Representation of the People Act?", a: "There are two key acts: The Representation of the People Act, 1950, which deals with the preparation of electoral rolls and seat allocation. The Representation of the People Act, 1951, deals with the conduct of elections, election offences, corrupt practices, and election petitions." },
      { q: "What is a Flying Squad?", a: "Flying Squads are mobile teams deployed during elections to enforce the Model Code of Conduct. They monitor campaign activities, check for illegal cash/liquor distribution, and respond to complaints. Each constituency has multiple Flying Squads with video recording equipment." },
      { q: "What is the Anti-Defection Law?", a: "The Anti-Defection Law (10th Schedule of the Constitution, added by the 52nd Amendment in 1985) disqualifies elected members who voluntarily give up party membership or vote against their party's direction. However, if 2/3rds of members merge with another party, it's not considered defection." },
    ],
  },
  {
    category: "Special Categories",
    faqs: [
      { q: "Can NRIs vote in Indian elections?", a: "Yes, NRIs with valid Indian passports can register as overseas electors using Form 001 on the NVSP portal. However, they must currently vote in person at their registered constituency. Postal voting for NRIs is being considered." },
      { q: "How do persons with disabilities vote?", a: "The ECI ensures accessible polling stations with ramps, ground-floor booths, wheelchairs, Braille-enabled EVMs, and the option to bring a companion for assistance. Special transport may also be arranged." },
      { q: "Can homeless persons vote?", a: "Yes. Homeless persons can register to vote by providing the address of a shelter or their usual place of stay. The ECI has special drives to register homeless voters through Systematic Voters' Education and Electoral Participation (SVEEP) programs." },
      { q: "Can transgender persons vote?", a: "Absolutely. Transgender persons can register as 'third gender' on the voter registration form. The ECI recognises the third gender category following the Supreme Court's NALSA judgment (2014)." },
      { q: "What about senior citizens and very old voters?", a: "Voters above 80 years and persons with 40%+ disability can apply for postal ballot facility. The ECI also deploys special teams and provides priority service at polling stations for senior citizens." },
      { q: "Can prisoners vote?", a: "No. Under Section 62(5) of the Representation of the People Act, 1951, persons in prison (whether convicted or undertrial) cannot vote. However, persons on bail or those released on parole can vote. Preventive detention also bars voting." },
      { q: "Can members of the armed forces vote?", a: "Yes. Armed forces personnel are classified as 'Service Voters'. They can register using Form 2 and can vote either through postal ballot or by appointing a proxy. Their spouse can also register as a service voter." },
      { q: "What provisions exist for migrant workers?", a: "Currently, migrant workers must return to their registered constituency to vote. The ECI has been exploring remote voting solutions for domestic migrants. Some states arrange special transport. Workers should update their voter registration if they've shifted permanently." },
    ],
  },
  {
    category: "After the Election",
    faqs: [
      { q: "How can I check election results?", a: "Results are available in real-time on the ECI website (results.eci.gov.in) during counting day. They are also broadcast on news channels and published in newspapers the following day." },
      { q: "Can I challenge election results?", a: "Yes. Any candidate or elector can file an election petition in the High Court within 45 days of the result declaration. Grounds include corrupt practices, non-compliance with election law, or improper nomination handling." },
      { q: "What happens if a by-election is needed?", a: "By-elections are held when a seat falls vacant due to death, resignation, or disqualification of the elected representative. The ECI announces by-election dates, and the same full election process is followed for that constituency." },
      { q: "How do I hold my elected representative accountable?", a: "Attend public grievance sessions, write to your MP/MLA, use the Parliament/Assembly question mechanisms, track their performance on platforms like PRS Legislative Research, and most importantly — vote in the next election based on their performance." },
      { q: "How is vote counting done?", a: "Counting takes place at designated counting centres under heavy security. Each round covers votes from one or more booths. EVM results are displayed on a counting board. VVPAT slips from 5 randomly selected booths per constituency are manually counted and matched with EVM results." },
      { q: "What is a recount?", a: "A candidate or their agent can request a recount if they believe there's an error. The Returning Officer can allow it if they find the request reasonable. The request must be made before the result is declared. In case of VVPAT, physical slips can be counted." },
    ],
  },
  {
    category: "Political Parties & Candidates",
    faqs: [
      { q: "How is a political party registered in India?", a: "A party must apply to the ECI under Section 29A of the Representation of the People Act, 1951. The application must include the party constitution, membership of at least 100 members, and a processing fee. The ECI verifies and grants registration." },
      { q: "What is the difference between a national and state party?", a: "A national party must be recognised in at least 4 states (securing 6% votes + 2 seats, or winning 2% of Lok Sabha seats from 3+ states, or recognition as state party in 4+ states). A state party needs 6% votes + 2 seats in the state assembly, or similar criteria at state level." },
      { q: "How are election symbols allotted?", a: "National and state parties get reserved symbols. Registered unrecognised parties and independents choose from the ECI's free symbols list. Symbols are allotted by the Returning Officer for independent candidates on a first-come, first-served basis." },
      { q: "What is the maximum election expenditure allowed?", a: "For Lok Sabha: ₹95 lakh in larger states and ₹75 lakh in smaller states. For Vidhan Sabha: ₹40 lakh in larger states and ₹28 lakh in smaller states (limits revised in 2022). Candidates must maintain detailed accounts and submit them within 30 days of results." },
      { q: "Can a candidate contest from multiple constituencies?", a: "Yes, a candidate can contest from a maximum of 2 constituencies. If they win both, they must vacate one seat within 14 days, which then requires a by-election at public expense." },
      { q: "What are the qualifications to contest elections?", a: "For Lok Sabha: Indian citizen, minimum 25 years old, registered voter. For Rajya Sabha: minimum 30 years old. Disqualifications include undischarged insolvency, unsound mind, non-Indian citizenship, holding office of profit, and conviction for certain offences." },
      { q: "What is a nomination and how does it work?", a: "Candidates file nomination papers with the Returning Officer during the nomination period. They must submit personal details, affidavit of assets and criminal cases, and a security deposit (₹25,000 for general, ₹12,500 for SC/ST for Lok Sabha). Nominations are scrutinised and invalid ones rejected." },
    ],
  },
  {
    category: "Types of Elections in India",
    faqs: [
      { q: "What are the different types of elections in India?", a: "India conducts: Lok Sabha (Parliament) elections, Vidhan Sabha (State Assembly) elections, Rajya Sabha elections (by state MLAs), Presidential and Vice-Presidential elections (by Electoral College), Municipal/Panchayat elections (by State Election Commissions), and By-elections for vacant seats." },
      { q: "How often are general elections held?", a: "Lok Sabha elections are held every 5 years unless dissolved earlier. State Assembly elections also follow a 5-year cycle but may not coincide with Lok Sabha elections. The President can dissolve the Lok Sabha on the advice of the Prime Minister." },
      { q: "What is the difference between Lok Sabha and Rajya Sabha elections?", a: "Lok Sabha members are directly elected by citizens through universal adult suffrage. Rajya Sabha members are elected by elected members of State Legislative Assemblies through a single transferable vote system. Rajya Sabha members serve 6-year terms with 1/3rd retiring every 2 years." },
      { q: "What are Panchayat elections?", a: "Panchayat elections are held for local self-governance in rural areas at three levels: Gram Panchayat (village), Panchayat Samiti (block), and Zila Parishad (district). They are conducted by State Election Commissions under the 73rd Constitutional Amendment." },
      { q: "What are Municipal elections?", a: "Municipal elections are held for urban local bodies — Municipal Corporations (large cities), Municipal Councils (smaller cities), and Nagar Panchayats (transitional areas). Conducted by State Election Commissions under the 74th Constitutional Amendment." },
    ],
  },
  {
    category: "Digital Tools & Helpline",
    faqs: [
      { q: "What is the Voter Helpline number?", a: "1950 is the toll-free Voter Helpline number. It's available 24/7 for queries about voter registration, polling stations, complaints, and general election information. You can also WhatsApp on the same number in some states." },
      { q: "What is the Voter Helpline App?", a: "It's the official ECI app available on Android and iOS. Features include: search your name in voter list, apply for new registration/correction, find polling station, report violations, receive election notifications, and access candidate information." },
      { q: "What is the NVSP portal?", a: "National Voter Service Portal (nvsp.in) is the ECI's online platform for voter services. You can register, transfer, correct details, check voter list, download e-EPIC, track applications, and search electoral rolls — all from your computer or phone." },
      { q: "What is e-EPIC?", a: "e-EPIC is the digital/electronic version of your Voter ID card. You can download it from the NVSP portal or Voter Helpline App. It's a secure PDF with a QR code that can be stored on your phone and is accepted as valid ID for voting." },
      { q: "What is the Know Your Candidate (KYC) app?", a: "The Saksham app by ECI allows voters to view the affidavit details of candidates contesting in their constituency. You can see their criminal history, assets, liabilities, educational qualifications, and profession." },
      { q: "How can I file a complaint about election violations?", a: "Use the cVIGIL app to report violations with photos/videos (responded within 100 minutes). You can also call 1950, visit the District Election Officer, email the State CEO, or file complaints on the ECI website." },
    ],
  },
  {
    category: "Constitution & Fundamental Rights",
    faqs: [
      { q: "Is voting a fundamental right in India?", a: "Voting is a constitutional right (Article 326) and a statutory right under the Representation of the People Act, but it is NOT classified as a fundamental right under Part III of the Constitution. However, it is considered one of the most important democratic rights." },
      { q: "What is Article 324 of the Constitution?", a: "Article 324 vests the superintendence, direction, and control of all elections in India in the Election Commission. It gives the ECI broad powers to ensure free and fair elections, including the power to postpone or countermand elections." },
      { q: "What is Article 326?", a: "Article 326 provides for adult suffrage — elections to the Lok Sabha and State Assemblies shall be on the basis of adult suffrage, meaning every citizen who is 18+ years and not disqualified is entitled to be registered as a voter." },
      { q: "What is universal adult suffrage?", a: "Universal adult suffrage means every adult citizen (18+) has the right to vote regardless of caste, creed, religion, gender, education, or economic status. India adopted it from the very first election in 1951-52, unlike many Western democracies that expanded suffrage gradually." },
      { q: "Can my right to vote be taken away?", a: "Yes, in specific circumstances: if you're declared of unsound mind by a court, convicted and in prison, disqualified for corrupt practices, or if you're not a citizen of India. Being in debt, being uneducated, or being homeless does NOT disqualify you." },
    ],
  },
];

const FAQPage = () => {
  const { getContent, getJsonContent } = usePageContent("faq");
  const cmsFaqData = getJsonContent("faq_data", faqCategories);

  return (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 bg-background">
      <div className="container max-w-4xl">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">FAQ</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-3 text-foreground">
          {getContent("page_title", "Frequently Asked Questions")}
        </h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-2xl leading-relaxed">
          {getContent("page_desc", "Comprehensive answers to the most common questions about voting, elections, and democratic participation in India.")}
        </p>
      </div>
    </section>

    <section className="pb-20 bg-background">
      <div className="container max-w-4xl space-y-12">
        {cmsFaqData.map((cat: any, i: number) => (
          <div key={i}>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">{cat.category}</h2>
            <Accordion type="multiple" className="space-y-3">
              {cat.faqs.map((faq: any, j: number) => (
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

    <FeedbackSection />
      <FooterSection />
  </div>
  );
};

export default FAQPage;
