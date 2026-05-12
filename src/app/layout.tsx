import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solis Planner",
  description: "Manage your projects end to end",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}