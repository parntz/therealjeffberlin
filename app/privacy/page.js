export const metadata = {
  title: "Privacy Policy | Jeff Berlin",
  description: "Privacy policy for the Jeff Berlin website."
};

export default function PrivacyPage() {
  const updatedOn = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date());

  return (
    <main className="legal-page">
      <div className="legal-shell">
        <p className="eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: {updatedOn}</p>

        <section>
          <h2>Overview</h2>
          <p>
            This Privacy Policy explains how information may be collected, used,
            and shared when you visit this website, submit a lesson inquiry,
            or schedule time through Calendly.
          </p>
        </section>

        <section>
          <h2>Information You Provide</h2>
          <p>
            Information you choose to submit may include your name, email
            address, lesson-booking details, and any information you include in
            messages or scheduling notes.
          </p>
        </section>

        <section>
          <h2>Automatically Collected Information</h2>
          <p>
            Basic technical data may be collected automatically, such as browser
            type, device information, IP address, referring pages, and general
            usage activity. This information may be used for security,
            analytics, and site performance.
          </p>
        </section>

        <section>
          <h2>How Information May Be Used</h2>
          <p>
            Information may be used to respond to inquiries, manage lesson
            requests, send transactional communications, improve site content
            and performance, and protect the site from misuse or unauthorized
            activity.
          </p>
        </section>

        <section>
          <h2>Scheduling</h2>
          <p>
            Scheduling may be handled through Calendly. Information submitted
            through that service is also governed by its own privacy practices
            and terms.
          </p>
        </section>

        <section>
          <h2>Cookies and Analytics</h2>
          <p>
            This site and connected services may use cookies, similar tracking
            technologies, or embedded third-party tools to remember
            preferences, support scheduling flows, and understand how visitors
            use the site.
          </p>
        </section>

        <section>
          <h2>Sharing of Information</h2>
          <p>
            Information may be shared with trusted service providers only as
            necessary to operate the website, process transactions, manage
            scheduling, maintain security, or comply with legal obligations.
            Information is not sold as part of the ordinary operation of this
            site.
          </p>
        </section>

        <section>
          <h2>Data Retention</h2>
          <p>
            Information may be retained for as long as reasonably necessary to
            provide services, maintain records, resolve disputes, comply with
            legal requirements, and enforce site policies.
          </p>
        </section>

        <section>
          <h2>Your Choices</h2>
          <p>
            You may choose not to submit personal information, although some
            features such as booking lessons may not work without it.
            Depending on your location, you may also have rights to request
            access to, correction of, or deletion of certain personal
            information.
          </p>
        </section>

        <section>
          <h2>Children&apos;s Privacy</h2>
          <p>
            This site is not intended to knowingly collect personal information
            from children without appropriate authorization. If you believe
            information from a child has been submitted improperly, contact the
            site operator through official channels so it can be reviewed.
          </p>
        </section>

        <section>
          <h2>Policy Changes</h2>
          <p>
            This Privacy Policy may be updated from time to time. Changes become
            effective when posted on this page, and the updated date above will
            reflect the latest revision.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            For privacy questions related to this site, use Jeff Berlin&apos;s
            official contact or booking channels referenced throughout the site.
          </p>
        </section>
      </div>
    </main>
  );
}
