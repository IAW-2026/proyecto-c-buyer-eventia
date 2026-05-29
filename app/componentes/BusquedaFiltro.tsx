'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce'; 

interface SearchFilterProps {
  availableCategories: string[];
  placeholder: string;
}

export default function SearchFilter({ availableCategories, placeholder }: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [fechaInicio, setFechaInicio] = useState(searchParams.get('desde') || '');
  const [fechaFin, setFechaFin] = useState(searchParams.get('hasta') || '');

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());

    // Filtro por texto
    if (debouncedSearchTerm) currentParams.set('search', debouncedSearchTerm);
    else currentParams.delete('search');

    // Filtro por categoría
    if (selectedCategory) currentParams.set('category', selectedCategory);
    else currentParams.delete('category');

    // filtro por fechas
    if (fechaInicio) currentParams.set('desde', fechaInicio);
    else currentParams.delete('desde');

    if (fechaFin) currentParams.set('hasta', fechaFin);
    else currentParams.delete('hasta');

    // Reiniciar paginación al filtrar
    currentParams.set('page', '1');

    const newQuery = currentParams.toString();
    const oldQuery = searchParams.toString();

    if (newQuery !== oldQuery) {
      router.push(`?${newQuery}`, { scroll: false });
    }

  }, [debouncedSearchTerm, selectedCategory, fechaInicio, fechaFin, router]);

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Fila principal: Buscador y Categoría */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las categorías</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* NUEVA FILA: Inputs de rango de fechas */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <label htmlFor="desde">Desde:</label>
          <input
            id="desde"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <label htmlFor="hasta">Hasta:</label>
          <input
            id="hasta"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Botón opcional para limpiar rápidamente las fechas */}
        {(fechaInicio || fechaFin) && (
          <button
            type="button"
            onClick={() => { setFechaInicio(''); setFechaFin(''); }}
            className="text-xs text-red-500 underline hover:text-red-700 ml-auto sm:ml-0"
          >
            Limpiar fechas
          </button>
        )}
      </div>
    </div>
  );
}