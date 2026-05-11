import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Geist,
  Geist_Mono,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { profile } from "@/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const metadataDescription =
  "Hassan Ansari — full-stack developer becoming a product manager. Six radically different presentations of the same case studies. Pick the one you trust.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hassanansari.dev"),
  title: {
    default: `${profile.name} — ${profile.tagline}`,
    template: `%s — ${profile.name}`,
  },
  description: metadataDescription,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: `${profile.name} — ${profile.tagline}`,
    description: metadataDescription,
    url: "/",
    siteName: profile.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${profile.name} — portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.tagline}`,
    description: metadataDescription,
    creator: "@incrediblezayed",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVariables = [
    geistSans.variable,
    geistMono.variable,
    jetbrainsMono.variable,
    fraunces.variable,
    instrumentSerif.variable,
  ].join(" ");

  return (
    <html lang="en" className={fontVariables}>
      <body>
        <ThemeProvider defaultTheme={profile.defaultTheme}>
          {children}
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
