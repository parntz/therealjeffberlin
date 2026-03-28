export const metadata = {
  title: "Terms of Use | Jeff Berlin",
  description: "Terms of use for the Jeff Berlin website."
};

export default function TermsPage() {
  const updatedOn = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date());

  return (
    <main className="legal-page">
      <div className="legal-shell">
        <p className="eyebrow">Legal</p>
        <h1>Terms of Use</h1>
        <p className="legal-updated">Last updated: {updatedOn}</p>

        <section>
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using this website, you agree to these Terms of Use.
            If you do not agree, do not use the site.
          </p>
        </section>

        <section>
          <h2>Permitted Use</h2>
          <p>
            You may use this site for lawful personal or business purposes
            related to learning about Jeff Berlin, booking lessons, or
            reviewing educational materials. You may not use the site in a
            manner that disrupts operation, attempts unauthorized access, or
            violates applicable law.
          </p>
        </section>

        <section>
          <h2>Intellectual Property Rights</h2>
          <p>
            Site design, branding, text, images, and related materials are
            protected by applicable copyright and trademark law unless otherwise
            stated.
          </p>
        </section>

        <section>
          <h2>Educational Products and Services</h2>
          <p>
            Lessons, downloads, educational products, prices, availability, and
            product descriptions may change without notice. The site may correct
            errors, update information, or discontinue offers at any time.
          </p>
        </section>

        <section>
          <h2>Third-Party Platforms</h2>
          <p>
            Scheduling and certain embedded services may be provided by third
            parties including Calendly. Your use of those services may also be
            governed by their own terms, privacy policies, and operational
            rules.
          </p>
        </section>

        <section>
          <h2>No Professional Guarantee</h2>
          <p>
            Educational content, lessons, and materials are provided for musical
            development and informational purposes. Individual results vary, and
            no guarantee is made regarding artistic, professional, or financial
            outcomes.
          </p>
        </section>

        <section>
          <h2>Disclaimer</h2>
          <p>
            This site is provided on an as-available and as-is basis. To the
            fullest extent permitted by law, no warranties are made regarding
            uninterrupted availability, accuracy, merchantability, or fitness
            for a particular purpose.
          </p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, the site operator shall not
            be liable for indirect, incidental, consequential, special, or
            punitive damages arising from or related to use of this website,
            products, services, or third-party tools linked from it.
          </p>
        </section>

        <section>
          <h2>Indemnification</h2>
          <p>
            You agree not to hold the site operator liable for claims, losses,
            or costs arising from your misuse of the site, your violation of
            these Terms, or your infringement of any rights of another party.
          </p>
        </section>

        <section>
          <h2>Changes to These Terms</h2>
          <p>
            These Terms of Use may be updated from time to time. Continued use
            of the site after changes are posted constitutes acceptance of the
            revised Terms.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about these Terms of Use should be directed through Jeff
            Berlin&apos;s official contact or booking channels referenced on the
            site.
          </p>
        </section>
      </div>
    </main>
  );
}
