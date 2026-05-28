'use client';
import { useTransition } from 'react'; 
import { useRouter } from 'next/navigation';
import { cancelarPedido } from '../actions/compras';

type Props = {
  idPedido: number;
};

export default function BotonDevolver({ idPedido }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); //  hook  de Next.js para manejar estados de transición

  const handleCancelarPedido = () => {
    if (!confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
      return;
    }

    // startTransition agrupa todo el proceso asíncrono
    startTransition(async () => {
      try {
        const result = await cancelarPedido({ idPedido });
        if (!result.success) {
          throw new Error('Error al cancelar el pedido');
        }
        
        // Next.js refresca los datos del servidor 
        router.refresh(); 
      } catch (error: any) {
        alert(error.message || 'Hubo un error al cancelar');
      }
    });
  };

  return (
    <button
      onClick={handleCancelarPedido}
      disabled={isPending} // se deshabilita mientras borra  y se actualiza la página
      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Cancelando...' : 'Devolver entradas'}
    </button>
  );
}