"use client";

import { useEffect, useState } from 'react';
import { PixeldrainService, PixeldrainAlbum } from './services/pixeldrain';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [albums, setAlbums] = useState<PixeldrainAlbum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  useEffect(() => {
    // Tentar carregar a API key do localStorage
    const savedApiKey = localStorage.getItem('pixeldrain_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    
    // Carregar álbuns
    loadAlbums(savedApiKey || undefined);
  }, []);
  
  const loadAlbums = async (key?: string) => {
    setLoading(true);
    setApiError(null);
    setDebugInfo(null);
    
    try {
      // Criar uma instância do PixeldrainService com a API key (se disponível)
      const pixeldrainService = new PixeldrainService(key);
      
      // Buscar os álbuns
      console.log('Buscando álbuns...');
      const response = await pixeldrainService.getAlbums();
      console.log('Resposta da API:', response);
      
      if (response.success === false) {
        setApiError(`Erro ao conectar com a API do Pixeldrain: ${response.error}`);
        setDebugInfo(response);
        setAlbums([]);
      } else {
        setAlbums(response.albums || []);
        if (response.albums?.length === 0) {
          console.log('Nenhum álbum encontrado');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
      setApiError(`Erro ao conectar com a API do Pixeldrain: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setDebugInfo({ error: error instanceof Error ? error.toString() : JSON.stringify(error) });
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };
  
  const saveApiKey = () => {
    localStorage.setItem('pixeldrain_api_key', apiKey);
    loadAlbums(apiKey);
  };
  
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pixeldrain Album Manager</h1>
        <p className={styles.description}>Uma interface web para gerenciar seus álbuns no Pixeldrain</p>
      </div>
      
      <div className={styles.apiKeyContainer}>
        <h2>API Key do Pixeldrain</h2>
        <div className={styles.inputContainer}>
          <input 
            type="text"
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="Insira sua API key do Pixeldrain"
            className={styles.apiKeyInput}
          />
          <button onClick={saveApiKey} className={styles.button}>
            Salvar e Carregar
          </button>
        </div>
        <p className={styles.apiKeyInfo}>
          A API key deve estar no formato UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.<br />
          Você pode encontrar sua API key nas configurações da sua conta no site oficial do Pixeldrain.
        </p>
      </div>
      
      <h2 className={styles.sectionTitle}>Seus Álbuns</h2>
      
      {loading ? (
        <div className={styles.loading}>Carregando álbuns...</div>
      ) : apiError ? (
        <div className={styles.error}>
          <div className={styles.errorIcon}>⚠️</div>
          <div>
            <strong>{apiError}</strong>
            <div className={styles.possibleSolutions}>
              <h3>Possíveis soluções:</h3>
              <ul>
                <li>Verifique se a chave API está correta em <code>app/services/pixeldrain.ts</code></li>
                <li>A API do Pixeldrain pode estar temporariamente indisponível. Tente novamente mais tarde.</li>
                <li>Verifique sua conexão com a internet.</li>
                <li>Certifique-se de que a API key tem o formato adequado (UUID).</li>
                <li>O servidor do Pixeldrain pode estar rejeitando solicitações. Verifique se há restrições ou limites de uso.</li>
              </ul>
              <button onClick={() => loadAlbums(apiKey)} className={styles.retryButton}>
                Tentar novamente
              </button>
            </div>
            
            {debugInfo && (
              <div className={styles.debugInfo}>
                <h3>Informações de depuração:</h3>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      ) : albums.length === 0 ? (
        <div className={styles.noAlbums}>
          <p>Nenhum álbum encontrado na sua conta.</p>
          <p>Você pode criar álbuns no site oficial do Pixeldrain.</p>
        </div>
      ) : (
        <div className={styles.albumGrid}>
          {albums.map((album) => (
            <div key={album.id} className={styles.albumCard}>
              <h3 className={styles.albumTitle}>{album.title}</h3>
              <p className={styles.albumDescription}>
                {album.description || 'Sem descrição'}
              </p>
              <div className={styles.albumMeta}>
                <span>ID: {album.id}</span>
                <span>Criado em: {new Date(album.date_created).toLocaleDateString()}</span>
                <span>Arquivos: {album.file_count || 0}</span>
              </div>
              <Link href={`/album/${album.id}`} className={styles.albumLink}>
                Ver Detalhes
              </Link>
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.externalLink}>
        <a href="https://pixeldrain.com" target="_blank" rel="noopener noreferrer" className={styles.visitButton}>
          Visitar Pixeldrain
        </a>
      </div>
    </main>
  );
} 