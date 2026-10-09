import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Stellar Threads — Global Fashion Finance & Trade Protocol',
  description:
    'From design to ownership, powered by Stellar. Connecting independent fashion designers, clothing brands, manufacturers, and buyers through transparent, non-custodial blockchain commerce.',
  keywords: [
    'Stellar',
    'Fashion Finance',
    'Blockchain',
    'XLM',
    'Freighter Wallet',
    'Soroban',
    'Garment Passport',
    'Trade Protocol',
  ],
  authors: [{ name: 'Stellar Threads Protocol' }],
  openGraph: {
    title: 'Stellar Threads — Global Fashion Finance & Trade Protocol',
    description: 'From design to ownership, powered by Stellar.',
    url: 'https://github.com/Stellar-Threads',
    siteName: 'Stellar Threads',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}
    >
      <body className="min-h-screen bg-[#08090b] text-zinc-100 antialiased flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#f7e7a9]">
        {children}
      </body>
    </html>
  );
}
