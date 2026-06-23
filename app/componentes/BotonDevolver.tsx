'use client';
import { useTransition } from 'react'; 
import { cancelarPedido } from '../actions/compras';
import { useState } from 'react';
//import { useRouter } from 'next/navigation';

type Props = {
  idPedido: number;
};

export default function BotonDevolver({ idPedido }: Props) {
  const [isPending, startTransition] = useTransition(); //  hook  de Next.js para manejar estados de transición
  const [error, setError] = useState<string | null>(null);
  //const router = useRouter();
  const handleCancelarPedido = () => {
    if (!confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
      return;
    }
    setError(null);
    // startTransition agrupa todo el proceso asíncrono
    startTransition(async () => {
      try {
        const result = await cancelarPedido({ idPedido });

        if (!result.success) {
          setError('Error al cancelar el pedido');
        }else {
        //  router.refresh(); 
        }
        
      } catch (error: any) {
        setError(error.message || 'Hubo un error al cancelar');
      }
    });
  };

  return (
    <div>
    <button
      onClick={handleCancelarPedido}
      disabled={isPending} // se deshabilita mientras borra  y se actualiza la página
      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Cancelando...' : 'Devolver entradas'}
    </button>
    {error && (
        <div className="mt-2 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}