import type {Metadata, Viewport} from 'next';
import Script from 'next/script';
import { SentryInit } from '@/components/sentry-init';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Kindly Prompt',
  description: 'An AI workspace to generate detailed prompts, design documents, and agent skills from simple ideas for coding tools.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Kindly Prompt',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: 'https://res.cloudinary.com/dwthgcx5j/image/upload/v1794336717/oval_crop_image_x2gozu.png',
  },
  verification: {
    google: 'tATIrsF72UQBWH_gtmI1elVZvcWQzhp_r9d-8XDG-kE',
  },
};

export const viewport: Viewport = {
  themeColor: '#070707',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DD2W9RHRVB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DD2W9RHRVB');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <SentryInit />
        {children}
      </body>
    </html>
  );
}
