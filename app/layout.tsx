import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { ShopProvider } from "@/components/Shop";
import { Header, Footer } from "@/components/Shell";
import { Contact } from "@/components/Contact";
import "./globals.css";
const serif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});
const sans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: { default: "Barkat · Home decor & gifting", template: "%s · Barkat" },
  description:
    "Make room for abundance. Discover Barkat home decor, thoughtful gifting, pearl-wax candles and expressive vessels.",
  robots: {
    index: process.env.NEXT_PUBLIC_LAUNCH_READY === "true",
    follow: true,
  },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={serif.variable + " " + sans.variable}>
      <body>
        <ShopProvider>
          <a className="skip" href="#main">
            Skip to content
          </a>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
            <Contact />
          </main>
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}
