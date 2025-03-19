import React, { useState, useEffect } from 'react';
import { PixeldrainService, PixeldrainFile, PixeldrainAlbum } from '../services/pixeldrain';
import FileViewer from '../components/FileViewer';
import AlbumViewer from '../components/AlbumViewer';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<PixeldrainFile[]>([]);
  const [albums, setAlbums] = useState<PixeldrainAlbum[]>([]);
  const [activeTab, setActiveTab] = useState<'files' | 'albums'>('files');
  const [selectedFile, setSelectedFile] = useState<PixeldrainFile | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<PixeldrainAlbum | null>(null);

  // Inicializar a partir do localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('pixeldrain_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Carregar conteúdo quando a API key for definida
  useEffect(() => {
    if (apiKey) {
      loadContent();
    }
  }, [apiKey]);

  const loadContent = async () => {
    if (!apiKey) return;
    
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem('pixeldrain_api_key', apiKey);
      
      const pixeldrainService = new PixeldrainService(apiKey);
      const result = await pixeldrainService.getAllUserContent();
      
      if (result.success) {
        setFiles(result.files);
        setAlbums(result.albums);
        
        // Resetar seleções
        setSelectedFile(null);
        setSelectedAlbum(null);
      } else {
        setError(result.error || 'Erro ao carregar conteúdo');
      }
    } catch (err) {
      setError('Erro ao se conectar com a API do Pixeldrain');
      console.error('Erro ao carregar conteúdo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      loadContent();
    } else {
      setError('Por favor, insira uma chave API válida');
    }
  };

  const renderContent = () => {
    if (selectedFile) {
      return (
        <div>
          <button 
            className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={() => setSelectedFile(null)}
          >
            ← Voltar para a lista
          </button>
          <FileViewer file={selectedFile} apiKey={apiKey} />
        </div>
      );
    }

    if (selectedAlbum) {
      return (
        <div>
          <button 
            className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={() => setSelectedAlbum(null)}
          >
            ← Voltar para a lista
          </button>
          <AlbumViewer album={selectedAlbum} apiKey={apiKey} />
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
          {error}
        </div>
      );
    }

    return (
      <div>
        <div className="flex mb-4 border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === 'files'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('files')}
          >
            Meus Arquivos ({files.length})
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'albums'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('albums')}
          >
            Meus Álbuns ({albums.length})
          </button>
        </div>

        {activeTab === 'files' ? (
          <div>
            {files.length === 0 ? (
              <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg mb-4">
                Nenhum arquivo encontrado. Certifique-se de que sua chave API está correta.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
                    onClick={() => setSelectedFile(file)}
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                      <img
                        src={`https://pixeldrain.com/api/file/${file.id}/thumbnail`}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/icons/file.svg';
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{file.name}</h3>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{file.views || 0} visualizações</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {albums.length === 0 ? (
              <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg mb-4">
                Nenhum álbum encontrado. Certifique-se de que sua chave API está correta.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
                    onClick={() => setSelectedAlbum(album)}
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                      {album.files && album.files.length > 0 ? (
                        <img
                          src={`https://pixeldrain.com/api/file/${album.files[0].id}/thumbnail`}
                          alt={album.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/icons/folder.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src="/icons/folder.svg"
                            alt="Folder"
                            className="w-16 h-16 opacity-50"
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{album.title}</h3>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>{album.files?.length || 0} arquivos</span>
                        {album.date_created && (
                          <span>
                            {new Date(album.date_created).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Visualizador de Arquivos Pixeldrain
        </h1>
        <p className="text-gray-600">
          Uma interface web para gerenciar seus álbuns no Pixeldrain
        </p>
      </header>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">API Key do Pixeldrain</h2>
        <p className="mb-4 text-gray-600">
          Insira sua chave API do Pixeldrain para acessar seus arquivos e álbuns.
          Você pode obtê-la em{' '}
          <a
            href="https://pixeldrain.com/user/api_keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            pixeldrain.com/user/api_keys
          </a>
        </p>
        <div className="flex space-x-2">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSaveApiKey}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Salvar e Carregar'}
          </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}

// Função para formatar o tamanho do arquivo
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 