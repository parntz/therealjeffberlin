import { notFound } from "next/navigation";
import PrivacyPage from "../../privacy/page";
import TermsPage from "../../terms/page";

export function generateStaticParams() {
  return [{ name: "privacy" }, { name: "terms" }];
}

export default async function LegalAliasPage({ params }) {
  const { name } = await params;

  if (name === "privacy") {
    return <PrivacyPage />;
  }

  if (name === "terms") {
    return <TermsPage />;
  }

  notFound();
}
