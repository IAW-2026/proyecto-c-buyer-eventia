import { isAdminBuyer } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import Simulador from "@/app/componentes/Simulador";
import { Terminal } from "lucide-react";
export const dynamic = 'force-dynamic';

export default async function SimulacionPage() {
  // protección de ruta
  const esAdmin = await isAdminBuyer();
  if (!esAdmin) {
    return(
     <main className="min-h-screen flex items-center justify-center">
      <div className="text-center text-slate-700">
        No tienes permisos para acceder a esta página.
      </div>
    </main>
     );
  }

  // traer las compras actuales para poder elegir cuáles cancelar
  const compras = await prisma.compras.findMany({
    orderBy: {
      id_pedido: 'desc',
    },
  });
  
  //obtenerla para pasarla al componente que la va a usar en el fetch
  const buyerApiKey = process.env.BUYER_API_KEY ?? '';

  return (
   <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-10 bg-background text-on-background">
    {/* Header */}
    <div className="flex flex-col gap-1 border-b border-primary/10 pb-5">
      {/* Badge/Tag  */}
      <span className="inline-flex items-center gap-1.5 text-[#650003] text-label-sm font-bold uppercase tracking-widest bg-[#fe9ea2]/30 px-3 py-1 rounded-full w-fit">
        <Terminal className="w-3.5 h-3.5" /> Desarrolladores
      </span>
      
      <h1 className="text-headline-md md:text-headline-lg text-primary mt-2">
        Simulador de Cancelación
      </h1>
      
      <p className="text-body-md text-on-surface-variant/80 font-medium">
        Selecciona los IDs de pedidos que deseas enviar al endpoint{" "}
        <code className="bg-surface-container-low text-[#650003] px-2 py-0.5 rounded-lg text-xs font-mono border border-primary/5">
          api/buyer/pedidoCancelado
        </code>.
      </p>
    </div>

    {/* Contenedor del Simulador  */}
    <div className="w-full bg-background rounded-3xl transition-all">
      <Simulador comprasIniciales={compras} apiKey={buyerApiKey} />
    </div>
  </main>
  )
}