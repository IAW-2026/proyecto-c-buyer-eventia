import { isAdminBuyer } from "@/lib/admin";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { 
  ShieldAlert, 
  ShoppingBag, 
  Users, 
  Terminal, 
  TrendingUp, 
  BarChart3, 
  ArrowUpRight, 
  UserCheck,
  History 
} from "lucide-react";

type EventoSeller = {
  idEvento: number;
  nombre: string;
  categoria: string;
};

async function fetchInfoEvento(idEvento: number): Promise<EventoSeller | null> {
  const baseUrl = process.env.URL_SELLER ?? 'http://localhost:3000';
  const sellerApiKey = process.env.SELLER_API_KEY;
  try {
    const res = await fetch(`${baseUrl}/api/seller/eventos/${idEvento}`, {
      headers: { 'x-api-key': sellerApiKey ?? '' },
      next: { revalidate: 30 }
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
      <main className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="card-retro max-w-md text-center flex flex-col items-center gap-4 bg-surface-container-lowest">
          <ShieldAlert className="w-12 h-12 text-primary animate-pulse" />
          <h2 className="text-xl font-body font-bold text-primary">Acceso Restringido</h2>
          <p className="text-body-md text-on-surface-variant">
            No tienes los permisos administrativos necesarios para operar esta sección.
          </p>
          <Link href="/" className="btn-retro-primary mt-2">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  // Obtención de datos
  const [totalPedidos, totalUsuarios, todasLasCompras] = await Promise.all([
    prisma.compras.count(),
    prisma.usuarios.count(),
    prisma.compras.findMany({ select: { id_evento: true, cantidad: true } })
  ]);

  const mapaVentasPorEvento: Record<number, number> = {};
  todasLasCompras.forEach((c) => {
    mapaVentasPorEvento[c.id_evento] = (mapaVentasPorEvento[c.id_evento] || 0) + c.cantidad;
  });

  const topEventosIds = Object.entries(mapaVentasPorEvento)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

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

  const mapaCategorias: Record<string, number> = {};
  rankingEventos.forEach((ev) => {
    mapaCategorias[ev.categoria] = (mapaCategorias[ev.categoria] || 0) + ev.totalVendido;
  });
  const rankingCategorias = Object.entries(mapaCategorias).sort((a, b) => b[1] - a[1]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 gap-8 bg-background">
      
      {/* 🖼️ HERO BANNER: Explosión de color usando la imagen de fondo con degradados rosa/naranja vibrantes */}
      <div 
        className="relative overflow-hidden rounded-3xl border border-primary/20 shadow-soft-ambient bg-cover bg-center text-background p-8 md:p-12 min-h-[220px] flex items-center"
        style={{ backgroundImage: `url('/imgHome.jpeg')` }} 
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/40 via-secondary-container/20 to-transparent mix-blend-color-linear-dodge pointer-events-none" />
        <div className="relative z-10 max-w-md flex flex-col gap-1">
          <span className="inline-flex items-center gap-1.5 bg-primary text-background text-[11px] font-label font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit">
            <ShieldAlert className="w-3.5 h-3.5" /> Staff Control
          </span>
          <h1 className="font-display text-3xl md:text-5xl text-primary leading-none mt-3">
            Panel Operativo
          </h1>
          <p className="text-primary/90 text-sm font-body font-medium max-w-sm mt-1">
            Supervisión global de métricas, control de audiencias y simulación experimental de APIs.
          </p>
        </div>
      </div>

      {/*  SECCIÓN: INDICADORES CLAVE  */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        
        {/*  Total Pedidos */}
        <div className="card-retro bg-surface-container-lowest flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-label-lg text-on-surface-variant/70 uppercase tracking-wider">Total Pedidos</p>
              <h2 className="text-3xl font-body font-black text-on-background mt-2">{totalPedidos}</h2>
            </div>
            <div className="p-2.5 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-primary/5 flex items-center gap-1 text-label-sm text-secondary">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Órdenes procesadas </span>
          </div>
        </div>

        {/* KPI: Usuarios Registrados */}
        <div className="card-retro bg-surface-container-lowest flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-label-lg text-on-surface-variant/70 uppercase tracking-wider">Comunidad</p>
              <h2 className="text-3xl font-body font-black text-on-background mt-2">{totalUsuarios}</h2>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary/5 text-secondary group-hover:bg-secondary/10 transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-primary/5 flex items-center gap-1 text-label-sm text-secondary">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Cuentas de compradores activas</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Ranking: Eventos Líderes */}
        <div className="card-retro bg-surface-container-lowest">
          <div className="flex items-center gap-2 mb-5 border-b border-primary/5 pb-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="font-body font-bold text-base text-on-surface">Eventos Destacados</h3>
          </div>
          <div className="space-y-3">
            {rankingEventos.length === 0 ? (
              <p className="text-label-lg text-on-surface-variant/50 py-6 text-center font-normal">
                Sin historial de boletaje emitido.
              </p>
            ) : (
              rankingEventos.map((evento, index) => (
                <div key={evento.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-primary/5 hover:border-primary/15 transition-all">
                  <div className="flex items-center gap-3 truncate">
                    <span className="font-label text-sm font-bold text-secondary/50 w-5">#{index + 1}</span>
                    <div className="truncate">
                      <p className="text-body-md font-semibold text-on-surface truncate">{evento.nombre}</p>
                    </div>
                  </div>
                  <span className="text-label-sm text-primary bg-background border border-primary/10 px-2.5 py-1 rounded-lg whitespace-nowrap font-bold">
                    {evento.totalVendido} u.
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Distribución de Segmentos */}
        <div className="card-retro bg-surface-container-lowest">
          <div className="flex items-center gap-2 mb-5 border-b border-primary/5 pb-3">
            <History className="w-4 h-4 text-primary" />
            <h3 className="font-body font-bold text-base text-on-surface">Volumen por Categorías + vendidas</h3>
          </div>
          <div className="space-y-4">
            {rankingCategorias.length === 0 ? (
              <p className="text-label-lg text-on-surface-variant/50 py-6 text-center font-normal">
                Sin métricas de segmentación.
              </p>
            ) : (
              rankingCategorias.map(([cat, cant]) => (
                <div key={cat} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-label-sm text-on-surface-variant">
                    <span className="capitalize font-medium">{cat}</span>
                    <span className="font-bold text-primary">{cant} tickets</span>
                  </div>
                  <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden border border-primary/5">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min((cant / (totalPedidos || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ⛓️ SECCIÓN: ACCESOS DE GESTIÓN DIRECTA */}
      <div className="flex flex-col gap-4">
        <h3 className="text-label-sm font-bold text-on-surface-variant/50 uppercase tracking-widest border-b border-primary/5 pb-2">
          Gestión de Datos 
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <Link
            href="/admin/compras"
            className="group card-retro bg-surface-container-lowest transition-all hover:bg-surface-container-low flex flex-col justify-between gap-4"
          >
            <div>
              {/* 🎯 Ajuste: Títulos de accesos directos con font-body intermedios y elegantes */}
              <h2 className="font-body font-bold text-lg text-primary group-hover:text-primary-container transition-colors">
                Libro de Compras
              </h2>
              <p className="mt-1 text-label-sm text-on-surface-variant opacity-80 font-normal">
                Listado. Filtrado  por rangos cronológicos y eventos.
              </p>
            </div>
            <span className="text-label-sm text-secondary font-bold inline-flex items-center gap-1 group-hover:underline self-end">
              Abrir  →
            </span>
          </Link>

          <Link
            href="/admin/usuarios"
            className="group card-retro bg-surface-container-lowest transition-all hover:bg-surface-container-low flex flex-col justify-between gap-4"
          >
            <div>
              <h2 className="font-body font-bold text-lg text-primary group-hover:text-primary-container transition-colors">
                Directorio de Usuarios
              </h2>
              <p className="mt-1 text-label-sm text-on-surface-variant opacity-80 font-normal">
                Padrón de identidades registradas.
              </p>
            </div>
            <span className="text-label-sm text-secondary font-bold inline-flex items-center gap-1 group-hover:underline self-end">
              Ver usuarios registrados →
            </span>
          </Link>
          
        </div>
      </div>

    </main>
  );
}