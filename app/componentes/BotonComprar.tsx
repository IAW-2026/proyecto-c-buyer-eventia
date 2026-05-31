'use client';
import { useState } from 'react';
import { comprar } from '../actions/compras';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  idEvento: number;
  stock: number;
  precio: number;
};

 export default function BotonComprar({
  idEvento,stock,precio
}: Props) {
  const router = useRouter();
  const [cantidad, setCantidad] = useState(stock > 0 ? 1 : 0);
  const [cargando, setCargando] = useState(false);
  
  // Estados para controlar los carteles en pantalla
  const [mensajeExito, setMensajeExito] = useState<{ idPedido: any} | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  //Calculamos el total 
  // cambia "cantidad", React re-renderiza y este número se actualiza solo
  const precioTotal = precio * cantidad;

  async function handleComprar() {
    setCargando(true);
    setMensajeError(null);
    setMensajeExito(null);
    try {
      const resultado = await comprar({ idEvento, cantidad });
      // Si sale todo bien, guardamos los datos del éxito
      setMensajeExito({ idPedido: resultado.idPedido });
      // Forzamos a Next.js a refrescar los Server Components
      // Esto va a hacer que la página del evento vuelva a leer el stock de la API (que ahora restó)
      router.refresh();
    } catch (error: any) {
      console.error(error);

      if (error.message === "NEXT_REDIRECT") {
        throw error;
      }

      // Mapeamos los errores técnicos a textos legibles para el usuario
      if (error.message === "ENTRADAS_AGOTADAS" || error.message === "STOCK_INSUFICIENTE") {
        setMensajeError("¡Lo sentimos! Ya no quedan entradas disponibles para este evento.");
      } else if (error.message === "EVENTO_NO_ENCONTRADO") {
        setMensajeError("El evento que intentas comprar ya no se encuentra disponible.");
      } else {
        setMensajeError(error.message || "Hubo un problema al procesar tu pago. Inténtalo de nuevo.");
      }
    } finally {
      setCargando(false);
    }
  }

  const botonDeshabilitado = cantidad <= 0 || cargando || stock === 0;
  return (
  <div className="card-retro w-full max-w-sm bg-surface-container-low p-5 space-y-4"> 
    {/* Ocultamos los controles si la compra ya fue un éxito */}
    {!mensajeExito && (
      <>
        {/* Selector de cantidad  */}
        {stock > 0 && (
          <div className="flex items-center justify-between">
            <label className="label-retro text-sm font-bold !mb-0">Cantidad de entradas:</label>
            <input
              type="number"
              min={stock > 0 ? 1 : 0}
              max={stock}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="input-retro w-20 text-center font-bold focus:ring-[#650003] focus:border-[#650003]"
            />
          </div>
        )}

        {/* Renderizado del total a pagar */}
        {stock > 0 && (
          <div className="border-t border-primary/10 pt-3 flex items-center justify-between text-on-background">
            <span className="text-sm font-label font-bold text-on-surface-variant/80">Total a pagar:</span>
            {/* Resaltamos el precio  */}
            <span className="text-2xl font-black text-primary tracking-tight">
              ${precioTotal.toLocaleString('es-AR')}
            </span>
          </div>
        )}

        {/* Botón Comprar*/}
        <button 
          onClick={handleComprar} 
          disabled={botonDeshabilitado}
          className="btn-retro-primary w-full py-3 text-sm uppercase tracking-wider font-label font-bold cursor-pointer" 
        >
          {cargando ? 'Procesando compra...' : stock > 0 ? 'Comprar Entradas' : 'Agotado'}
        </button>
      </>
    )}

    {/* CARTEL DE ÉXITO  */}
    {mensajeExito && (
      <div className="rounded-xl border border-emerald-600/20 bg-emerald-500/10 p-4 text-emerald-900 animate-fadeIn font-body">
        <div className="flex flex-col gap-1.5">
          <span className="font-label font-bold text-base text-emerald-800 flex items-center gap-1.5"> 
            ¡Pedido realizado con éxito!
          </span>
          <p className="text-xs text-emerald-900/80 font-medium">
            Tu pedido <span className="font-mono font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-900">#{mensajeExito.idPedido}</span> fue procesado.
          </p>
          <Link 
            href="/mis-eventos" 
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2.5 text-xs font-label font-bold uppercase tracking-wider transition shadow-sm active:scale-[0.98]"
          >
            Ver mi entrada en "Mis Eventos"
          </Link>
        </div>
      </div>
    )}

    {/* CARTEL DE ERROR */}
    {mensajeError && (
      <div className="rounded-xl border border-rose-600/20 bg-rose-500/10 p-4 text-rose-950 text-xs font-label font-bold animate-fadeIn">
        ❌ {mensajeError}
      </div>
    )}

  </div>
  );
  
}