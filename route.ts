import type {Metadata} from 'next';
import Script from 'next/script';
import { SentryInit } from '@/components/sentry-init';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Kindly Prompt',
  description: 'An AI workspace to generate detailed prompts, design documents, and agent skills from simple ideas for coding tools.',
  icons: {
    icon: 'https://i.ibb.co/WL4x4zC/AI-text-generation-app-icon-202605140740-modified.png',
  },
  verification: {
    google: 'tATIrsF72UQBWH_gtmI1elVZvcWQzhp_r9d-8XDG-kE',
  },
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
