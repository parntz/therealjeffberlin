import { LessonsSection, TestimonialsSection } from "../../components/site-sections";

export const metadata = {
  title: "Lessons | Jeff Berlin",
  description: "Book bass lessons and explore Jeff Berlin's teaching approach."
};

export default function LessonsPage() {
  return (
    <main className="page-shell">
      <LessonsSection />
      <TestimonialsSection />
    </main>
  );
}
