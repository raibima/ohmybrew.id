import type { Metadata } from "next";
import { Pacifico, Nunito } from "next/font/google";
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
  title: "Oh My Brew",
  description:
    "Good quality specialty coffee at affordable prices. Located in BSD, Tangerang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☕</text></svg>"
        />
      </head>
      <body className={`${pacifico.variable} ${nunito.variable} flex min-h-screen flex-col antialiased`}>
        <SiteHeader />
        <div className="min-h-0 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
