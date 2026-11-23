import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localfont from 'next/font/local';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const blender = localfont({
  variable: '--font-blender',
  display: 'swap',
  src: [
    {
      path: '../assets//fonts/blender-pro/Blender Pro Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../assets//fonts/blender-pro/Blender Pro Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets//fonts/blender-pro/BlenderPro-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets//fonts/blender-pro/Blender Pro Heavy.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
});

export const metadata: Metadata = {
  title: 'FishEye Portfolio',
  description: 'My FishEye Portfolio',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${blender.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
