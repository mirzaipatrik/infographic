import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Bahá'í Infographic Builder",
  description: "Create and share Bahá'í community infographics",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans antialiased text-stone-900 [font-family:var(--font-dm-sans),ui-sans-serif,system-ui,sans-serif]">
        {children}
      </body>
    </html>
  );
}
