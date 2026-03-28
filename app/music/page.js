import { MusicSection } from "../../components/site-sections";

export const metadata = {
  title: "Music | Jeff Berlin",
  description: "Albums, sessions, and musical highlights from Jeff Berlin."
};

export default function MusicPage() {
  return (
    <main className="page-shell">
      <MusicSection />
    </main>
  );
}
