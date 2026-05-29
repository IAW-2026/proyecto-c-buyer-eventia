import BotonComprar from '@/app/componentes/BotonComprar';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Evento = {
  idEvento: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  precio: number;
  stock: number;
};

async function getEvento(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(
    `${baseUrl}/api/seller/eventos/${id}`,
    {
      headers: {
        'x-api-key': process.env.SELLER_API_KEY ?? '',
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json() as Promise<Evento>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const evento = await getEvento(id);

  if (!evento) {
    notFound();
  }

  return (
    <main className="layout-container flex items-start justify-center pt-12">

      <div className="grid-retro-fluid w-full max-w-7xl">

        {/* CARD PRINCIPAL */}
        <section className="card-retro col-span-4 md:col-span-8 overflow-hidden">

          {/* Banner */}
          <div className="flex h-72 items-center justify-center rounded-xl border border-primary/10 bg-surface-container-high text-on-surface-variant">

          <div className="flex flex-col items-center gap-3 opacity-60">
            
            <div className="h-16 w-16 rounded-full border border-primary/20 bg-primary/5" />

            <span className="text-label-lg uppercase tracking-[0.25em]">
              Imagen del evento
            </span>

          </div>
        </div>

          {/* Contenido */}
          <div className="mt-8 space-y-6">

            <div>
              <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary">
                {evento.nombre}
              </h1>
            </div>

            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              {evento.descripcion}
            </p>

            {/* Chips */}
            <div className="flex flex-wrap gap-3">

              <span className="chip-retro">
                📍 {evento.ubicacion}
              </span>

              <span className="chip-retro">
                🎟️ {evento.stock} disponibles
              </span>

            </div>

            {/* Fecha */}
            <div className="border-t border-primary/10 pt-6">

              <p className="text-label-lg text-on-surface-variant">
                📅{' '}
                {new Date(evento.fecha).toLocaleString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'UTC',
                })}{' '}
                hs
              </p>

            </div>
          </div>
        </section>

        {/* PANEL COMPRA */}
        <aside className="card-retro-tonal col-span-4 md:col-span-4 flex flex-col justify-between min-h-[420px]">

          <div className="space-y-4">

            <div>
              <p className="text-label-lg text-on-surface-variant uppercase">
                Entrada
              </p>

              <h2 className="text-headline-md text-primary">
                ${evento.precio}
              </h2>
            </div>

          </div>

          {/* Botón */}
          <div className="mt-8">
            <BotonComprar
              idEvento={evento.idEvento}
              stock={evento.stock}
            />
          </div>

        </aside>
      </div>
    </main>
  );
}