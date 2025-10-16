import { useState } from 'react';
import { User, BarChart3 } from 'lucide-react';
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
              <div className="flex items-center justify-center gap-3 mb-4">
                <User className="h-10 w-10 md:h-12 md:w-12 text-indigo-900" strokeWidth={2.5} />
                <h1 className="text-4xl md:text-5xl font-bold text-indigo-900">
                  10K San Martín
                </h1>
              </div>
              <h2 className="text-xl md:text-2xl text-gray-700 mb-2">
                Análisis de Carrera
              </h2>
              <p className="text-gray-600">
                Busca tu nombre para ver tu análisis personalizado
              </p>
            </div>

            <div className="mb-8">
              <RunnerSearch
                runners={resultsData}
                onSelect={handleSelectRunner}
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-gray-800" />
                Estadísticas Generales
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
        <RaceAnalysis
          runner={selectedRunner}
          allRunners={resultsData}
          onBack={() => setSelectedRunner(null)}
          onSelectRunner={handleSelectRunner}
        />
      )}
    </div>
  );
}

export default App;
