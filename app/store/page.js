import { StoreSection } from "../../components/site-sections";

export const metadata = {
  title: "Store | Jeff Berlin",
  description: "Shop Jeff Berlin Bass Mastery books and educational materials."
};

export default function StorePage() {
  return (
    <main className="page-shell">
      <StoreSection />
    </main>
  );
}
