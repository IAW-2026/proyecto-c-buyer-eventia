import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma'; 
import { isAdminBuyer } from '@/lib/admin';
import AdminTablaCompras from '@/app/componentes/AdminTablaCompras';


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
      cache: 'no-store', // Evita respuestas cacheadas viejas
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Error buscando evento ${idEvento}:`, error);
    return null;
  }
}

export default async function ComprasPage() {
  // Doble verificación de seguridad en el servidor
  const admin = await isAdminBuyer();
  if (!admin) {
    redirect("/");
  }
  // Buscar en la bd todas las compras incluyendo los datos del usuario
  const todasLasComprasDB = await prisma.compras.findMany({
    select: {
      id_pedido: true,
      id_usuario: true,
      id_evento: true,
      cantidad: true,
      // join con la tabla usuarios
      usuarios: {
        select: {
          nombre_usuario: true, 
        }
      }
    },
  //  orderBy: {
  //    id_pedido: 'desc', // Muestra las compras más recientes primero
 // }
  });

  // recorrer las compras y consultar la info de cada evento a Seller
  //primero guarda arreglo de promesas con toda la info de cada evento, luego Promise.all espera a que se resuelvan todas las promesas y devuelve un arreglo con la info
  const listaComprasCompletas = await Promise.all(
    todasLasComprasDB.map(async (compra) => {
      const infoSeller = await fetchInfoEvento(compra.id_evento);
      //armo un nuevo objeto con la info de la compra y la info de Seller
      
      if (infoSeller) {
      return {
        idPedido: compra.id_pedido,
        nombreUsuario: compra.usuarios?.nombre_usuario ?? `ID: ${compra.id_usuario}`,
        idEvento: compra.id_evento,
        cantidadComprada: compra.cantidad,
        nombre: infoSeller.nombre ,
      };
    }
       return null;
    })
  );

  // Limpiar cualquier registro que haya devuelto "null" 
  const comprasA_listar = listaComprasCompletas.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );

   return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Panel Admin: Control de Compras</h1>
        <p className="mt-2 text-sm text-slate-600">
          Listado global de transacciones y órdenes generadas en la plataforma.
        </p>
      </div>

      {/* Enviamos los datos procesados a la tabla interactiva del cliente */}
      <AdminTablaCompras compras={comprasA_listar} />
    </main>
  );
}