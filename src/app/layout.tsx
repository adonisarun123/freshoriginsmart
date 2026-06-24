import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ToastHost } from "@/components/ui/Toast";
import { RouteProgress } from "@/components/ui/RouteProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import { Suspense } from "react";
import {
  organizationJsonLd,
  websiteJsonLd,
  localBusinessJsonLd,
} from "@/lib/seo/jsonld";

// Heading font: Bricolage Grotesque (modern, warm, characterful). Kept under the
// existing --font-fraunces variable name so all `font-display` usages map to it
// without touching every file.
const fraunces = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Traditional foods for healthier everyday living`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Traditional foods for healthier everyday living`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <JsonLd
          data={[
            organizationJsonLd(),
            websiteJsonLd(),
            localBusinessJsonLd(),
          ]}
        />
        <a href="#main" className="fo-skip-link">
          Skip to content
        </a>
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <AnnouncementBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ToastHost />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
