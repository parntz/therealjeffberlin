import { BioSection } from "../../components/site-sections";

export const metadata = {
  title: "Bio | Jeff Berlin",
  description: "Biography and career highlights for Jeff Berlin."
};

export default function BioPage() {
  return (
    <main className="page-shell">
      <BioSection />
    </main>
  );
}
