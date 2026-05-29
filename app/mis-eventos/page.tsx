import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma'; 
import EventoCompradoCard from "../componentes/EventoCompradoCard";

type EventoSeller = {
  idEvento: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  precio: number;
  stock: number;
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

export default async function MisEventosPage() {
  //obtengo el ID de Clerk del usuario logueado
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Buscar en la bd todas las compras que correspondan a este usuario y se guarda como un arreglo de objetos con id_pedido, id_evento y cantidad
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
  //primero guarda arreglo de promesas con toda la info de cada evento, luego Promise.all espera a que se resuelvan todas las promesas y devuelve un arreglo con la info
  const listaEventosCompletos = await Promise.all(
    misComprasDB.map(async (compra) => {
      const infoSeller = await fetchInfoEvento(compra.id_evento);
      //armo un nuevo objeto con la info de la compra y la info de Seller
      if (infoSeller) {
        return {
          idPedido: compra.id_pedido,
          cantidadComprada: compra.cantidad,
          nombre: infoSeller.nombre,
          fecha: infoSeller.fecha,
          ubicacion: infoSeller.ubicacion,
        };
      }
      return null;
    })
  );

  // Limpiar cualquier registro que haya devuelto "null" por algún error en la API
  const eventosA_Mostrar = listaEventosCompletos.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );

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
      </div>

      {/* Estado vacío */}
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

        /* Lista */
         <div className="flex flex-col gap-5">

          {eventosA_Mostrar.map((evento) => (
            <div
              key={evento.idPedido}
              className="col-span-4 md:col-span-6"
            >
              <EventoCompradoCard evento={evento} />
            </div>

          ))}

        </div>

      )}
    </div>
  </main>
);
    
}