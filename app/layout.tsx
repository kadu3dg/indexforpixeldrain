import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pixeldrain Album Manager',
  description: 'Gerencie seus álbuns e arquivos no Pixeldrain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
} 