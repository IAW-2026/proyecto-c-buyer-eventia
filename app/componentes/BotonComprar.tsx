'use client';
import { useState } from 'react';
import { comprar } from '../actions/compras';

type Props = {
  idEvento: number;
  stock: number;
};

 export default function BotonComprar({
  idEvento,stock
}: Props) {
   const [cantidad, setCantidad] = useState(stock > 0 ? 1 : 0);
  async function handleComprar() {
    try {
      const resultado = await comprar({idEvento,cantidad,});

      alert(`Pedido: ${resultado.idPedido} Transacción: ${resultado.idTransaccion}`);

    } catch (error) {
     console.error(error);

    if (error instanceof Error) {
      if (error.message === "NEXT_REDIRECT") {
      throw error; }
      alert(error.message);
    } else {
      alert('Error desconocido');
    }
    }
  } 
  const botonDeshabilitado = cantidad <= 0;
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
        {stock > 0 ? 'Comprar' : 'Agotado'}
      </button>
    </div>
  );
}