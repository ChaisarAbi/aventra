import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Abi Prasetyo - Personal Portfolio',
  description: 'Personal portfolio website showcasing projects and skills',
  keywords: ['portfolio', 'developer', 'projects', 'web development'],
  authors: [{ name: 'Abi Prasetyo' }],
  creator: 'Abi Prasetyo',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aventra.my.id',
    title: 'Abi Prasetyo - Personal Portfolio',
    description: 'Personal portfolio website showcasing projects and skills',
    siteName: 'Abi Prasetyo Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abi Prasetyo - Personal Portfolio',
    description: 'Personal portfolio website showcasing projects and skills',
    creator: '@AbiPrasetyo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
