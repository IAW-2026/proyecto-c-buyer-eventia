'use client';

import Link from 'next/link';

type Evento = {
  idEvento: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  precio: number;
  stock: number;
};

type Props = {
  evento: Evento;
};

export default function EventoCard({ evento }: Props) {
  return (
    <div className="card-retro w-full max-w-sm overflow-hidden">
      
      {/* Imagen */}
      <div className="flex h-44 items-center justify-center rounded-xl bg-primary-container/15 text-primary">
        <span className="text-label-lg uppercase tracking-widest">
          imagen
        </span>
      </div>

      {/* Contenido */}
      <div className="mt-5 space-y-3">
        <h3 className="text-headline-md text-primary">
          {evento.nombre ?? 'Sin nombre'}
        </h3>

        <p className="text-body-md text-on-surface-variant line-clamp-3">
          {evento.descripcion ?? 'Sin descripción'}
        </p>

      
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="chip-retro">
            {evento.ubicacion ?? 'Sin ubicación'}
          </span>

          <span className="chip-retro">
            ${evento.precio ?? 'Sin precio'}
          </span>
        </div>

        {/* Fecha */}
        <div className="border-t border-primary/10 pt-4">
          <p className="text-label-lg text-on-surface-variant">
            {evento.fecha
              ? new Date(evento.fecha).toLocaleString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'UTC',
                }) + ' hs'
              : 'Sin fecha'}
          </p>
        </div>

        {/* Botón */}
        <div className="pt-2">
          <Link
            href={`/eventos/${evento.idEvento}`}
            className="btn-retro-primary inline-flex w-full items-center justify-center"
          >
            Ver evento
          </Link>
        </div>
      </div>
    </div>
  );
}