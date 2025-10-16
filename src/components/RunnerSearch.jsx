import React, { useState } from 'react';
import { Search } from 'lucide-react';

const RunnerSearch = ({ runners, onSelect, lightStyle = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Normalize text by removing accents and special characters
  const normalizeText = (text) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .toLowerCase();
  };

  const handleSearch = (value) => {
    setSearchTerm(value);

    if (value.trim().length > 0) {
      const normalizedSearch = normalizeText(value);
      const results = runners
        .filter(runner => {
          const normalizedName = normalizeText(runner.nombre);
          return normalizedName.includes(normalizedSearch);
        })
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
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchTerm && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Buscar corredor por nombre..."
          className={`w-full px-6 py-3 md:py-4 text-base md:text-lg border-2 rounded-xl focus:outline-none shadow-lg ${
            lightStyle
              ? 'border-white text-white placeholder-white/70 bg-transparent focus:border-cyan-300'
              : 'border-gray-300 text-gray-900 bg-white focus:border-blue-500'
          }`}
        />
        <div className={`absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none ${
          lightStyle ? 'text-white' : 'text-gray-400'
        }`}>
          <Search className="h-5 w-5 md:h-6 md:w-6" />
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
          {suggestions.map((runner) => (
            <div
              key={runner.posicion}
              onClick={() => selectRunner(runner)}
              className="px-4 md:px-6 py-2 md:py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm md:text-base font-semibold text-gray-800">{runner.nombre}</div>
                  <div className="text-xs md:text-sm text-gray-500">
                    {runner.categoria} • {runner.sexo}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs md:text-sm font-semibold text-blue-600">
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
