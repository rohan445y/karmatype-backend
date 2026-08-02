import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ThemeApplier } from '@/components/layout/ThemeApplier';
import { AppProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Karma Type - Improve Your Typing. Earn Rewards.',
  description: 'Karma Type is a premium typing platform with gamification, memberships, rewards, wallets, and leaderboards. Earn real financial rewards while building lightning WPM speed.',
  keywords: 'typing speed test, earn rewards typing, wpm test, nepali typing, monkeytype alternative, esewa withdrawal typing',
  openGraph: {
    title: 'Karma Type - Improve Your Typing. Earn Rewards.',
    description: 'Modern, high-performance typing platform with gamification and real financial rewards.',
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
        <meta name="monetag" content="440f295d90f97d764ffc8246c3b1ee0c" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-[#09090B] text-[#F4F4F5]">
        <AppProvider>
          <ThemeApplier />
          <div>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              {children}
            </main>
          </div>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
