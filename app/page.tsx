// Versão simplificada para exportação estática

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pixeldrain Album Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Uma interface web para gerenciar seus álbuns no Pixeldrain
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Bem-vindo!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Este site permite que você gerencie seus arquivos e álbuns no Pixeldrain.
            Para começar, você precisará de uma chave API do Pixeldrain.
          </p>
          <div className="flex justify-center">
            <a 
              href="https://pixeldrain.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mr-4"
            >
              Visitar Pixeldrain
            </a>
            
            <a 
              href="/indexforpixeldrain/album/example-album" 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Ver Álbum de Exemplo
            </a>
          </div>
        </div>

        <footer className="text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Pixeldrain Album Manager
        </footer>
      </div>
    </div>
  );
} 