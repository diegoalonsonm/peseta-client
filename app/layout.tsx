import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./components/Layout"; 

const gabarito = Gabarito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Peseta",
  description: "The best way for you to have control over your money.",
  keywords: "cash, controller, money, control, finance, budget, expenses, savings",
  // manifest: "/manifest.json",
  icons: {
    apple: "/icon.png",
  }
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode}>) {
  return (
    <Layout lang="en" className={gabarito.className}>
      {children}
    </Layout>
  );
}
