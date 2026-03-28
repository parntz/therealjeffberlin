import "./globals.css";

export const metadata = {
  title: "Jeff Berlin | Bass Visionary",
  description:
    "Bold official-style website for Jeff Berlin featuring biography, lessons, music, and a Stripe-powered store."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
