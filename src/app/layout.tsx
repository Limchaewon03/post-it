import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Post-it Todo List',
  description: 'Sticky note todo list web application with Google Sheets sync',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
