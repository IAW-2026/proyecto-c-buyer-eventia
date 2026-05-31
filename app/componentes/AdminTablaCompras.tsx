"use client";

import BusquedaFiltro from "@/app/componentes/BusquedaFiltro";

interface CompraProcesada {
  idPedido: number;
  nombreUsuario: string;
  idEvento: number;
  cantidadComprada: number;
  nombre: string;
  categoria: string; 
}

export default function AdminTablaCompras({ compras }: { compras: CompraProcesada[] }) {
  
  // EXTRAER CATEGORÍAS ÚNICAS: Mapeamos las categorías y usamos Set para eliminar duplicados
  const categoriasDisponibles = Array.from(
    new Set(compras.map((compra) => compra.categoria).filter(Boolean))
  );

  return (
    <div className="flex flex-col gap-4">
      
      {/* le pasamos la lista dinámica de categorías */}
      <BusquedaFiltro
        availableCategories={categoriasDisponibles}
        placeholder="Buscar por ID Pedido, Usuario, Evento..."
      />

      {/* Contenedor de la Tabla  */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">ID Pedido</th>
              <th className="px-6 py-4">Comprador (nombre)</th>
              <th className="px-6 py-4">Evento (ID)</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4 text-center">Cantidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {compras.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                  No se encontraron compras que coincidan con la búsqueda o los filtros aplicados.
                </td>
              </tr>
            ) : (
              compras.map((compra) => (
               
                <tr key={compra.idPedido} className="hover:bg-surface-container-low transition-colors duration-200">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-on-surface-variant/60">
                    #{compra.idPedido}
                  </td>
                  <td className="px-6 py-4">
                    <span className="block font-medium text-slate-900 truncate max-w-[180px]" title={compra.nombreUsuario}>
                      {compra.nombreUsuario}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{compra.nombre}</span>
                      <span className="text-xs text-slate-400 font-mono">ID: {compra.idEvento}</span>
                    </div>
                  </td>
                  {/* Celda de Categoría mapeada */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 capitalize">
                      {compra.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-900">
                    {compra.cantidadComprada}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}