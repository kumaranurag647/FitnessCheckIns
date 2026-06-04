import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Prem",
  description: "Team Prem Client Check-Ins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}