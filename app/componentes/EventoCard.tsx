'use client';


import styles from './EventoCard.module.css';
import Link from 'next/link';

//Evento es un tipo que describe la forma del objeto evento que recibo como prop. 
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

// Espera recibir un prop "evento" que es un objeto con las propiedades definidas en el tipo Evento.
export default function EventoCard({ evento }: Props) {
  return (
     <div className="w-full max-w-xs overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex h-44 items-center justify-center bg-slate-300 text-slate-600">
        Image cap
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-slate-900">
          {evento.nombre ?? 'Sin nombre'}
        </h3>

        <p className="text-sm text-slate-600">
          {evento.descripcion ?? 'Sin descripción'}
        </p>
      </div>

      <ul className="border-t border-slate-200">
        <li className="border-b border-slate-200 px-4 py-2 text-sm">
          {evento.ubicacion ?? 'Sin ubicación'}
        </li>
        <li className="border-b border-slate-200 px-4 py-2 text-sm">
          {evento.fecha ? new Date(evento.fecha).toLocaleString() : 'Sin fecha'}
        </li>
      </ul>
        <ul className="border-t border-slate-200">
        <li className="border-b border-slate-200 px-4 py-2 text-sm">
         Entrada: ${evento.precio ?? 'Sin precio'}
        </li>
      </ul>
       <div className="flex justify-center gap-2 p-4">
        <div className="card-body">
    <Link  href={`/eventos/${evento.idEvento}`} className="card-link">Ver evento</Link>
         </div>
        </div>
      
</div>
  );
}


