import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Plus Jakarta Sans — enterprise-SaaS system font (per ui-ux-pro-max).
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thelontech.com"),
  title: {
    default: "Thelon Technologies — AI software studio",
    template: "%s · Thelon Technologies",
  },
  description:
    "Thelon Technologies designs, builds, and ships AI software, SaaS platforms, and custom systems end-to-end — from prototype to production. Based in Ontario, Canada.",
  keywords: [
    "AI software",
    "SaaS platforms",
    "custom software",
    "AI studio",
    "Ontario",
    "Thelon Technologies",
  ],
  openGraph: {
    title: "Thelon Technologies — AI software studio",
    description:
      "We build the AI products that move your business forward. AI software, SaaS platforms, and custom systems — prototype to production.",
    url: "https://thelontech.com",
    siteName: "Thelon Technologies",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thelon Technologies — AI software studio",
    description:
      "We build the AI products that move your business forward.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${bricolage.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-surface text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
