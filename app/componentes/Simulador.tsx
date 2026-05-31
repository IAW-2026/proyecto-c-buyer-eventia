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
    <div className="bg-background rounded-2xl border border-on-surface/10 shadow-soft-ambient overflow-hidden">
      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {compras.length === 0 ? (
          <p className="p-8 text-center text-on-surface-variant/60 font-body text-sm">
            No quedan pedidos disponibles en la Base de Datos.
          </p>
        ) : (
          <table className="w-full text-left border-collapse text-sm font-body">
            {/* Header de la tabla integrado a la paleta */}
            <thead className="bg-[#650003]/5 text-[#650003] font-semibold sticky top-0 border-b border-on-surface/10 backdrop-blur-md">
              <tr>
                <th className="p-4 w-16 text-center">Seleccionar</th>
                <th className="p-4">ID Pedido</th>
                <th className="p-4">ID Usuario</th>
                <th className="p-4">ID Evento</th>
                <th className="p-4 text-center">Cantidad</th>
              </tr>
            </thead>
            
            {/* Cuerpo de la tabla */}
            <tbody className="divide-y divide-on-surface/5 text-on-surface-variant">
              {compras.map((compra) => {
                const estaSeleccionado = seleccionados.includes(compra.id_pedido);
                return (
                  <tr 
                    key={compra.id_pedido} 
                    className={`transition-colors duration-150 ${
                      estaSeleccionado 
                        ? 'bg-[#fe9ea2]/10 hover:bg-[#fe9ea2]/15' 
                        : 'hover:bg-on-surface/5'
                    }`}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={estaSeleccionado}
                        onChange={() => toggleSeleccion(compra.id_pedido)}
                        className="h-4 w-4 rounded-md border-on-surface/20 text-[#650003] focus:ring-[#650003] focus:ring-offset-background cursor-pointer transition"
                      />
                    </td>
                    <td className="p-4 font-mono font-bold text-[#650003] text-xs">
                      {compra.id_pedido}
                    </td>
                    <td className="p-4 text-xs font-mono text-on-surface-variant/70 truncate max-w-[150px]">
                      {compra.id_usuario}
                    </td>
                    <td className="p-4 font-medium text-sm">
                      {compra.id_evento}
                    </td>
                    <td className="p-4 font-bold text-center text-primary">
                      {compra.cantidad}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>

    {/* Botón de acción  */}
    <div className="flex items-center gap-4">
      <button
        onClick={ejecutarSimulacion}
        disabled={seleccionados.length === 0 || cargando}
        className="px-6 py-3 bg-[#fe9ea2] hover:opacity-90 text-[#650003] text-sm font-label font-bold rounded-2xl transition-all shadow-soft-ambient disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
      >
        {cargando ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[#650003]/30 border-t-[#650003] rounded-full animate-spin" />
            Procesando cancelación...
          </span>
        ) : (
          `Cancelar ${seleccionados.length} pedidos seleccionados`
        )}
      </button>
    </div>

    {/* RENDERIZADO DEL RESULTADO DE LA API: Modo terminal integrada premium */}
    {resultadoApi && (
      <div className="p-5 rounded-2xl bg-[#650003]/95 text-pink-100 font-mono text-xs space-y-3 border border-[#650003] shadow-lg relative overflow-hidden">
        {/* Glow sutil de fondo para la consola */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#fe9ea2]/10 rounded-full blur-2xl pointer-events-none" />
        
        <p className="text-pink-200/80 border-b border-[#fe9ea2]/20 pb-2 text-xs font-sans font-semibold flex items-center justify-between">
          <span>Status del Endpoint:</span> 
          <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
            resultadoApi.ok 
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
          }`}>
            {resultadoApi.status}
          </span>
        </p>
        
        <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60 custom-scrollbar text-pink-100/90 selection:bg-[#fe9ea2] selection:text-[#650003]">
          {JSON.stringify(resultadoApi.body, null, 2)}
        </pre>
      </div>
    )}
  </div>
);
}