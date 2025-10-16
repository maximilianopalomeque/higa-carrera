import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { User, BarChart3, List, Trophy } from 'lucide-react';
import RunnerSearch from './components/RunnerSearch';
import RaceAnalysis from './components/RaceAnalysis';
import CompleteResults from './components/CompleteResults';
import Podiums from './components/Podiums';
import resultsData from './results.json';

function HomePage() {
  const [selectedRunner, setSelectedRunner] = useState(null);
  const navigate = useNavigate();

  const handleSelectRunner = (runner) => {
    setSelectedRunner(runner);
  };

  if (selectedRunner) {
    return (
      <RaceAnalysis
        runner={selectedRunner}
        allRunners={resultsData}
        onBack={() => setSelectedRunner(null)}
        onSelectRunner={handleSelectRunner}
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-blue-900 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="h-10 w-10 md:h-12 md:w-12 text-white" strokeWidth={2.5} />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              10K San Martín
            </h1>
          </div>
          <h2 className="text-xl md:text-2xl text-cyan-300 mb-2 font-bold">
            La Salud es la Meta
          </h2>
          <p className="text-white">
            Busca tu nombre para ver tu análisis personalizado
          </p>
        </div>

        <div className="mb-8">
          <RunnerSearch
            runners={resultsData}
            onSelect={handleSelectRunner}
            lightStyle={true}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-pink-600" />
            Estadísticas Generales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg text-white">
              <div className="text-3xl font-bold">
                {resultsData.length}
              </div>
              <div className="text-sm opacity-90">
                Total de corredores
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg text-white">
              <div className="text-3xl font-bold">
                {[...new Set(resultsData.map(r => r.categoria))].length}
              </div>
              <div className="text-sm opacity-90">
                Categorías
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg text-white">
              <div className="text-3xl font-bold">
                10 KM
              </div>
              <div className="text-sm opacity-90">
                Distancia
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-pink-600" />
            Resultados Completos
          </h3>
          <p className="text-gray-600 mb-4">
            Explora todos los resultados de la carrera
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/resultados')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 cursor-pointer"
            >
              <List className="h-5 w-5" />
              Ver Lista Completa
            </button>
            <button
              onClick={() => navigate('/podios')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 cursor-pointer"
            >
              <Trophy className="h-5 w-5" />
              Ver Podios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resultados" element={<CompleteResults />} />
        <Route path="/podios" element={<Podiums />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
