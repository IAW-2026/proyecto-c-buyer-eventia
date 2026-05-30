'use client';
import { useState } from 'react';
import { comprar } from '../actions/compras';
import Link from 'next/link';

type Props = {
  idEvento: number;
  stock: number;
};

 export default function BotonComprar({
  idEvento,stock
}: Props) {
  const [cantidad, setCantidad] = useState(stock > 0 ? 1 : 0);
  const [cargando, setCargando] = useState(false);
  
  // Estados para controlar los carteles en pantalla
  const [mensajeExito, setMensajeExito] = useState<{ idPedido: any} | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  async function handleComprar() {
    setCargando(true);
    setMensajeError(null);
    setMensajeExito(null);
    try {
      const resultado = await comprar({ idEvento, cantidad });
      // Si sale todo bien, guardamos los datos del éxito
      setMensajeExito({ idPedido: resultado.idPedido });
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
    <div> 
     <label>Cantidad de entradas: </label>

      <input
        type="number"
        min={stock > 0 ? 1 : 0}
        max={stock}
        value={cantidad}
        onChange={(e) =>
          setCantidad(Number(e.target.value))}
      />
    <button 
        onClick={handleComprar} 
        disabled={botonDeshabilitado}
        className="
          w-full
          rounded-lg
          border
          border-slate-300
          bg-slate-900
          px-4
          py-2
          text-white
          transition
          
          /* Estilos cuando el botón está activo */
          hover:bg-slate-700 
          
          /* Estilos cuando el botón está DESHABILITADO */
          disabled:cursor-not-allowed
          disabled:bg-slate-300
          disabled:text-slate-500
          disabled:border-slate-300
        " 
      >
        {cargando ? 'Procesando compra...' : stock > 0 ? 'Comprar Entradas' : 'Agotado'}
      </button>

      {/*CARTEL DE ÉXITO */}
      {mensajeExito && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 animate-fadeIn">
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-base"> ¡Pedido realizado con éxito!</span>
            <p className="text-xs text-emerald-800">
              Tu pedido <span className="font-mono font-bold">#{mensajeExito.idPedido} fue procesado </span>.
            </p>
            <Link 
              href="/mis-eventos" 
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition w-full"
            >
              Ver mi entrada en "Mis Eventos"
            </Link>
          </div>
        </div>
      )}

      {/* CARTEL DE ERROR  */}
      {mensajeError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-950 text-xs font-medium animate-fadeIn">
          ❌ {mensajeError}
        </div>
      )}

    </div>
  );
}