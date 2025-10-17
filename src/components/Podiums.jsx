import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Trophy, Medal } from 'lucide-react';
import Footer from './Footer';
import resultsData from '../results.json';

const Podiums = () => {
  const navigate = useNavigate();

  // Normalize category helper (trim spaces and lowercase 'a')
  const normalizeCategory = (cat) => cat.trim().replace(' A ', ' a ');

  // Group runners by category and gender, then get top 5
  const podiumsByCategory = useMemo(() => {
    const grouped = {};

    resultsData.forEach(runner => {
      const normalizedCategory = normalizeCategory(runner.categoria);
      const key = `${normalizedCategory}-${runner.sexo}`;
      if (!grouped[key]) {
        grouped[key] = {
          categoria: normalizedCategory,
          sexo: runner.sexo,
          runners: []
        };
      }
      grouped[key].runners.push(runner);
    });

    // Sort each group by category position and take top 5
    Object.keys(grouped).forEach(key => {
      grouped[key].runners.sort((a, b) => a.posicionCategoria - b.posicionCategoria);
      grouped[key].runners = grouped[key].runners.slice(0, 5);
    });

    // Convert to array and sort by category (numerically by first number)
    return Object.values(grouped).sort((a, b) => {
      if (a.categoria === b.categoria) {
        return a.sexo === 'Masculino' ? -1 : 1;
      }
      const numA = parseInt(a.categoria.match(/\d+/)?.[0] || '999');
      const numB = parseInt(b.categoria.match(/\d+/)?.[0] || '999');
      return numA - numB;
    });
  }, [normalizeCategory]);

  // Convert time from decimal to seconds and format it
  const formatTime = (tiempo) => {
    const timeInSeconds = tiempo * 86400;
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate pace
  const formatPace = (tiempo) => {
    const timeInSeconds = tiempo * 86400;
    const paceMinutes = Math.floor(timeInSeconds / 10 / 60);
    const paceSeconds = Math.floor((timeInSeconds / 10) % 60);
    return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
  };

  // Get medal color based on position
  const getMedalColor = (position) => {
    switch (position) {
      case 1:
        return 'text-yellow-300';
      case 2:
        return 'text-white';
      case 3:
        return 'text-yellow-200';
      default:
        return 'text-gray-200';
    }
  };

  // Get position background
  const getPositionBg = (position) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-pink-500 to-pink-600';
      case 2:
        return 'bg-gradient-to-r from-cyan-400 to-cyan-500';
      case 3:
        return 'bg-gradient-to-r from-blue-700 to-blue-800';
      case 4:
        return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 5:
        return 'bg-gradient-to-r from-indigo-500 to-indigo-600';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-900 flex flex-col">
      <div className="flex-1 p-3 md:p-6">
        <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Volver al inicio"
            >
              <Home className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Trophy className="h-8 w-8 text-pink-600" />
                Podios por Categoría
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Top 5 de cada categoría y género
              </p>
            </div>
          </div>

          {/* Podiums Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {podiumsByCategory.map((podium, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 shadow-md">
                {/* Category Header */}
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {podium.categoria}
                  </h2>
                  <p className="text-gray-600">
                    {podium.sexo === 'Masculino' ? 'Masculino' : 'Femenino'}
                  </p>
                </div>

                {/* Runners List */}
                <div className="space-y-3">
                  {podium.runners.map((runner, runnerIdx) => (
                    <div
                      key={runnerIdx}
                      className={`${getPositionBg(runner.posicionCategoria)} rounded-lg p-4 text-white shadow-lg transition-transform hover:scale-105`}
                    >
                      {/* Mobile Layout */}
                      <div className="md:hidden">
                        <div className="flex items-start gap-3 mb-3">
                          {/* Position Medal */}
                          <div className="flex-shrink-0">
                            {runner.posicionCategoria <= 3 ? (
                              <Medal className={`h-8 w-8 ${getMedalColor(runner.posicionCategoria)}`} />
                            ) : (
                              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-gray-700 font-bold text-sm">
                                {runner.posicionCategoria}
                              </div>
                            )}
                          </div>

                          {/* Runner Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-base leading-tight break-words">
                              {runner.nombre}
                            </div>
                            <div className="text-xs opacity-90 mt-1">
                              Posición general: {runner.posicion}°
                            </div>
                          </div>
                        </div>

                        {/* Time, Pace and Points in a row */}
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="font-bold">{formatTime(runner.tiempo)}</span>
                            <span className="opacity-90 ml-2">{formatPace(runner.tiempo)} min/km</span>
                          </div>
                          <div className="opacity-90">
                            {runner.puntaje} pts
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:block">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {/* Position Medal */}
                            <div className="flex-shrink-0">
                              {runner.posicionCategoria <= 3 ? (
                                <Medal className={`h-8 w-8 ${getMedalColor(runner.posicionCategoria)}`} />
                              ) : (
                                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-gray-700 font-bold">
                                  {runner.posicionCategoria}
                                </div>
                              )}
                            </div>

                            {/* Runner Info */}
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-lg truncate">
                                {runner.nombre}
                              </div>
                              <div className="text-sm opacity-90">
                                Posición general: {runner.posicion}°
                              </div>
                            </div>
                          </div>

                          {/* Time and Pace */}
                          <div className="text-right flex-shrink-0">
                            <div className="font-bold text-xl">
                              {formatTime(runner.tiempo)}
                            </div>
                            <div className="text-sm opacity-90">
                              {formatPace(runner.tiempo)} min/km
                            </div>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="mt-2 text-sm opacity-90">
                          Puntaje: {runner.puntaje} pts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category Stats */}
                <div className="mt-4 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
                  Total de corredores en esta categoría: {podium.runners.length > 0 ?
                    resultsData.filter(r => normalizeCategory(r.categoria) === podium.categoria && r.sexo === podium.sexo).length : 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Podiums;
