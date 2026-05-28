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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mis Eventos</h1>
        <p className="mt-2 text-sm text-slate-600">
          Historial de entradas compradas
        </p>
      </div>

      {eventosA_Mostrar.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-slate-600">
          Todavía no se compraron entradas.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {eventosA_Mostrar.map((evento) => (
            <EventoCompradoCard key={evento.idPedido} evento={evento}  /> 
          ))}
        </div>
      )}
    </main>
  );
}