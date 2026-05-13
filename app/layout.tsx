import type { Metadata } from "next";
import "./globals.css";
import AppProvider from "../components/providers/app-provider";

export const metadata: Metadata = {
  title: "Hotdata",
  description: "Gerenciador de Hotspots da Londrinet",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`antialiased bg-background`}
      >
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
