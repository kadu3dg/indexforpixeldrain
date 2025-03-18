// Página estática simples para GitHub Pages
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Pixeldrain Album Manager</h1>
        <p className="mb-6">Interface web para gerenciar seus álbuns no Pixeldrain</p>
        <a 
          href="https://pixeldrain.com" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visitar Pixeldrain
        </a>
      </div>
    </div>
  );
} 