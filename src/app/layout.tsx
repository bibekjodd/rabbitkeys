import Header from '@/components/layouts/header';
import GlowingBackGround from '@/components/utils/glowing-background';
import Invitation from '@/components/utils/invitation';
import QueryProvider from '@/providers/query-provider';
import Workers from '@/workers';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const title = 'Rabbitkeys';
const description = 'Realtime single/multiplayer typeracing web app';
const ogImage = 'https://i.postimg.cc/J0TK1wxX/og-rabbitkeys.png';
const siteUrl = 'https://rabbitkeys.vercel.app';

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: 'Bibek Bhattarai', url: 'https://x.com/bibekjodd' }],

  openGraph: {
    title,
    siteName: title,
    type: 'website',
    url: siteUrl,
    description,
    images: [ogImage]
  },

  twitter: {
    title,
    site: siteUrl,
    description,
    card: 'summary_large_image',
    images: [ogImage]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        id="body"
        className={`${inter.className} flex min-h-screen flex-col bg-neutral-900 text-white`}
      >
        <QueryProvider>
          <Toaster toastOptions={{ duration: 3000 }} closeButton richColors theme="dark" />
          <GlowingBackGround />
          <Invitation />
          <Suspense>
            <Workers />
          </Suspense>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
