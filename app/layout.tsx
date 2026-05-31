import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import NavBar from "./componentes/NavBar";
import { isAdminBuyer } from "@/lib/admin";
import { Climate_Crisis, Bricolage_Grotesque, Manrope } from 'next/font/google';
import Footer from "./componentes/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const climateCrisis = Climate_Crisis({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-climate',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata = {
  title: "Eventia",
  description: "La plataforma definitiva para organizar eventos, vender entradas y gestionar pagos de manera simple, segura y confiable.", // Descripción mejorada para SEO y claridad
  icons: {
    icon: "/icon.png", 
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const esAdmin = await isAdminBuyer();
  return (
    <html
      lang="es"
       className={`${climateCrisis.variable} ${bricolage.variable} ${manrope.variable} h-full antialiased`}
    >
      <ClerkProvider>
        <body className="min-h-full bg-white text-slate-900 flex flex-col">
          <NavBar esAdmin={esAdmin} />
          <main className="flex-1 min-w-0">{children}</main>
          <Footer />
        </body>
      </ClerkProvider>
    </html>
  );
}
