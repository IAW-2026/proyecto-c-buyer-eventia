import BotonComprar from '@/app/componentes/BotonComprar';
import { notFound } from 'next/navigation';
import { CalendarDays, MapPin, Ticket } from 'lucide-react';
import CarruselImagenes from '@/app/componentes/Carrusel';
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
  imagenes: string[];
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
     <main className="layout-container flex items-start justify-center pt-8 md:pt-12">
      <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl">
        
        {/* SECCIÓN IZQUIERDA: CARRUSEL DE IMÁGENES */}
        <section className="col-span-12 lg:col-span-6">
          <CarruselImagenes 
            imagenes={evento.imagenes} 
            nombreEvento={evento.nombre} 
          />
        </section>

        {/* SECCIÓN DERECHA: INFORMACIÓN Y COMPRA  */}
        <section className="card-retro col-span-12 lg:col-span-6 p-6 md:p-8 flex flex-col justify-between min-h-[480px] md:min-h-[550px]">
          
          {/* Bloque de Textos e Iconos */}
          <div className="space-y-6">
            <div>
              <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight font-display font-bold leading-tight">
                {evento.nombre}
              </h1>
            </div>

            <p className="text-body-lg text-on-surface-variant leading-relaxed font-body">
              {evento.descripcion}
            </p>

            {/* Chips con Lucide Icons */}
            <div className="flex flex-wrap gap-3">
              <span className="chip-retro flex items-center gap-2 text-sm font-medium py-1.5 px-3">
                <MapPin className="h-4 w-4 text-primary flex-none" />
                <span>{evento.ubicacion}</span>
              </span>

              <span className="chip-retro flex items-center gap-2 text-sm font-medium py-1.5 px-3">
                <Ticket className="h-4 w-4 text-primary flex-none" />
                <span>{evento.stock} disponibles</span>
              </span>
            </div>

            {/* Fecha */}
            <div className="border-t border-primary/10 pt-5">
              <div className="flex items-center gap-2.5 text-label-lg text-on-surface-variant font-semibold">
                <CalendarDays className="h-5 w-5 text-primary flex-none" />
                <p>
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
          </div>

          <div className="mt-8 pt-6 border-t border-primary/10 space-y-4">
            
            {/* Fila limpia de precio */}
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold uppercase tracking-wider text-on-surface-variant/70 font-label">
                Precio por entrada:
              </span>
              <span className="text-2xl font-black text-primary tracking-tight">
                ${evento.precio?.toLocaleString('es-AR')}
              </span>
            </div>

            {/* Acción de compra inmediata */}
            <div className="w-full">
              <BotonComprar
                idEvento={evento.idEvento}
                stock={evento.stock}
                precio={evento.precio}
              />
            </div>

          </div>

        </section>

      </article>
    </main>
  
  );
  
}