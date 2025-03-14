'use client';

import { useState, useEffect } from 'react';
import Settings from './Settings';
import { SettingsProvider, useSettingsContext } from '../contexts/SettingsContext';

interface ClientLayoutProps {
  children: React.ReactNode;
}

function ClientLayoutContent({ children }: ClientLayoutProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { settings } = useSettingsContext();

  // Aplicar tema
  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = settings.theme === 'system' ? systemTheme : settings.theme;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Botão de configurações */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Modal de configurações */}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SettingsProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </SettingsProvider>
  );
} 