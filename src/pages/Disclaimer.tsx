import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const Disclaimer = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-muted/50">
      <div className="container max-w-4xl text-center">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Legal</span>
        <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 text-foreground">Disclaimer</h1>
        <p className="mt-4 text-muted-foreground text-lg">Last updated: April 2026</p>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-4xl">
        <div className="space-y-8 text-muted-foreground leading-relaxed text-sm">

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">Non-Partisan Declaration</h2>
            <p>Matdaan is an independent, non-partisan, and non-governmental civic education initiative. We are <strong className="text-foreground">not affiliated</strong> with, endorsed by, or connected to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>The Election Commission of India (ECI)</li>
              <li>Any political party (national, state, or regional)</li>
              <li>Any government ministry, department, or agency</li>
              <li>Any political candidate or elected representative</li>
              <li>Any lobbying group or political action committee</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">Information Accuracy</h2>
            <p>The information provided on this platform is for <strong className="text-foreground">general informational and educational purposes only</strong>. While we make every effort to ensure accuracy:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Electoral data, constituency information, and candidate profiles are compiled from publicly available sources including ECI records and MyNeta.info (Association for Democratic Reforms)</li>
              <li>Candidate financial and criminal data is based on self-declared affidavits and may not be exhaustive</li>
              <li>Information may contain inadvertent errors, omissions, or may not reflect the most recent updates</li>
              <li>Always verify critical information with official sources: <a href="https://www.eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-foreground underline">eci.gov.in</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">No Legal or Professional Advice</h2>
            <p>Content on this platform does not constitute legal, political, or professional advice. Information about constitutional provisions, election laws, and voter rights is provided for educational purposes. For specific legal matters related to elections, consult a qualified legal professional or contact the Election Commission directly.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">AI-Generated Content</h2>
            <p>Certain features on our platform, including the Voting Assistant chatbot and translation services, use artificial intelligence (AI) models. AI-generated responses:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>May not always be accurate or up-to-date</li>
              <li>Should not be considered authoritative or official</li>
              <li>Are for informational assistance only and do not represent the views of Matdaan</li>
              <li>Should be verified with official sources for critical decisions</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">Third-Party Links & Data Sources</h2>
            <p>Our platform may contain links to external websites and uses data from third-party sources. We are not responsible for the content, accuracy, or privacy practices of external sites. Third-party data sources include:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Election Commission of India (eci.gov.in)</li>
              <li>MyNeta.info — Association for Democratic Reforms (ADR)</li>
              <li>National Informatics Centre (NIC)</li>
              <li>Various state election commission websites</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">No Influence on Voting</h2>
            <p>Matdaan does not endorse, support, or oppose any political party, candidate, or ideology. Our mission is solely to educate and empower voters. Any presentation of candidate data (including criminal records, assets, and education) is factual reporting from public affidavits and is not intended to influence voting decisions in favour of or against any candidate.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">Compliance with Indian Law</h2>
            <p>This platform operates in compliance with applicable Indian laws including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Information Technology Act, 2000 and IT Rules</li>
              <li>Digital Personal Data Protection Act, 2023</li>
              <li>Representation of the People Act, 1950 & 1951</li>
              <li>Indian Penal Code (BNS) provisions on defamation and hate speech</li>
              <li>Election Commission's Model Code of Conduct (during election periods)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">Grievance Redressal</h2>
            <p>If you believe any content on this platform is inaccurate, misleading, or violates any law, please contact our Grievance Officer:</p>
            <p className="mt-2"><strong className="text-foreground">Email:</strong> editor@matdaan.com</p>
            <p><strong className="text-foreground">Phone:</strong> +91 9009036633</p>
            <p className="mt-2">We will acknowledge your complaint within 24 hours and endeavour to resolve it within 15 days as per IT Rules, 2021.</p>
          </div>
        </div>
      </div>
    </section>
    <FooterSection />
  </div>
);

export default Disclaimer;
