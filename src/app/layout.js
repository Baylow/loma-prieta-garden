import { Inter, Work_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Loma Prieta School Garden",
  description: "Promoting and supporting the Loma Prieta School Garden Project.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${workSans.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
