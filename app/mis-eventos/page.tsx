import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma'; 
import EventoCompradoCard from "../componentes/EventoCompradoCard";
import Paginacion from '../componentes/Paginacion';
import BusquedaFiltro from '../componentes/BusquedaFiltro';

type EventoSeller = {
  idEvento: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  categoria: string;
  ubicacion: string;
  precio: number;
  stock: number;
  imagenes: string[];
};

// función auxiliar para pedirle a la API de Seller los datos de un evento específico
async function fetchInfoEvento(idEvento: number): Promise<EventoSeller | null> {
  const baseUrl =  process.env.URL_SELLER ?? 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/seller/eventos/${idEvento}`, {
      headers: {
        'x-api-key': process.env.SELLER_API_KEY ?? '',
      },
      cache: 'no-store', // Evita respuestas cacheadas viejas
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

  // Buscar en la bd todas las compras que correspondan a este usuario
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

  // recorrer las compras y consultar la info de cada evento a Seller
  const listaEventosCompletos = await Promise.all(
    misComprasDB.map(async (compra) => {
      const infoSeller = await fetchInfoEvento(compra.id_evento);
      if (infoSeller) {
        return {
          idPedido: compra.id_pedido,
          cantidadComprada: compra.cantidad,
          nombre: infoSeller.nombre,
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

  // Limpiar cualquier registro que haya devuelto "null" por algún error en la API
  const eventosA_Mostrar = listaEventosCompletos.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );

  /* Extracción de categorías únicas basadas en los eventos reales comprados por el usuario */
  const availableCategories = Array.from(new Set<string>(eventosA_Mostrar.map((evento: any) => evento.categoria)));
  
  /* LÓGICA DE FILTRADO APLICADA */
  let eventosFiltrados = eventosA_Mostrar;

  /* filtrado por texto: buscador */
  if (searchTerm) {
    eventosFiltrados = eventosFiltrados.filter(
      (evento: any) =>
        evento.nombre.toLowerCase().includes(searchTerm) ||
        evento.descripcion.toLowerCase().includes(searchTerm) ||
        evento.ubicacion.toLowerCase().includes(searchTerm)
    );
  }

  /* filtrado por categoría: selector desplegable */
  if (selectedCategory) {
    eventosFiltrados = eventosFiltrados.filter(
      (evento: any) => evento.categoria.toLowerCase() === selectedCategory.toLowerCase()
    );
  }
  
    
  /* filtrado por rango de fechas */
  if (fechaIni) {
    const inicioBusqueda = new Date(`${fechaIni}T00:00:00.000Z`); // Normalizado a UTC
    eventosFiltrados = eventosFiltrados.filter(
      (evento: any) => new Date(evento.fecha) >= inicioBusqueda
    );
  }

  if (fechaFin) {
    const finBusqueda = new Date(`${fechaFin}T23:59:59.999Z`); // Incluye todo el día elegido
    eventosFiltrados = eventosFiltrados.filter(
      (evento: any) => new Date(evento.fecha) <= finBusqueda
    );
  }
  // la paginación se calcula usando 'eventosFiltrados' 
  const eventosPorPagina = 3; 
  const totalRegistros = eventosFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / eventosPorPagina);

  const inicio = (pagina - 1) * eventosPorPagina;
  const fin = inicio + eventosPorPagina;
  const eventosPagina = eventosFiltrados.slice(inicio, fin);

  return (
    <main className="layout-container">
      <div className="mx-auto w-full max-w-6xl">

        {/* Header */}
        <div className="mb-10 space-y-3">
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary">
            Mis Eventos
          </h1>

          <p className="text-body-lg text-on-surface-variant">
            Historial de compras en Eventia
          </p>
          
          <BusquedaFiltro
            availableCategories={availableCategories}
            placeholder="Buscar en mis eventos..."
          />
        </div>

        {/* Estado vacío absoluto (El usuario nunca compró nada) */}
        {eventosA_Mostrar.length === 0 ? (
          <div className="card-retro-tonal flex min-h-[240px] flex-col items-center justify-center text-center">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full border border-primary/15 bg-primary/5" />
              <h2 className="text-headline-md text-primary">
                Todavía no hay eventos
              </h2>
              <p className="max-w-md text-body-md text-on-surface-variant">
                Cuando compres entradas, tus eventos aparecerán acá.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Si compró, pero el filtro actual de búsqueda da vacío */}
            {eventosPagina.length === 0 ? (
              <p className="text-center text-on-surface-variant my-8">
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
              <Paginacion totalPaginas={totalPaginas} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}