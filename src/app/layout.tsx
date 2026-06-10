import type { Metadata } from "next";
import { Prompt, Kanit, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const promptFont = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  display: "swap",
});

const kanitFont = Kanit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
  display: "swap",
});

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sanook on tour — เที่ยวสนุก ทุกทริป ทัวร์ไทยและต่างประเทศ",
  description: "จองแพ็กเกจทัวร์สุดพรีเมียมในประเทศและต่างประเทศกับ Sanook on tour บริษัททัวร์ยุคใหม่ บริการอบอุ่น เที่ยวสนุก ทุกการเดินทาง",
  keywords: ["ทัวร์ต่างประเทศ", "ทัวร์ในประเทศ", "จองทัวร์", "Sanook on tour", "บริษัททัวร์", "เที่ยวต่างประเทศ"],
  openGraph: {
    title: "Sanook on tour — เที่ยวสนุก ทุกทริป",
    description: "จองแพ็กเกจทัวร์สุดพรีเมียมในประเทศและต่างประเทศกับ Sanook on tour บริการอบอุ่น เที่ยวสนุก ทุกการเดินทาง",
    url: "https://sanook-on-tour.com",
    siteName: "Sanook on tour",
    locale: "th_TH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${promptFont.variable} ${kanitFont.variable} ${interFont.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/line-seed-sans-th/index.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/line-seed-sans-th/500.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/line-seed-sans-th/700.css" />
      </head>
      <body className="min-h-full flex flex-col bg-bg-base text-text-base">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1E293B",
              color: "#FFFFFF",
              fontFamily: "var(--font-prompt)",
            },
          }}
        />
      </body>
    </html>
  );
}
