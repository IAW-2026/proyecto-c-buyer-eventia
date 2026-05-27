
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

  // convertir fecha string a Date
  const fechaEvento = new Date(evento.fecha);
  // calcular diferencia con ahora
  const ahora = new Date();
  const diferenciaMs = fechaEvento.getTime() - ahora.getTime();
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
              <span className="font-medium">Fecha:</span>{" "}
              {evento.fecha}
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
            <button className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600">
              Devolver entradas
            </button>
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