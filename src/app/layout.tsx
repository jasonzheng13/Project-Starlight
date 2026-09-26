import type { Metadata } from "next";
import { UiSounds } from "../features/audio/ui-sounds";
import "./globals.css";
import "./jean-theme.css";
import "./music-controls.css";
import "./constellation-menu.css";
import "./zhongli-theme.css";
import "./chapter-transition.css";
import "./character-themes.css";
import "./gallery.css";
import "./start-screen.css";

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
      <body>
        <UiSounds>{children}</UiSounds>
      </body>
    </html>
  );
}
