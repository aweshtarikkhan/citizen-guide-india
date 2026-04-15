import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const CookiePolicy = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-muted/50">
      <div className="container max-w-4xl text-center">
        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Legal</span>
        <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 text-foreground">Cookie Policy</h1>
        <p className="mt-4 text-muted-foreground text-lg">Last updated: April 2026</p>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-4xl">
        <div className="space-y-8 text-muted-foreground leading-relaxed text-sm">

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your browsing experience.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">Cookies We Use</h2>
            <div className="mt-4 border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 font-display font-bold text-foreground text-xs">Type</th>
                    <th className="p-3 font-display font-bold text-foreground text-xs">Purpose</th>
                    <th className="p-3 font-display font-bold text-foreground text-xs">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Essential</td>
                    <td className="p-3">Authentication, session management, security tokens</td>
                    <td className="p-3">Session / 7 days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Functional</td>
                    <td className="p-3">Language preference, font settings, theme choice</td>
                    <td className="p-3">1 year</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Performance</td>
                    <td className="p-3">Page load analytics, error monitoring (anonymized)</td>
                    <td className="p-3">30 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">What We Do NOT Use</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-foreground">No advertising cookies</strong> — we do not serve ads</li>
              <li><strong className="text-foreground">No third-party tracking cookies</strong> — we do not track you across other websites</li>
              <li><strong className="text-foreground">No political profiling cookies</strong> — we do not build political preference profiles</li>
              <li><strong className="text-foreground">No data sale</strong> — cookie data is never sold to third parties</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">Local Storage</h2>
            <p>In addition to cookies, we use browser Local Storage to save:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Your selected language preference</li>
              <li>Font customization settings</li>
              <li>Game progress (for the 404 space shooter)</li>
            </ul>
            <p className="mt-2">This data stays on your device and is never transmitted to our servers.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">Managing Cookies</h2>
            <p>You can control cookies through your browser settings:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong className="text-foreground">Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li><strong className="text-foreground">Firefox:</strong> Settings → Privacy & Security → Cookies</li>
              <li><strong className="text-foreground">Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong className="text-foreground">Edge:</strong> Settings → Cookies and Site Permissions</li>
            </ul>
            <p className="mt-2">Note: Disabling essential cookies may affect your ability to log in and use certain features.</p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-3">Contact</h2>
            <p>For questions about our cookie practices:</p>
            <p className="mt-2"><strong className="text-foreground">Email:</strong> editor@matdaan.com</p>
          </div>
        </div>
      </div>
    </section>
    <FooterSection />
  </div>
);

export default CookiePolicy;
