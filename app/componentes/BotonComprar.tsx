'use client';
import { comprar } from '../actions/compras';

type Props = {
  idEvento: number;
  cantidad: number;
};

 export default function BotonComprar({
  idEvento,cantidad
}: Props) {

  async function handleComprar() {
    try {
      const resultado = await comprar({idEvento,cantidad,});

      alert(`Pedido: ${resultado.idPedido} Transacción: ${resultado.idTransaccion}`);

    } catch (error) {
      alert('Hubo un error en la compra');
    }
  } 

  return (
    <button onClick={handleComprar}>
      Comprar
    </button>
  );
}