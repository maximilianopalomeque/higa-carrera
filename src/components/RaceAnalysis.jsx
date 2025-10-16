import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RaceAnalysis = ({ runner, allRunners }) => {
  const colors = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6'];

  // Calculate runner stats
  const stats = useMemo(() => {
    if (!runner) return null;

    // Convert time from decimal to seconds
    const runnerTimeInSeconds = runner.tiempo * 86400; // Excel time format to seconds
    const hours = Math.floor(runnerTimeInSeconds / 3600);
    const minutes = Math.floor((runnerTimeInSeconds % 3600) / 60);
    const seconds = Math.floor(runnerTimeInSeconds % 60);
    const timeFormatted = hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Calculate pace (min/km for 10k)
    const paceMinutes = Math.floor(runnerTimeInSeconds / 10 / 60);
    const paceSeconds = Math.floor((runnerTimeInSeconds / 10) % 60);
    const pace = `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;

    // Calculate speed (km/h)
    const speed = (10 / (runnerTimeInSeconds / 3600)).toFixed(1);

    // Get runners in same category
    const sameCategory = allRunners.filter(r => r.categoria === runner.categoria && r.sexo === runner.sexo);
    const categoryTotal = sameCategory.length;

    // Get runners ahead (8 positions before)
    const runnersAhead = allRunners
      .filter(r => r.posicion < runner.posicion && r.posicion >= runner.posicion - 8)
      .sort((a, b) => b.posicion - a.posicion)
      .map(r => {
        const rTimeInSeconds = r.tiempo * 86400;
        const diff = runnerTimeInSeconds - rTimeInSeconds;
        const diffMinutes = Math.floor(diff / 60);
        const diffSeconds = Math.floor(diff % 60);

        const rMinutes = Math.floor((rTimeInSeconds % 3600) / 60);
        const rSeconds = Math.floor(rTimeInSeconds % 60);
        const rTimeFormatted = `${rMinutes}:${rSeconds.toString().padStart(2, '0')}`;

        return {
          posicion: `${r.posicion}°`,
          nombre: r.nombre,
          diferencia: Math.floor(diff),
          tiempo: rTimeFormatted,
          minutos: `${diffMinutes}:${diffSeconds.toString().padStart(2, '0')}`
        };
      });

    // Calculate winner stats
    const winner = sameCategory[0];
    const winnerTimeInSeconds = winner.tiempo * 86400;
    const winnerPaceMinutes = Math.floor(winnerTimeInSeconds / 10 / 60);
    const winnerPaceSeconds = Math.floor((winnerTimeInSeconds / 10) % 60);
    const winnerPace = `${winnerPaceMinutes}:${winnerPaceSeconds.toString().padStart(2, '0')}`;
    const winnerSpeed = (10 / (winnerTimeInSeconds / 3600)).toFixed(1);

    // Calculate percentile
    const generalPercentile = ((1 - (runner.posicion / allRunners.length)) * 100).toFixed(0);
    const categoryPercentile = ((1 - (runner.posicionCategoria / categoryTotal)) * 100).toFixed(0);

    return {
      timeFormatted,
      pace,
      speed,
      categoryTotal,
      runnersAhead,
      winnerPace,
      winnerSpeed,
      generalPercentile,
      categoryPercentile
    };
  }, [runner, allRunners]);

  if (!runner || !stats) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500 text-xl">
          Selecciona un corredor para ver su análisis
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border-2 border-gray-300 rounded-lg shadow-lg">
          <p className="font-bold text-gray-800">{data.posicion} {data.nombre}</p>
          <p className="text-gray-600">Tiempo: {data.tiempo}</p>
          <p className="text-red-600 font-semibold">Diferencia: {data.minutos}</p>
          <p className="text-gray-500 text-sm">({data.diferencia} segundos)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-indigo-900">
            🏃‍♂️ 10K San Martín - Análisis de Carrera
          </h1>
          <h2 className="text-xl text-center mb-8 text-gray-600">
            {runner.nombre} - Categoría {runner.categoria} {runner.sexo}
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="col-span-3 md:col-span-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-4xl font-bold mb-2">{runner.posicion}°</div>
              <div className="text-sm uppercase tracking-wide">Posición General</div>
              <div className="text-xs mt-1 opacity-90">de {allRunners.length} corredores</div>
            </div>

            <div className="col-span-3 md:col-span-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-4xl font-bold mb-2">{runner.posicionCategoria}°</div>
              <div className="text-sm uppercase tracking-wide">Categoría {runner.categoria}</div>
              <div className="text-xs mt-1 opacity-90">de {stats.categoryTotal} competidores</div>
            </div>

            <div className="col-span-3 md:col-span-1 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-4xl font-bold mb-2">{stats.timeFormatted}</div>
              <div className="text-sm uppercase tracking-wide">Tiempo</div>
              <div className="text-xs mt-1 opacity-90">{stats.pace} min/km</div>
            </div>
          </div>

          {stats.runnersAhead.length > 0 && (
            <>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  ⏱️ Diferencia con los corredores por encima
                </h3>
                <p className="text-center text-gray-600 mb-4">
                  Tiempo necesario para alcanzar cada posición
                </p>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.runnersAhead} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="nombre"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    label={{ value: 'Segundos de diferencia', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="diferencia" radius={[8, 8, 0, 0]}>
                    {stats.runnersAhead.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          )}

          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h4 className="font-bold text-lg text-blue-900 mb-3">💡 Análisis Rápido</h4>
            <ul className="space-y-2 text-gray-700">
              {stats.runnersAhead.length > 0 && (
                <li>• Estuviste a <strong className="text-blue-600">{stats.runnersAhead[0].diferencia} segundos</strong> de alcanzar la posición {stats.runnersAhead[0].posicion}</li>
              )}
              <li>• Ritmo promedio: <strong className="text-blue-600">{stats.pace} min/km</strong> - Velocidad: <strong className="text-blue-600">{stats.speed} km/h</strong></li>
              <li>• El ganador de tu categoría corrió a <strong className="text-blue-600">{stats.winnerPace} min/km</strong> ({stats.winnerSpeed} km/h)</li>
              <li>• Posición en el <strong className="text-blue-600">top {stats.generalPercentile}%</strong> general y <strong className="text-blue-600">top {stats.categoryPercentile}%</strong> de tu categoría</li>
              <li>• Puntaje obtenido: <strong className="text-blue-600">{runner.puntaje} puntos</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceAnalysis;
