import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { cookies } from 'next/headers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const unifont = localFont({
  src: '../lib/assets/fonts/unifont-15.1.01.otf',
  variable: '--font-unifont',
});
const consolas = localFont({
  src: '../lib/assets/fonts/consolas.ttf',
  variable: '--font-consolas',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Thriving Techies',
  description: 'Thriving Techies',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();

  const theme = cookiesStore.get('theme');

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${unifont.variable} ${consolas.variable} ${theme?.value === 'dark' ? 'dark' : 'light'} antialiased`}
      style={{ colorScheme: theme?.value === 'dark' ? 'dark' : 'light' }}
    >
      <body>
        <div style={{ display: 'contents' }} id="__root">{children}</div>
      </body>
    </html>
  );
}
