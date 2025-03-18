// Página estática para álbuns do Pixeldrain
// Removida a diretiva 'use client' que era incompatível com generateStaticParams

import PublicView from '../../components/PublicView';

interface AlbumPageProps {
  params: {
    id: string;
  };
}

// Esta função é necessária para o modo de exportação estática
// Ela indica ao Next.js quais parâmetros pré-gerar durante o build
export function generateStaticParams() {
  // Retornamos um array vazio, o que significa que não pré-renderizamos 
  // nenhuma página específica no build, mas a estrutura da rota ainda será exportada
  return [];
}

export default function AlbumPage({ params }: AlbumPageProps) {
  // Na versão estática, usamos uma página simplificada para mostrar o ID do álbum
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Visualizando Álbum
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            ID do álbum: {params.id}
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Conteúdo do Álbum
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Esta visualização estática será substituída pelo conteúdo dinâmico quando acessada no navegador.
          </p>
          <div className="flex justify-center">
            <a 
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Voltar para o Início
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 