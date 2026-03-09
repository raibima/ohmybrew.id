import type { Metadata } from "next";
import { Pacifico, Nunito } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const pacifico = Pacifico({
  weight: "400",
  variable: "--font-pacifico",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Oh My Brew — Kopi Specialty BSD, Tangerang | Order via GoFood & GrabFood",
  description:
    "Kopi specialty BSD & Tangerang — Oh My Brew. Rasa fruity & floral, harga terjangkau. Order online via GoFood & GrabFood. Lihat menu & pesan sekarang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      <head>
        <link rel="icon" type="image/png" href="/favicon/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="48x48" href="/favicon/favicon-48x48.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/favicon/favicon-72x72.png" />
        <link rel="apple-touch-icon" sizes="96x96" href="/favicon/favicon-96x96.png" />
        <link
          rel="apple-touch-icon"
          sizes="256x256"
          href="/favicon/favicon-256x256.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="384x384"
          href="/favicon/favicon-384x384.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/favicon/favicon-512x512.png"
        />
      </head>
      <body
        className={`${pacifico.variable} ${nunito.variable} flex min-h-screen flex-col antialiased`}
      >
        <SiteHeader />
        <div className="min-h-0 flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
