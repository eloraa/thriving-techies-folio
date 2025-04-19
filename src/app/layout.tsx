import type { Metadata } from 'next';
import { Geist_Mono, Noto_Color_Emoji } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { cookies } from 'next/headers';
import { ResolveTheme } from '@/components/main/client-handler/resolve-theme';
import React from 'react';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const segoeUI = localFont({
  src: [
    {
      path: '../fonts/segoe-ui/segoe-ui.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/segoe-ui/segoe-ui-italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/segoe-ui/segoe-ui-bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/segoe-ui/segoe-ui-bold-italic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../fonts/segoe-ui/segoe-ui-light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/segoe-ui/segoe-ui-light-italic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../fonts/segoe-ui/segoe-ui-semibold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/segoe-ui/segoe-ui-semibold-italic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../fonts/segoe-ui/segoe-ui-semilight.ttf',
      weight: '350',
      style: 'normal',
    },
    {
      path: '../fonts/segoe-ui/segoe-ui-semilight-italic.ttf',
      weight: '350',
      style: 'italic',
    },
    {
      path: '../fonts/segoe-ui/segoe-ui-black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../fonts/segoe-ui/segoe-ui-black-italic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-segoe-ui',
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

const emoji = Noto_Color_Emoji({
  variable: '--font-emoji',
  subsets: ['emoji'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'Thriving Techies',
  description: 'Thriving Techies',
};

export default async function RootLayout({
  children,
  user,
}: Readonly<{
  children: React.ReactNode;
  user: React.ReactNode;
}>) {
  const cookiesStore = await cookies();

  const theme = cookiesStore.get('theme');

  return (
    <html
      lang="en"
      className={`${segoeUI.variable} ${geistMono.variable} ${unifont.variable} ${consolas.variable} ${emoji.variable} ${segoeUI.variable} ${theme?.value === 'dark' ? 'dark' : 'light'} antialiased`}
      style={{ colorScheme: theme?.value === 'dark' ? 'dark' : 'light' }}
    >
      <body>
        <div style={{ display: 'contents' }} id="__root">
          <ResolveTheme theme={theme?.value === 'dark' ? 'dark' : 'light'} />
          {children}
          {user}
        </div>
      </body>
    </html>
  );
}
