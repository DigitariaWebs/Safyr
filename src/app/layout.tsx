import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
