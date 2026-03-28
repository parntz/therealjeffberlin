import Link from "next/link";

export default function LessonSuccessPage() {
  return (
    <main className="page-shell">
      <section className="section-grid lesson-success">
        <div className="section-heading">
          <p className="eyebrow">Lesson Request Sent</p>
          <h1>Jeff&apos;s team now has your request.</h1>
          <p>
            Your date, time slot, and lesson details were submitted
            successfully. Expect follow-up at the email address you provided.
          </p>
        </div>
        <div className="lesson-success-actions">
          <Link href="/lessons" className="button button-primary">
            Back To Lessons
          </Link>
          <Link href="/music" className="button button-secondary">
            Explore The Music
          </Link>
        </div>
      </section>
    </main>
  );
}
