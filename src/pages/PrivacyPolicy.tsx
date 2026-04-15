import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const PrivacyPolicy = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-muted/50">
      <div className="container max-w-4xl text-center">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Legal</span>
        <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 text-foreground">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground text-lg">Last updated: April 2026</p>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-4xl prose prose-neutral dark:prose-invert max-w-none">
        <div className="space-y-8 text-muted-foreground leading-relaxed text-sm">

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">1. Introduction</h2>
            <p>Matdaan ("we", "our", "us") is a non-partisan civic education platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website matdaan.com and use our services. We are committed to protecting your privacy in accordance with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023 (DPDPA).</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">2. Information We Collect</h2>
            <p className="font-semibold text-foreground mt-4">Personal Information:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Name, email address, and phone number (when you sign up or contact us)</li>
              <li>Profile information (display name, avatar)</li>
              <li>Volunteer application details (skills, experience, availability)</li>
            </ul>
            <p className="font-semibold text-foreground mt-4">Non-Personal Information:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Browser type, device information, IP address</li>
              <li>Pages visited, time spent, navigation patterns</li>
              <li>Game scores and quiz results</li>
              <li>Language preferences</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and maintain our civic education services</li>
              <li>To personalize your experience and content in your preferred language</li>
              <li>To process volunteer applications</li>
              <li>To send important updates about elections and voter registration</li>
              <li>To improve our platform and develop new features</li>
              <li>To comply with legal obligations under Indian law</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">4. Data Storage & Security</h2>
            <p>Your data is stored on secure cloud servers with encryption at rest and in transit. We implement industry-standard security measures including Row-Level Security (RLS) policies, secure authentication protocols, and regular security audits. We retain your personal data only for as long as necessary to fulfil the purposes outlined in this policy or as required by law.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">5. Data Sharing & Disclosure</h2>
            <p>We do <strong className="text-foreground">not</strong> sell, trade, or rent your personal information to any third party. We may share information only:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations, court orders, or government requests under Indian law</li>
              <li>To protect the rights, property, or safety of Matdaan and its users</li>
              <li>With service providers who assist in operating our platform (bound by confidentiality agreements)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">6. Political Neutrality & Data Use</h2>
            <p>As a non-partisan platform, we affirm that:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>We do <strong className="text-foreground">not</strong> use your data for political targeting, campaigning, or profiling</li>
              <li>We do <strong className="text-foreground">not</strong> share user data with any political party, candidate, or political organization</li>
              <li>Electoral data displayed on our platform is sourced from publicly available government records (Election Commission of India, MyNeta.info)</li>
              <li>We do not influence or attempt to influence voting behaviour</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">7. Your Rights (Under DPDPA 2023)</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-foreground">Right to Access:</strong> Request a summary of your personal data we hold</li>
              <li><strong className="text-foreground">Right to Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong className="text-foreground">Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong className="text-foreground">Right to Grievance Redressal:</strong> Lodge complaints regarding data processing</li>
              <li><strong className="text-foreground">Right to Nominate:</strong> Nominate another person to exercise your rights</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">8. Cookies</h2>
            <p>We use essential cookies for authentication and session management. We do not use tracking cookies for advertising. See our Cookie Policy for details.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">9. Children's Privacy</h2>
            <p>Our services are intended for citizens aged 18 and above (voting age in India). We do not knowingly collect personal data from individuals under 18. If we become aware of such collection, we will promptly delete the data.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of the platform after changes constitutes acceptance.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">11. Contact Us</h2>
            <p>For privacy-related queries or to exercise your rights, contact us at:</p>
            <p className="mt-2"><strong className="text-foreground">Email:</strong> editor@matdaan.com</p>
            <p><strong className="text-foreground">Phone:</strong> +91 9009036633</p>
          </div>
        </div>
      </div>
    </section>
    <FooterSection />
  </div>
);

export default PrivacyPolicy;
