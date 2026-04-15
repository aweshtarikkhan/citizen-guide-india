import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const TermsOfService = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-muted/50">
      <div className="container max-w-4xl text-center">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Legal</span>
        <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 text-foreground">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground text-lg">Last updated: April 2026</p>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-4xl">
        <div className="space-y-8 text-muted-foreground leading-relaxed text-sm">

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Matdaan (matdaan.com), you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the platform immediately. These terms are governed by the laws of India, including the Information Technology Act, 2000 and the Indian Contract Act, 1872.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">2. About the Platform</h2>
            <p>Matdaan is a non-partisan, non-governmental civic education platform that provides:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Voter education and awareness resources</li>
              <li>Information about electoral processes, constituencies, and candidates</li>
              <li>Tools for voter registration assistance</li>
              <li>Election-related news, timelines, and results</li>
              <li>Interactive civic engagement features</li>
            </ul>
            <p className="mt-2">Matdaan is <strong className="text-foreground">not affiliated</strong> with the Election Commission of India, any political party, government body, or candidate.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You must provide accurate and complete information during registration</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must be at least 18 years of age to create an account</li>
              <li>You are responsible for all activities conducted through your account</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">4. Acceptable Use</h2>
            <p>You agree <strong className="text-foreground">not</strong> to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Use the platform for any unlawful purpose or in violation of the Representation of the People Act, 1951</li>
              <li>Spread misinformation, hate speech, or content that incites violence or communal disharmony</li>
              <li>Impersonate any person, candidate, political party, or government official</li>
              <li>Use the platform for political campaigning, canvassing, or paid political promotion</li>
              <li>Attempt to manipulate, hack, or disrupt the platform's infrastructure</li>
              <li>Scrape, crawl, or extract data in bulk without written permission</li>
              <li>Violate any applicable Indian law including the IT Act, 2000 and IPC provisions</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">5. Content & Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>All original content, design, and code on Matdaan is owned by the Matdaan Initiative</li>
              <li>Electoral data is sourced from publicly available government records and is presented for informational purposes only</li>
              <li>Candidate information is sourced from affidavits filed with the Election Commission via MyNeta.info (Association for Democratic Reforms)</li>
              <li>You may share our content for non-commercial, educational purposes with proper attribution</li>
              <li>User-generated content (blog posts, comments) remains your intellectual property, but you grant us a licence to display it on the platform</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">6. Electoral Information Disclaimer</h2>
            <p>While we strive for accuracy, electoral and candidate data on Matdaan:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Is provided for <strong className="text-foreground">informational purposes only</strong> and should not be the sole basis for voting decisions</li>
              <li>May contain inadvertent errors or delays in updates</li>
              <li>Does not constitute official election data — always verify with the Election Commission of India (eci.gov.in)</li>
              <li>Candidate profiles are based on self-declared affidavits and may not reflect complete information</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">7. Limitation of Liability</h2>
            <p>Matdaan and its team shall not be liable for:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Any inaccuracies in electoral data, candidate information, or election results</li>
              <li>Decisions made based on information provided on this platform</li>
              <li>Service interruptions, technical failures, or data loss</li>
              <li>Actions of third-party services integrated with the platform</li>
              <li>Any indirect, incidental, or consequential damages arising from use of the platform</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">8. Model Code of Conduct Compliance</h2>
            <p>During election periods when the Model Code of Conduct (MCC) is in effect:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>We will comply with all ECI directives regarding online content</li>
              <li>We will not publish opinion polls or exit polls during the restricted period as per Section 126A of the RPA, 1951</li>
              <li>We will remove or modify content upon valid request from the Election Commission</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">9. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Matdaan, its team, contributors, and volunteers from any claims, damages, or expenses arising from your use of the platform or violation of these terms.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">10. Governing Law & Jurisdiction</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India. We encourage resolution through mediation before legal proceedings.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">11. Modifications</h2>
            <p>We reserve the right to modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the revised terms.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">12. Contact</h2>
            <p>For questions regarding these Terms, contact us at:</p>
            <p className="mt-2"><strong className="text-foreground">Email:</strong> editor@matdaan.com</p>
            <p><strong className="text-foreground">Phone:</strong> +91 9009036633</p>
          </div>
        </div>
      </div>
    </section>
    <FooterSection />
  </div>
);

export default TermsOfService;
