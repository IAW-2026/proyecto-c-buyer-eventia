'use client';
import { ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce'; 
import { Search } from 'lucide-react';
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
        
        {/* 🔍 CONTENEDOR DEL INPUT: Con relative para posicionar la lupa */}
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Agregamos pl-10 para correr el texto "Buscar eventos..." a la derecha y no pisar la lupa
            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/*CONTENEDOR DEL SELECT*/}
        <div className="text-gray-400 w-5 relative min-w-[200px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            // appearance-none elimina la flechita negra por defecto. pr-10 da espacio para que no se pise el texto.
            className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-transparent cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-5 h-5 opacity-60" />
        </div>

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