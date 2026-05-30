import { isAdminBuyer } from "@/lib/admin";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type EventoSeller = {
  idEvento: number;
  nombre: string;
  categoria: string;
};

// Función auxiliar eficiente para traer detalles de eventos
async function fetchInfoEvento(idEvento: number): Promise<EventoSeller | null> {
  const baseUrl = process.env.URL_SELLER ?? 'http://localhost:3000';
  const sellerApiKey = process.env.SELLER_API_KEY;
  try {
    const res = await fetch(`${baseUrl}/api/seller/eventos/${idEvento}`, {
      headers: { 'x-api-key': sellerApiKey ?? '' },
      next: { revalidate: 30 } // Cacheamos 30 segundos para no saturar la API en cada recarga
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const esAdmin = await isAdminBuyer();
  if (!esAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-700 font-medium">
          No tienes permisos para acceder a esta página.
        </div>
      </main>
    );
  }

//obtengo datos 
  const [totalPedidos, totalUsuarios, todasLasCompras] = await Promise.all([
    prisma.compras.count(),
    prisma.usuarios.count(),
    prisma.compras.findMany({ select: { id_evento: true, cantidad: true } })
  ]);

 
  // Agrupamos cantidades por ID de Evento
  const mapaVentasPorEvento: Record<number, number> = {};
  todasLasCompras.forEach((c) => {
    mapaVentasPorEvento[c.id_evento] = (mapaVentasPorEvento[c.id_evento] || 0) + c.cantidad;
  });

  // Ordenamos los eventos más vendidos y tomamos los top 3 para no saturar con fetches
  const topEventosIds = Object.entries(mapaVentasPorEvento)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Traemos los nombres y categorías desde la API de Seller en paralelo
  const rankingEventos = await Promise.all(
    topEventosIds.map(async ([idStr, totalVendido]) => {
      const id = Number(idStr);
      const info = await fetchInfoEvento(id);
      return {
        id,
        nombre: info?.nombre ?? `Evento #${id}`,
        categoria: info?.categoria ?? 'Desconocida',
        totalVendido
      };
    })
  );

  // Agrupamos por categoría basados en la información recolectada
  const mapaCategorias: Record<string, number> = {};
  rankingEventos.forEach((ev) => {
    mapaCategorias[ev.categoria] = (mapaCategorias[ev.categoria] || 0) + ev.totalVendido;
  });
  const rankingCategorias = Object.entries(mapaCategorias).sort((a, b) => b[1] - a[1]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 bg-slate-50/50">
      
      {/* Cabecera */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Panel Administrador
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Métricas de actividad y gestión de accesos generales.
        </p>
      </div>

      {/*  TARJETAS DE MÉTRICAS (KPIs) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Pedidos</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900">{totalPedidos}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Órdenes</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Usuarios Registrados</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900">{totalUsuarios}</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Cuentas</span>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-sky-300 bg-sky-50/30 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">Entorno de Pruebas</p>
            <p className="text-xs text-sky-600 mt-1">Simulaciones de nuestras apis.</p>
          </div>
          <Link href="/admin/simulacion" className="mt-3 inline-flex items-center text-xs font-bold text-sky-700 hover:underline">
            Ir al simulador de Buyer →
          </Link>
        </div>
      </div>

      {/* RÁNKINGS ANALÍTICOS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-10">
        
        {/* Top Eventos */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">🏆 Eventos más vendidos</h3>
          <div className="space-y-3">
            {rankingEventos.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No hay registros de ventas.</p>
            ) : (
              rankingEventos.map((evento, index) => (
                <div key={evento.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3 truncate">
                    <span className="font-mono font-bold text-slate-400 w-4">#{index + 1}</span>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-slate-900 truncate">{evento.nombre}</p>
                      <p className="text-xs text-slate-400 capitalize">{evento.categoria}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-white border px-2 py-1 rounded-md whitespace-nowrap">
                    {evento.totalVendido} tickets.
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Distribución por Categorías */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">📁 Volumen por Categoría (Top Ventas)</h3>
          <div className="space-y-3">
            {rankingCategorias.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Sin categorías registradas.</p>
            ) : (
              rankingCategorias.map(([cat, cant]) => (
                <div key={cat} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span className="capitalize">{cat}</span>
                    <span className="font-semibold">{cant} tickets</span>
                  </div>
                  {/* Barra de progreso simulada estilizada */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-slate-800 h-full rounded-full transition-all" 
                      style={{ width: `${Math.min((cant / (totalPedidos || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ENLACES DE GESTIÓN DIRECTA */}
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Accesos Directos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/compras"
          className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:bg-slate-50"
        >
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-slate-800">
            Listar Compras
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Filtra, busca por rango de fechas y lista todas las compras del sistema.
          </p>
        </Link>

        <Link
          href="/admin/usuarios"
          className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:bg-slate-50"
        >
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-slate-800">
            Listar Usuarios
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Administra los perfiles de los usuarios que operan en el sistema.
          </p>
        </Link>
      </div>

    </main>
  );
}