import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma'; 
import EventoCompradoCard from "../componentes/EventoCompradoCard";
import Paginacion from '../componentes/Paginacion';
import BusquedaFiltro from '../componentes/BusquedaFiltro';
import { Ticket } from 'lucide-react'; // Sumamos un icono retro copado para el banner
import BotonVolver from '../componentes/BotonVolver';

type EventoSeller = {
  idEvento: number;
  nombreEvento: string;
  descripcion: string;
  fecha: string;
  categoria: string;
  ubicacion: string;
  precio: number;
  stock: number;
  imagenes: string[];
};

async function fetchInfoEvento(idEvento: number): Promise<EventoSeller | null> {
  const baseUrl = process.env.URL_SELLER ?? 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/seller/eventos/${idEvento}`, {
      headers: {
        'x-api-key': process.env.SELLER_API_KEY ?? '',
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Error buscando evento ${idEvento}:`, error);
    return null;
  }
}

interface MisEventosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MisEventosPage({ searchParams }: MisEventosPageProps) {
  const params = await searchParams;
  const searchTerm = (params.search as string || '').toLowerCase();
  const selectedCategory = params.category as string || '';
  const fechaIni = params.desde as string || '';
  const fechaFin = params.hasta as string || '';
  
  const pagina = Number(params.page) || 1;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const misComprasDB = await prisma.compras.findMany({
    where: {
      id_usuario: userId,
    },
    select: {
      id_pedido: true, 
      id_evento: true, 
      cantidad: true, 
    },
  });

  const listaEventosCompletos = await Promise.all(
    misComprasDB.map(async (compra) => {
      const infoSeller = await fetchInfoEvento(compra.id_evento);
      if (infoSeller) {
        return {
          idPedido: compra.id_pedido,
          cantidadComprada: compra.cantidad,
          nombreEvento: infoSeller.nombreEvento,
          descripcion: infoSeller.descripcion, 
          fecha: infoSeller.fecha,
          categoria: infoSeller.categoria, 
          ubicacion: infoSeller.ubicacion,
          precio: infoSeller.precio,
          stock: infoSeller.stock,
          imagenes: infoSeller.imagenes,
        };
      }
      return null;
    })
  );

  const eventosA_Mostrar = listaEventosCompletos.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );

  const availableCategories = Array.from(new Set<string>(eventosA_Mostrar.map((evento: any) => evento.categoria)));
  
  let eventosFiltrados = eventosA_Mostrar;

  if (searchTerm) {
    eventosFiltrados = eventosFiltrados.filter(
      (evento: any) =>
        evento.nombreEvento.toLowerCase().includes(searchTerm) ||
        evento.descripcion.toLowerCase().includes(searchTerm) ||
        evento.ubicacion.toLowerCase().includes(searchTerm)
    );
  }

  if (selectedCategory) {
    eventosFiltrados = eventosFiltrados.filter(
      (evento: any) => evento.categoria.toLowerCase() === selectedCategory.toLowerCase()
    );
  }
  
  if (fechaIni) {
    const inicioBusqueda = new Date(`${fechaIni}T00:00:00.000Z`);
    eventosFiltrados = eventosFiltrados.filter(
      (evento: any) => new Date(evento.fecha) >= inicioBusqueda
    );
  }

  if (fechaFin) {
    const finBusqueda = new Date(`${fechaFin}T23:59:59.999Z`);
    eventosFiltrados = eventosFiltrados.filter(
      (evento: any) => new Date(evento.fecha) <= finBusqueda
    );
  }

  const eventosPorPagina = 3; 
  const totalRegistros = eventosFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / eventosPorPagina);

  const inicio = (pagina - 1) * eventosPorPagina;
  const fin = inicio + eventosPorPagina;
  const eventosPagina = eventosFiltrados.slice(inicio, fin);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 gap-8 bg-background">
      <BotonVolver />
      <div className="w-full space-y-8">

        {/* Banner */}
        <div 
          className="relative overflow-hidden rounded-3xl border border-primary/20 shadow-soft-ambient bg-cover bg-center text-background p-8 md:p-10 min-h-[180px] flex items-center"
          style={{ backgroundImage: `url('/imgHome.jpeg')` }} 
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/30 via-transparent to-transparent mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10 max-w-md flex flex-col gap-1">
            <span className="inline-flex items-center gap-1 bg-primary text-background text-[10px] font-label font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full w-fit">
              <Ticket className="w-3 h-3" /> Mis Entradas
            </span>
            <h1 className="font-display text-3xl md:text-5xl text-primary leading-none mt-2">
              Mis Eventos
            </h1>
            <p className="text-primary/90 text-sm font-body font-medium mt-1">
              Historial de compras, accesos activos y gestión de reservas en Eventia.
            </p>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA + FILTROS */}
        <div className="w-full">
          <BusquedaFiltro
            availableCategories={availableCategories}
            placeholder="Buscar en mis eventos..."
          />
        </div>

        {/* Estado vacío  */}
        {eventosA_Mostrar.length === 0 ? (
          <div className="card-retro-tonal flex min-h-[240px] flex-col items-center justify-center text-center">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full border border-primary/15 bg-primary/5" />
              <h2 className="font-body font-bold text-xl text-primary">
                Todavía no hay eventos
              </h2>
              <p className="max-w-md text-body-md text-on-surface-variant">
                Cuando compres entradas, tus eventos aparecerán acá.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {eventosPagina.length === 0 ? (
              <p className="text-center font-body text-on-surface-variant my-8">
                No se encontraron eventos con los filtros aplicados.
              </p>
            ) : (
              eventosPagina.map((evento) => (
                <EventoCompradoCard
                  key={evento.idPedido}
                  evento={evento}
                />
              ))
            )}

            {totalPaginas > 1 && (
              <div className="mt-4">
                <Paginacion totalPaginas={totalPaginas} />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}