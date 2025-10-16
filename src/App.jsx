import { useState } from 'react';
import RunnerSearch from './components/RunnerSearch';
import RaceAnalysis from './components/RaceAnalysis';
import resultsData from './results.json';

function App() {
  const [selectedRunner, setSelectedRunner] = useState(null);

  const handleSelectRunner = (runner) => {
    setSelectedRunner(runner);
  };

  return (
    <div className="min-h-screen">
      {!selectedRunner ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex flex-col items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-indigo-900 mb-4">
                🏃‍♂️ 10K San Martín
              </h1>
              <h2 className="text-2xl text-gray-700 mb-2">
                Análisis de Carrera
              </h2>
              <p className="text-gray-600">
                Busca tu nombre para ver tu análisis personalizado
              </p>
            </div>

            <RunnerSearch
              runners={resultsData}
              onSelect={handleSelectRunner}
            />

            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📊 Estadísticas Generales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {resultsData.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total de corredores
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {[...new Set(resultsData.map(r => r.categoria))].length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Categorías
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    10 KM
                  </div>
                  <div className="text-sm text-gray-600">
                    Distancia
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={() => setSelectedRunner(null)}
            className="fixed top-4 left-4 z-50 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          >
            ← Volver a buscar
          </button>
          <RaceAnalysis
            runner={selectedRunner}
            allRunners={resultsData}
          />
        </>
      )}
    </div>
  );
}

export default App;
