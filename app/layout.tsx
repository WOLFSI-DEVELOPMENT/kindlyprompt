import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { PersonalIntelligenceModal } from '@/components/pi-modal';

export const metadata: Metadata = {
  title: 'Kindly Prompt',
  description: 'Kindly Prompt',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <PersonalIntelligenceModal />
        {children}
      </body>
    </html>
  );
}
