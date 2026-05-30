'use client';
import { useState } from 'react';
import { comprar } from '../actions/compras';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  idEvento: number;
  stock: number;
  precio: number;
};

 export default function BotonComprar({
  idEvento,stock,precio
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 1. Si en la URL viene una cantidad guardada del login, la ponemos como estado inicial
  const cantidadInicial = searchParams.get('cantidad') 
    ? Number(searchParams.get('cantidad')) 
    : (stock > 0 ? 1 : 0);
  const [cantidad, setCantidad] = useState(cantidadInicial);
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
      
      //  Si falta autenticación, lo mandamos a loguearse sin perder los datos
      if (error.message === "AUTH_REQUIRED") {
        // 1. Obtenemos el dominio base 
        const baseUrl = process.env.URL_BUYER ?? 'http://localhost:3000/';

        // URL ABSOLUTA COMPLETA que Clerk exige en producción
        const urlCompletaRetorno = `${baseUrl}eventos/${idEvento}?cantidad=${cantidad}`;
        
        // 3. Encodemos la URL completa
        const URL_Retorno = encodeURIComponent(urlCompletaRetorno);
        
        // 4. Redireccionamos pasándole la URL absoluta a Clerk
        router.push(`/sign-in?redirect_url=${URL_Retorno}`);
        return;
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
    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm space-y-4"> 
      
      {/*Ocultamos los controles si la compra ya fue un éxito */}
      {!mensajeExito && (
        <>
          {/* Selector de cantidad estilizado */}
          {stock > 0 && (
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Cantidad de entradas:</label>
              <input
                type="number"
                min={stock > 0 ? 1 : 0}
                max={stock}
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="w-20 rounded-lg border border-slate-300 px-3 py-1.5 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>
          )}

          {/*Renderizado del total a pagar */}
          {stock > 0 && (
            <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between text-slate-900">
              <span className="text-sm font-medium text-slate-500">Total a pagar:</span>
              <span className="text-xl font-black text-slate-900">
                ${precioTotal.toLocaleString('es-AR')}
              </span>
            </div>
          )}

          {/* Botón Comprar */}
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
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              shadow-sm
              hover:bg-slate-700 
              disabled:cursor-not-allowed
              disabled:bg-slate-300
              disabled:text-slate-500
              disabled:border-slate-300
            " 
          >
            {cargando ? 'Procesando compra...' : stock > 0 ? 'Comprar Entradas' : 'Agotado'}
          </button>
        </>
      )}

      {/* CARTEL DE ÉXITO */}
      {mensajeExito && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 animate-fadeIn">
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-base"> ¡Pedido realizado con éxito!</span>
            <p className="text-xs text-emerald-800">
              Tu pedido <span className="font-mono font-bold">#{mensajeExito.idPedido}</span> fue procesado.
            </p>
            <Link 
              href="/mis-eventos" 
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition w-full shadow-sm"
            >
              Ver mi entrada en "Mis Eventos"
            </Link>
          </div>
        </div>
      )}

      {/* CARTEL DE ERROR */}
      {mensajeError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-950 text-xs font-medium animate-fadeIn">
          ❌ {mensajeError}
        </div>
      )}

    </div>
  );
  
}