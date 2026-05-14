import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Kindly Prompt',
  description: 'An AI workspace to generate detailed prompts, design documents, and agent skills from simple ideas for coding tools.',
  icons: {
    icon: 'https://i.ibb.co/WL4x4zC/AI-text-generation-app-icon-202605140740-modified.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
