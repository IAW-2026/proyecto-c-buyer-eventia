import { isAdminBuyer } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import Simulador from "@/app/componentes/Simulador";


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
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Simulador de Cancelación</h1>
        <p className="text-slate-600 text-sm mt-1">
          Selecciona los IDs de pedidos que deseas enviar al endpoint <code className="bg-slate-100 p-0.5 rounded text-xs">api/buyer/pedidoCancelado</code>.
        </p>
      </div>

      <Simulador comprasIniciales={compras} apiKey={buyerApiKey} />
    </main>
  );
}