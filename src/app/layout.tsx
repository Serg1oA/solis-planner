import type { Metadata } from "next";
import { JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";

const sora = Sora({ subsets: ["latin"], variable: "--font-body" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code" });

export const metadata: Metadata = {
  title: "Solis Planner",
  description: "Manage your projects end to end",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
