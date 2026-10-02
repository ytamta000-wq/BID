import "./globals.css";
import SiteShell from "../components/SiteShell";

export const metadata = {
  title: "BID — Collect. Discover. Bid.",
  description: "A dark-space marketplace concept for collectibles and auctions."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="starfield" aria-hidden="true" />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}