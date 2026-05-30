import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma'; 
import { isAdminBuyer } from '@/lib/admin';
import AdminTablaCompras from '@/app/componentes/AdminTablaCompras';
import Paginacion from '@/app/componentes/Paginacion';


type EventoSeller = {
  idEvento: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  categoria: string;
  ubicacion: string;
  precio: number;
  stock: number;
};

// función auxiliar para pedirle a la API de Seller los datos de un evento específico
async function fetchInfoEvento(idEvento: number): Promise<EventoSeller | null> {
  const baseUrl =  process.env.URL_SELLER ?? 'http://localhost:3000';
  const sellerApiKey = process.env.SELLER_API_KEY;
  try {
    const res = await fetch(`${baseUrl}/api/seller/eventos/${idEvento}`, {
      headers: {
        'x-api-key': sellerApiKey ?? '',
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
//  propiedades de la página para aceptar los searchParams de Next.js
interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}
export default async function ComprasPage({ searchParams }: PageProps) {
  // Doble verificación de seguridad en el servidor
  const admin = await isAdminBuyer();
  if (!admin) {
    redirect("/");
  }

  // Extraer los parámetros de búsqueda y paginación de la URL
  const params = await searchParams;
  const filtro = params.search || "";
  const pagina = Number(params.page) || 1;
  const comprasPorPagina = 6; // Cantidad de filas por página

  // Crear la condición de filtrado común para contar y para buscar
  const condicionesWhere = filtro ? {
    OR: [
      { id_usuario: { contains: filtro } },
      { usuarios: { nombre_usuario: { contains: filtro } } },
    ]
  } : {};

  // Traemos las compras de la base de datos SIN PAGINAR primero.
  // ANTES de cortar por páginas para que la busqueda del admin sea global.
  const todasLasComprasDB = await prisma.compras.findMany({
    select: {
      id_pedido: true,
      id_usuario: true,
      id_evento: true,
      cantidad: true,
      usuarios: {
        select: {
          nombre_usuario: true, 
        }
      }
    },
    //orderBy: {
    //  id_pedido: 'desc',
    //}
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
        categoria: infoSeller.categoria,
      };
    }
       return null;
    })
  );

  // Limpiar cualquier registro que haya devuelto "null" 
  const comprasA_listar = listaComprasCompletas.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );
  // 3. FILTRADO GLOBAL EN MEMORIA: Ahora que tenemos TODA la información unificada
  // (ID de pedido, Nombre de Usuario y Nombre del Evento de la API), filtramos TODO el universo de datos.
  const comprasFiltradasGlobal = comprasA_listar.filter((compra) => {
    if (!filtro) return true; // Si no hay búsqueda, pasan todas
    
    return (
      compra.idPedido.toString().includes(filtro) ||
      compra.nombreUsuario.toLowerCase().includes(filtro) ||
      compra.nombre.toLowerCase().includes(filtro) ||
      compra.idEvento.toString().includes(filtro) ||
      compra.categoria.toLowerCase().includes(filtro)
    );
  });

  // 4. CALCULAR PAGINACIÓN: Basándonos en el resultado del filtro global
  const totalRegistros = comprasFiltradasGlobal.length;
  const totalPaginas = Math.ceil(totalRegistros / comprasPorPagina);

  // (Paginación): Extraemos únicamente el segmento correspondiente a la página actual
  const inicio = (pagina - 1) * comprasPorPagina;
  const fin = inicio + comprasPorPagina;
  const comprasPagina = comprasFiltradasGlobal.slice(inicio, fin);
  
   return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Panel Admin: Control de Compras</h1>
        <p className="mt-2 text-sm text-slate-600">
          Listado global de transacciones y órdenes generadas en la plataforma.
        </p>
      </div>

      {/* Enviamos los datos procesados a la tabla interactiva del cliente */}
      <AdminTablaCompras compras={comprasPagina} />
       {/*  nuevo componente reutilizable de paginación separado abajo */}
    <Paginacion totalPaginas={totalPaginas} />
    </main>
  );
  
}