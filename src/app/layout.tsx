import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Stylefolks",
  description: "Fashion community",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto max-w-2xl px-4">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
