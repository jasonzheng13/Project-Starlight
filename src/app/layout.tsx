import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Starlight · Our constellation",
  description: "A little universe of moments worth keeping.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
