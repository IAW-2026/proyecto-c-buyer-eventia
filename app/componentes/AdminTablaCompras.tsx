"use client";

import { useState } from "react";

interface CompraProcesada {
  idPedido: number;
  nombreUsuario: string;
  idEvento: number;
  cantidadComprada: number;
  nombre: string;
}

export default function AdminTablaCompras({ compras }: { compras: CompraProcesada[] }) {
  const [busqueda, setBusqueda] = useState("");

  // Filtrado reactivo en el cliente
  const comprasFiltradas = compras.filter((compra) => {
    const termino = busqueda.toLowerCase();
    return (
      compra.idPedido.toString().includes(termino) ||
      compra.nombreUsuario.toLowerCase().includes(termino) ||
      compra.nombre.toLowerCase().includes(termino) ||
      compra.idEvento.toString().includes(termino)
    );
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Input de Filtro */}
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar por ID Pedido, Usuario, Evento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      {/* Contenedor de la Tabla Responsiva */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">ID Pedido</th>
              <th className="px-6 py-4">Comprador (nombre)</th>
              <th className="px-6 py-4">Evento (ID)</th>
              <th className="px-6 py-4 text-center">Cantidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comprasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                  No se encontraron compras que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              comprasFiltradas.map((compra) => (
                <tr key={compra.idPedido} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-teal-600">
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