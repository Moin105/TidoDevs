import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tidodevs | Building Decentralized Futures & Intelligent Web Solutions",
  description: "Tidodevs delivers bespoke blockchain, AI, and full-stack web solutions. Incorporated with industry leaders to bring enterprise-grade technology to your business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
