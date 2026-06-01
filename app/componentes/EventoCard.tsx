import Link from 'next/link';
import { CalendarDays, MapPin, Ticket } from 'lucide-react'; 
import { ptSerif } from '../fonts';
import Image from 'next/image';

type Evento = {
  idEvento: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  precio: number;
  stock: number;
  imagenes: string[];
  categoria: string;
};

type Props = {
  evento: Evento;
};

export default function EventoCard({ evento }: Props) {
   // Capturamos la primera imagen si es que existe
  const tieneImagenes = evento.imagenes && evento.imagenes.length > 0;
  const primeraImagen = tieneImagenes ? evento.imagenes[0] : null;
  return (
      <div className="w-full max-w-[21rem] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
       
    
        {/* Contenedor de la Imagen - Mantenemos tus clases intactas */}
      <div className="relative h-44 w-full overflow-hidden rounded-xl border border-primary/5 bg-primary-container/15 flex items-center justify-center text-primary">
        {primeraImagen ? (
          <Image
            src={primeraImagen}
            alt={evento.nombre ?? 'Imagen del evento'}
            fill // Hace que la imagen ocupe todo el contenedor relativo de 44 de alto
            sizes="(max-w-768px) 100vw, 33vw" //Le dice a Next qué tamaño de imagen descargar según la pantalla
            className="object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy" // Carga diferida para que no impacte al inicio
          />
        ) : (
          <span className="text-label-lg uppercase tracking-widest opacity-60">
            Sin imagen
          </span>
        )}
      </div>

      <div className="p-3">
      <span
        className="mb-2 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold"
        style={{
          background: 'var(--color-secondary-container)',
          color: 'var(--color-on-secondary-container)',
        }}
      >
        {evento.categoria}
      </span>
  
        <h3 className={`mb-2 text-lg font-bold ${ptSerif.className}`} style={{ color: 'var(--color-primary)' }}>
          {evento.nombre ?? 'Sin nombre'}
        </h3>
        <p className="text-sm text-slate-600">
           {evento.descripcion ?? 'Sin descripción'}
        </p>
      </div>

     
       <ul className="border-t border-slate-200">
        <li className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 text-sm text-slate-700">
          <MapPin className="h-4 w-4 flex-none text-[var(--color-primary)]" />
          <span>   {evento.ubicacion ?? 'Sin ubicación'}</span>
        </li>


        {/* Fecha */}
        <li className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 text-sm text-slate-700">
        <CalendarDays className="h-4 w-4 flex-none text-[var(--color-primary)]" />
        <span>
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
          </span>
         </li>
        <li className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 text-sm text-slate-700">
        <Ticket className="h-4 w-4 flex-none text-[var(--color-primary)]" />
        <span>Entrada:   ${evento.precio ?? 'Sin precio'}</span>
        </li>
        </ul>
        {/* Botón */}
        <div className="flex justify-center gap-2 p-3">

          <Link
          href={`/eventos/${evento.idEvento}`}
          className="inline-flex w-full items-center justify-center rounded-xl py-2.5 text-center text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
          style={{
            background: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
          }}
        >
          Ver evento
        </Link>
        </div>
      </div>
  );
}