import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Preloader from '@/components/Preloader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CSSBattle – Code & Battle',
  description: 'Replicate target designs using only HTML & CSS. Compete in real-time coding challenges.',
  keywords: ['CSS', 'HTML', 'coding challenge', 'web development', 'battle'],
  openGraph: {
    title: 'CSSBattle – Code & Battle',
    description: 'Replicate targets using HTML & CSS. The shorter your code, the higher you score.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-battle-bg text-battle-text antialiased`}>
        <AuthProvider>
          <Preloader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
