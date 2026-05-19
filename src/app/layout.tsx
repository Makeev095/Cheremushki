import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "ООО «УК Черёмушки» — официальный сайт",
    template: "%s · УК Черёмушки",
  },
  description:
    "Управляющая компания в Пятигорске: график работы, контакты, передача показаний приборов учёта.",
  metadataBase: new URL("https://cheremushki.online"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="relative flex min-h-full flex-col font-sans text-emerald-950 antialiased">
        <div
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[url('/bg-spring-blossoms.png')] bg-cover bg-[center_20%] sm:bg-center" />
          <div className="absolute inset-0 bg-slate-900/8" />
          <div className="absolute inset-0 bg-[#f6faf7]/62" />
        </div>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
