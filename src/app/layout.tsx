import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner"; // 1. Importe o Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EPD Certification",
  description: "EPD Certification Frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster richColors /> {/* 2. Adicione o Toaster aqui */}
        </AuthProvider>
      </body>
    </html>
  );
}