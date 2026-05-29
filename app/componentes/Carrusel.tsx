'use client';

import { useState } from 'react';

interface CarruselImagenesProps {
  imagenes: string[];
  nombreEvento: string;
}

export default function CarruselImagenes({ imagenes, nombreEvento }: CarruselImagenesProps) {
  const [imagenActiva, setImagenActiva] = useState(0);

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border border-primary/10 bg-surface-container-high text-on-surface-variant">
        <div className="flex flex-col items-center gap-3 opacity-60">
          <div className="h-16 w-16 rounded-full border border-primary/20 bg-primary/5" />
          <span className="text-label-lg uppercase tracking-[0.25em]">Sin imágenes disponibles</span>
        </div>
      </div>
    );
  }

  const irAAnterior = () => {
    setImagenActiva((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const irASiguiente = () => {
    setImagenActiva((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Contenedor de la Imagen Principal */}
      <div className="relative h-80 md:h-[420px] w-full overflow-hidden rounded-xl border border-primary/10 bg-black group shadow-sm">
        <img
          src={imagenes[imagenActiva]}
          alt={`${nombreEvento} - Imagen ${imagenActiva + 1}`}
          className="h-full w-full object-cover transition-all duration-500 ease-in-out"
        />
        
        {/* CONTROLES LIMPIOS: Solo los símbolos < y > finitos y sin fondos */}
        {imagenes.length > 1 && (
          <>
            <button
              onClick={irAAnterior}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-light text-white/60 hover:text-white transition-all duration-200 select-none active:scale-95 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
              aria-label="Imagen anterior"
            >
              &lt;
            </button>
            <button
              onClick={irASiguiente}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl font-light text-white/60 hover:text-white transition-all duration-200 select-none active:scale-95 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
              aria-label="Siguiente imagen"
            >
              &gt;
            </button>
          </>
        )}

        {/* Indicador Numérico Flotante */}
        <div className="absolute bottom-4 right-4 rounded-md bg-black/40 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
          {imagenActiva + 1} / {imagenes.length}
        </div>
      </div>

      {/* Miniaturas Inferiores (Solo si hay múltiples imágenes) */}
      {imagenes.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {imagenes.map((url, index) => (
            <button
              key={url + index}
              onClick={() => setImagenActiva(index)}
              className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border transition-all duration-300 ${
                index === imagenActiva
                  ? 'border-primary ring-2 ring-primary/35 scale-95 opacity-100'
                  : 'border-primary/10 opacity-60 hover:opacity-90'
              }`}
            >
              <img
                src={url}
                alt={`Miniatura ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}