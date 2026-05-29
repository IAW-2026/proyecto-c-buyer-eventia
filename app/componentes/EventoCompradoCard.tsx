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
  <article className="card-retro hover:-translate-y-1">

    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

      {/* izquierda */}
      <div className="flex-1">

        {/* titulo */}
        <h2 className="text-body-lg font-semibold text-primary">
          {evento.nombre}
        </h2>

        {/* info */}
        <div className="mt-4 space-y-2 border-t border-primary/10 pt-4">

          <p className="text-body-md text-on-surface-variant">
            Fecha y hora: {fechaFormateada} hs
          </p>

          <p className="text-body-md text-on-surface-variant">
            📍 {evento.ubicacion}
          </p>

          <p className="text-body-md text-on-surface-variant">
            🎟️ {evento.cantidadComprada}{' '}
            {evento.cantidadComprada === 1
              ? 'ticket'
              : 'tickets'}
          </p>

          <p className="text-label-sm text-on-surface-variant/70">
            Pedido #{evento.idPedido}
          </p>

        </div>
      </div>

      {/* derecha */}
      <div className="flex flex-col items-start gap-3 md:items-end">

        {puedeDevolver ? (

          <BotonDevolver idPedido={evento.idPedido} />

        ) : (

          <span className="text-label-sm text-on-surface-variant/60">
            No disponible para devolución
          </span>

        )}

      </div>

    </div>
  </article>
);
}