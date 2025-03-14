import { FolderIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="mb-8">
      <div className="flex items-center space-x-4">
        <FolderIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pixeldrain Directory Index</h1>
          <p className="text-gray-600">Navegue pelos arquivos públicos do Pixeldrain</p>
        </div>
      </div>
    </header>
  );
} 