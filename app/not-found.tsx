export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <a
          href="/indexforpixeldrain"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Voltar para o início
        </a>
      </div>
    </div>
  );
} 