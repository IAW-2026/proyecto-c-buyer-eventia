'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Compra {
  id_pedido: number;
  id_usuario: string;
  id_evento: number;
  cantidad: number;
}

interface Props {
  comprasIniciales: Compra[];
  apiKey: string;
}

export default function VistaSimuladorClient({ comprasIniciales, apiKey }: Props) {
  const router = useRouter();
  const [compras, setCompras] = useState<Compra[]>(comprasIniciales);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [cargando, setCargando] = useState(false);
  const [resultadoApi, setResultadoApi] = useState<any>(null);

  // Manejar el marcado/desmarcado de checkboxes
  const toggleSeleccion = (id: number) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Enviar el arreglo al POST de nuestra API
  const ejecutarSimulacion = async () => {
    if (seleccionados.length === 0) return;
    
    setCargando(true);
    setResultadoApi(null);

    try {
      const response = await fetch('/api/buyer/pedidoCancelado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Mandamos la clave que tu función "validarApiKey" espera recibir
          'x-api-key': apiKey, 
        },
        body: JSON.stringify({
          idsPedidos: seleccionados,
        }),
      });

      const data = await response.json();
      setResultadoApi({
        status: response.status,
        ok: response.ok,
        body: data,
      });

      if (response.ok) {
        // Limpiamos los seleccionados y actualizamos la lista visual filtrando los borrados
        setCompras((prev) => prev.filter((c) => !seleccionados.includes(c.id_pedido)));
        setSeleccionados([]);
        router.refresh(); // Refresca los componentes de servidor si fuese necesario
      }
    } catch (error) {
      console.error(error);
      setResultadoApi({ error: 'Error de red o excepción inesperada' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Listado de Pedidos con Checkboxes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="max-h-80 overflow-y-auto">
          {compras.length === 0 ? (
            <p className="p-8 text-center text-slate-500 text-sm">No quedan pedidos disponibles en la Base de Datos.</p>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 text-slate-700 font-medium sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="p-4 w-12">Seleccionar</th>
                  <th className="p-4">ID Pedido</th>
                  <th className="p-4">ID Usuario</th>
                  <th className="p-4">ID Evento</th>
                  <th className="p-4">Cantidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {compras.map((compra) => (
                  <tr key={compra.id_pedido} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={seleccionados.includes(compra.id_pedido)}
                        onChange={() => toggleSeleccion(compra.id_pedido)}
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900">{compra.id_pedido}</td>
                    <td className="p-4 text-xs text-slate-500 truncate max-w-[150px]">{compra.id_usuario}</td>
                    <td className="p-4">{compra.id_evento}</td>
                    <td className="p-4 font-medium">{compra.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Botón de acción */}
      <div className="flex items-center gap-4">
        <button
          onClick={ejecutarSimulacion}
          disabled={seleccionados.length === 0 || cargando}
          className="px-5 py-2.5 bg-sky-600 text-white rounded-xl font-medium text-sm shadow hover:bg-sky-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {cargando ? 'Procesando cancelación...' : `Cancelar ${seleccionados.length} pedidos seleccionados`}
        </button>
      </div>

      {/* RENDERIZADO DEL RESULTADO DE LA API */}
      {resultadoApi && (
        <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
          <p className="text-slate-400 border-b border-slate-800 pb-2 text-sm font-sans font-semibold">
            Status del Endpoint: <span className={resultadoApi.ok ? "text-emerald-400" : "text-rose-400"}>{resultadoApi.status}</span>
          </p>
          <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {JSON.stringify(resultadoApi.body, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}