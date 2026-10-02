import "./globals.css";
import SiteShell from "../components/SiteShell";
import AuthProvider from "../components/AuthProvider";
import { TriangleFX } from "../components/BackgroundFX";

export const metadata = {
  title: "BID — Collect. Discover. Bid.",
  description: "A dark-space marketplace concept for collectibles and auctions."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="starfield" aria-hidden="true" />
        <TriangleFX />

        <AuthProvider>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}
