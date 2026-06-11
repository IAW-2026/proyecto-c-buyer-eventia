'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

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
    <div className="w-full h-fit flex flex-col gap-4">
      
      {/* Contenedor de la Imagen Principal */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[450px] w-full overflow-hidden rounded-xl border border-primary/10 bg-black group shadow-sm">
        <Image
          src={imagenes[imagenActiva]}
          alt={`${nombreEvento} - Imagen ${imagenActiva + 1}`}
          fill
          priority={true}
          sizes="(max-w-1024px) 100vw, 50vw"
          className="object-cover transition-all duration-500 ease-in-out"
        />
        
        {/* Controles */}
        {imagenes.length > 1 && (
          <>
            <button
              onClick={irAAnterior}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-all duration-200 select-none active:scale-95 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] cursor-pointer z-10"
              aria-label="Ir a la imagen anterior"
            >
              <ChevronLeft className="h-9 w-9 stroke-[1.5]" />
            </button>
            <button
              onClick={irASiguiente}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-all duration-200 select-none active:scale-95 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] cursor-pointer z-10"
              aria-label="Ir a la siguiente imagen"
            >
              <ChevronRight className="h-9 w-9 stroke-[1.5]" />
            </button>
          </>
        )}

        {/* Indicador Numérico Flotante */}
        <div className="absolute bottom-4 right-4 rounded-md bg-black/40 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm z-10">
          {imagenActiva + 1} / {imagenes.length}
        </div>
      </div>

      {/* Miniaturas Inferiores */}
      {imagenes.length > 1 && (
        <div className="flex gap-3 overflow-x-auto overflow-y-hidden py-1 w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {imagenes.map((url: string, index: number) => (
            <button
              key={url + index}
              onClick={() => setImagenActiva(index)}
              className={`relative h-16 w-24 md:h-20 md:w-28 flex-shrink-0 overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer ${
                index === imagenActiva
                  ? 'border-primary ring-2 ring-primary/35 scale-95 opacity-100'
                  : 'border-primary/10 opacity-60 hover:opacity-90'
              }`}
              aria-label={`Ver imagen miniatura ${index + 1}`}
            >
              <Image
                src={url}
                alt={`Miniatura del evento ${index + 1}`}
                fill
                sizes="(max-w-768px) 96px, 112px"
                loading="lazy"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}