import Header from '@/components/layouts/header';
import GlowingBackGround from '@/components/utils/glowing-background';
import Invitation from '@/components/utils/invitation';
import QueryProvider from '@/providers/query-provider';
import Workers from '@/workers';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Rabbitkeys'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className}bg-neutral-900 flex min-h-screen flex-col text-white`}>
        <QueryProvider>
          <Toaster toastOptions={{ duration: 3000 }} closeButton richColors theme="dark" />
          <GlowingBackGround />
          <Invitation />
          <Workers />
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
