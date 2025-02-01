import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ver facturas",
  description: "Todas las facturas generadas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-white text-center p-4">
        © 2025 Sistema de facturas. All rights reserved. | FsX
      </footer>
    </div>
  );
}
