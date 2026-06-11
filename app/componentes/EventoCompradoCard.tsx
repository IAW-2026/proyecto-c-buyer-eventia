import BotonDevolver from '@/app/componentes/BotonDevolver';
import { Calendar, MapPin, Ticket } from 'lucide-react'; // 🚀 Importación limpia de Lucide

export type EventoComprado = {
  idPedido: number;
  cantidadComprada: number;
  nombreEvento: string;
  fecha: string;
  ubicacion: string;
};

type Props = {
  evento: EventoComprado;
};

export default function EventoCompradoCard({ evento }: Props) {
  const dateObj = new Date(evento.fecha);

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
  const puedeDevolver = horasRestantes > 48;

  return (
    <article className="card-retro hover:-translate-y-0.5 transition-transform bg-surface-container-lowest border-l-4 border-l-primary/70">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between p-1">
        <div className="flex-1">
          <h2 className="text-lg font-body font-bold text-primary tracking-tight">
            {evento.nombreEvento}
          </h2>

        <div className="mt-3 space-y-2 border-t border-primary/5 pt-3 font-body text-sm text-on-surface-variant/70">
          {/* Fecha y Hora */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-on-surface-variant/50 shrink-0" />
            <p>
              <span className="opacity-80">Fecha y hora: </span>{' '}
              <span className="font-medium text-on-surface-variant/90">{fechaFormateada} hs</span>
            </p>
          </div>

          {/* Ubicación */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-on-surface-variant/50 shrink-0" />
            <p className="font-medium text-on-surface-variant/90">{evento.ubicacion}</p>
          </div>

          {/* Tickets (Este lo dejamos con el color de acento de tu marca para que resalte el dato duro) */}
          <div className="flex items-center gap-2 font-semibold text-secondary text-xs uppercase tracking-wider pt-0.5">
            <Ticket className="w-4 h-4 shrink-0" />
            <span>
              {evento.cantidadComprada} {evento.cantidadComprada === 1 ? 'ticket' : 'tickets'}
            </span>
          </div>

          {/* ID Pedido */}
          <p className="text-[10px] font-mono tracking-widest text-on-surface-variant/40 pt-1">
            PEDIDO #{evento.idPedido}
          </p>
        </div>
      </div>

      
        <div className="flex flex-col items-start gap-3 md:items-end justify-center h-full self-center">
          {puedeDevolver ? (
            <BotonDevolver idPedido={evento.idPedido} />
          ) : (
            <span className="text-xs font-body font-medium text-on-surface-variant/50 bg-surface-container px-2.5 py-1 rounded-md border border-primary/5">
              No disponible para devolución
            </span>
          )}
        </div>

      </div>
    </article>
  );
}