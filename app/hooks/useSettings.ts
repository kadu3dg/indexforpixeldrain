import { useState, useEffect } from 'react';

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  listView: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
  showFileSize: boolean;
  showUploadDate: boolean;
  showFileType: boolean;
}

const defaultSettings: Settings = {
  theme: 'system',
  listView: 'grid',
  sortBy: 'name',
  sortOrder: 'asc',
  showFileSize: true,
  showUploadDate: true,
  showFileType: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('pixeldrainSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('pixeldrainSettings', JSON.stringify(updated));
  };

  return { settings, updateSettings };
} 