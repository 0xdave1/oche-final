import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SICT Solar PV Load Analysis & Sizing Suite",
  description: "Electrical load analysis and PV sizing dashboard for SICT, FUT Minna",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
