import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import "./styles/custom-bootstrap.scss";
import "./globals.css";
import Layout from "./components/Layout"; 

const gabarito = Gabarito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Peseta",
  description: "The best way for you to have control over your money.",
  keywords: "cash, controller, money, control, finance, budget, expenses, savings",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode}>) {
  return (
    <Layout lang="en" className={gabarito.className}>
      {children}
    </Layout>
  );
}
