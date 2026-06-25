'use client';
import { useTransition, useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';
import { cancelarPedido } from '../actions/compras';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom'; 

type Props = {
  idPedido: number;
};

export default function BotonDevolver({ idPedido }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para asegurarnos de que el código corre en el cliente antes de usar el Portal
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const procesarCancelacion = () => {
    setMostrarConfirmacion(false);
    setError(null);

    startTransition(async () => {
      try {
        const result = await cancelarPedido({ idPedido });
        
        if (!result || !result.success) {
          throw new Error('Error al cancelar el pedido');
        }
        
        setMensajeExito('¡Entradas devueltas exitosamente!');
        router.refresh();

        setTimeout(() => setMensajeExito(null), 4000);

      } catch (err: any) {
       const msg: string = err.message || '';

      // Detectamos el prefijo que pusimos en la server action
      if (msg.startsWith('PAYMENTS_ERROR:')) {
        const [, status, ...rest] = msg.split(':');
        const detalle = rest.join(':');

        if (status === '409') {
          setError('No se pueden devolver las entradas porque el pago aún no está aprobado.');
        } else {
          setError(`Error en el sistema de pagos: ${detalle}`);
        }
      } else {
        setError(msg || 'Hubo un error al cancelar');
      }
      }
    });
  };

  return (
    <>
      <button
        onClick={() => {
          if (!isPending && !mensajeExito) setMostrarConfirmacion(true);
        }}
        disabled={isPending}
        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Cancelando...' : mensajeExito ? 'Devuelto' : 'Devolver entradas'}
      </button>

      {/* 2. ENVOLVER EL MODAL Y EL TOAST EN UN PORTAL AL BODY */}
      {mounted && createPortal(
        <>
          {/* El modal ahora se renderiza al final del HTML real, evitando los bugs de la tabla */}
          {mostrarConfirmacion && (
            <div 
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setMostrarConfirmacion(false)}
            >
              <div 
                className="w-full max-w-md rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-xl max-sm:mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold text-[#2c2a28]">
                      ¿Confirmar devolución?
                    </h3>
                    <p className="font-body mt-2 text-sm text-[#6f5a50]">
                      Estás a punto de cancelar el pedido <strong>#{idPedido}</strong>. Esta acción devolverá las entradas.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setMostrarConfirmacion(false)}
                    className="rounded-lg border border-[#eadfd2] px-4 py-2 text-sm font-medium text-[#6f5a50] transition hover:bg-[#ebdfd4]/30"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={procesarCancelacion}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                  >
                    Sí, devolver
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notificación de éxito también teletransportada al body */}
          {mensajeExito && (
            <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-lg">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span className="font-medium">{mensajeExito}</span>
              <button onClick={() => setMensajeExito(null)} className="ml-2 text-emerald-600 hover:text-emerald-800">
                <X size={14} />
              </button>
            </div>
          )}
        </>,
        document.body // <-- Destino del Portal
      )}

      {/* El mensaje de error sí lo dejamos abajo del botón porque es un texto chiquito */}
      {error && (
        <div className="mt-2 block rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X size={12} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}