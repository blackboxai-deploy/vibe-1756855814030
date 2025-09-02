import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Notion-like Productivity App',
  description: 'A modern productivity app with block-based editing, AI integration, and collaborative features.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <WorkspaceProvider>
            <div className="h-screen flex overflow-hidden bg-background">
              {children}
            </div>
            <Toaster />
          </WorkspaceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}