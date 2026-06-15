import type { Metadata } from 'next';
import './globals.css';
import AppProvider from '../components/providers/app-provider';

export const metadata: Metadata = {
  title: 'DataHub',
  description: 'Sistema londrinet',
  icons: {
    icon: '/images/icon.png',
    shortcut: '/images/icon.png',
    apple: '/images/icon.png',
  },
  manifest: '/manifest',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='pt-br' suppressHydrationWarning>
      <body className={`antialiased bg-background`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
