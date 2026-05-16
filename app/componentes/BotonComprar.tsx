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
   const [cantidad, setCantidad] = useState(1);
  async function handleComprar() {
    try {
      const resultado = await comprar({idEvento,cantidad,});

      alert(`Pedido: ${resultado.idPedido} Transacción: ${resultado.idTransaccion}`);

    } catch (error) {
      alert('Hubo un error en la compra');
    }
  } 

  return (
    <div> 
     <label>Cantidad de entradas:</label>

      <input
        type="number"
        min={1}
        max={stock}
        value={cantidad}
        onChange={(e) =>
          setCantidad(Number(e.target.value))
        }
      />
    <button onClick={handleComprar} className="
      rounded-lg
      border
      border-slate-300
      bg-slate-900
      px-4
      py-2
      text-white
      transition
      hover:bg-slate-700 " >
      Comprar
    </button>
    </div>
  );
}