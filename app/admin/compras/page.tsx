import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma'; 
import { isAdminBuyer } from '@/lib/admin';
import AdminTablaCompras from '@/app/componentes/AdminTablaCompras';
import Paginacion from '@/app/componentes/Paginacion';
import {ShoppingBag} from 'lucide-react';

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
   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ComprasPage({ searchParams }: PageProps) {
  // Doble verificación de seguridad en el servidor
  const admin = await isAdminBuyer();
  if (!admin) {
    return(
     <main className="min-h-screen flex items-center justify-center">
      <div className="text-center text-slate-700">
        No tienes permisos para acceder a esta página.
      </div>
    </main>
     );
  }

  // Extraer los parámetros de búsqueda y paginación de la URL
  const params = await searchParams;
  const filtro = params.search || "";
  const selectedCategory = params.category as string || '';
  const fechaIni = params.desde as string || '';
  const fechaFin = params.hasta as string || ''
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
        fecha: infoSeller.fecha,
      };
    }
       return null;
    })
  );

  // Limpiar cualquier registro que haya devuelto "null" 
  const comprasA_listar = listaComprasCompletas.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );

  /* Extracción de categorías únicas basadas en los eventos reales comprados por el usuario */
  const availableCategories = Array.from(new Set<string>(comprasA_listar.map((evento: any) => evento.categoria)));

   /* LÓGICA DE FILTRADO APLICADA */
  let comprasFiltradas = comprasA_listar;

  /* filtrado por texto: buscador */
  if (filtro) {
    comprasFiltradas = comprasFiltradas.filter(
      (compra: any) =>
       compra.idPedido.toString().toLowerCase().includes(filtro) ||
       compra.nombreUsuario.toLowerCase().includes(filtro) ||
      compra.nombre.toLowerCase().includes(filtro) ||
      compra.idEvento.toString().includes(filtro) ||
      compra.categoria.toLowerCase().includes(filtro)
    );
  }

  /* filtrado por categoría: selector desplegable */
  if (selectedCategory) {
    comprasFiltradas = comprasFiltradas.filter(
      (compra: any) => compra.categoria.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  /* filtrado por rango de fechas */
  if (fechaIni) {
    const inicioBusqueda = new Date(`${fechaIni}T00:00:00.000Z`); // Normalizado a UTC
    comprasFiltradas = comprasFiltradas.filter(
      (compra: any) => new Date(compra.fecha) >= inicioBusqueda
    );
  }

  if (fechaFin) {
    const finBusqueda = new Date(`${fechaFin}T23:59:59.999Z`); // Incluye todo el día elegido
    comprasFiltradas = comprasFiltradas.filter(
      (compra: any) => new Date(compra.fecha) <= finBusqueda
    );
  }
   
  // 4. CALCULAR PAGINACIÓN: Basándonos en el resultado del filtro global
  const totalRegistros = comprasFiltradas.length;
  const totalPaginas = Math.ceil(totalRegistros / comprasPorPagina);

  // (Paginación): Extraemos únicamente el segmento correspondiente a la página actual
  const inicio = (pagina - 1) * comprasPorPagina;
  const fin = inicio + comprasPorPagina;
  const comprasPagina = comprasFiltradas.slice(inicio, fin);
  
   return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10 bg-background text-on-background">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-primary/10 pb-5">
     <span className="inline-flex items-center gap-1 text-on-secondary-container text-label-sm font-bold uppercase tracking-widest bg-secondary-container px-2.5 py-0.5 rounded-full w-fit">
      <ShoppingBag className="w-3.5 h-3.5" /> Finanzas
    </span>
        <h1 className="text-headline-md md:text-headline-lg text-primary mt-1">
          Panel Admin: Control de Compras
        </h1>
        <p className="text-body-md text-on-surface-variant/80 font-medium">
          Listado global de transacciones y órdenes generadas en la plataforma.
        </p>
      </div>
      
      {/* Tabla  */}
      <div className="w-full">
        <AdminTablaCompras compras={comprasPagina} />
      </div>
      
      {/* Paginación  */}
      {totalPaginas > 1 && (
        <div className="flex justify-center mt-2">
          <Paginacion totalPaginas={totalPaginas} />
        </div>
      )}
    </main>
  );
  
}