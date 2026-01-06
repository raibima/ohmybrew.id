import type { Metadata } from "next";
import { Pacifico, Nunito } from "next/font/google";
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
  title: "Oh My Brew – Coming Soon",
  description:
    "Good quality specialty coffee at affordable prices. Coming soon to BSD, Tangerang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pacifico.variable} ${nunito.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
