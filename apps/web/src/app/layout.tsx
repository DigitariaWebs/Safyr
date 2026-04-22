import type { Metadata } from "next";
import { Aldrich, Space_Grotesk } from "next/font/google";
import "./globals.css";

const aldrich = Aldrich({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Safyr - HR Platform",
  description: "Complete HR platform for security companies",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark overflow-x-hidden">
      <body
        className={`${aldrich.variable} ${spaceGrotesk.variable} antialiased overflow-x-hidden font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
