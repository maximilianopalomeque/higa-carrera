import React, { useState } from 'react';

const RunnerSearch = ({ runners, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value);

    if (value.trim().length > 0) {
      const results = runners
        .filter(runner =>
          runner.nombre.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 10);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectRunner = (runner) => {
    setSearchTerm(runner.nombre);
    setShowSuggestions(false);
    onSelect(runner);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchTerm && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Buscar corredor por nombre..."
          className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 shadow-lg"
        />
        <div className="absolute right-4 top-4 text-gray-400">
          🔍
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
          {suggestions.map((runner) => (
            <div
              key={runner.posicion}
              onClick={() => selectRunner(runner)}
              className="px-6 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-800">{runner.nombre}</div>
                  <div className="text-sm text-gray-500">
                    {runner.categoria} • {runner.sexo}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-blue-600">
                    Posición {runner.posicion}°
                  </div>
                  <div className="text-xs text-gray-500">
                    Cat: {runner.posicionCategoria}°
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && searchTerm && suggestions.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-2xl p-4">
          <p className="text-gray-500 text-center">No se encontraron corredores</p>
        </div>
      )}
    </div>
  );
};

export default RunnerSearch;
