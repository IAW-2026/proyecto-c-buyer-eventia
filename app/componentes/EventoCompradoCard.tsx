import BotonDevolver from '@/app/componentes/BotonDevolver';
export type EventoComprado = {
  idPedido: number;
  cantidadComprada: number;
  nombre: string;
  fecha: string;
  ubicacion: string;
};

type Props = {
  evento: EventoComprado;
};

export default function EventoCompradoCard({ evento }: Props) {

  // Date original
  const dateObj = new Date(evento.fecha);

  //convertir a string legible. 
  //'UTC' para que muestre exactamente lo que dice el string de la data.
  const fechaFormateada = dateObj.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC' 
  });

  
  const ahora = new Date();
  const diferenciaMs = dateObj.getTime() - ahora.getTime();
  const horasRestantes = diferenciaMs / (1000 * 60 * 60);
  // puede devolver si faltan más de 48hs
  const puedeDevolver = horasRestantes > 48;

  
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between gap-6">

        {/* info izquierda */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-slate-900">
            {evento.nombre}
          </h2>

          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-medium">Fecha y hora:</span>{" "}
              {fechaFormateada} hs
            </p>

            <p>
              <span className="font-medium">Ubicación:</span>{" "}
              {evento.ubicacion}
            </p>

            <p>
              <span className="font-medium">Pedido:</span>{" "}
              #{evento.idPedido}
            </p>
          </div>
        </div>

        {/* cantidad */}
        <div className="flex flex-col items-end gap-3">
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            {evento.cantidadComprada}{" "}
            {evento.cantidadComprada === 1 ? "ticket" : "tickets"}
          </span>

          {puedeDevolver ? (
            <BotonDevolver idPedido={evento.idPedido} />
          ) : (
            <span className="text-xs text-slate-400">
              No disponible para devolución
            </span>
          )}
        </div>

      </div>
    </article>
  );
}