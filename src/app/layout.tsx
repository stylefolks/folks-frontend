import type { Metadata } from "next";
import localFont from "next/font/local";
import MSWProvider from "@/mocks/MSWProvider";
import "./globals.css";

const pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/Pretendard-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Stylefolks",
  description: "Fashion community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable} antialiased`}>
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  );
}
