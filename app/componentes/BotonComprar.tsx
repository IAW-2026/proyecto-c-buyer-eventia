'use client';

type Props = {
  idEvento: number;
  cantidad: number;
};

/* export default function BotonComprar({
  idEvento,cantidad
}: Props) {

  async function comprar() {

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/seller/pedidos`,
    
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          idEvento,
          cantidad,
        }),
      }
    );

    const data = await response.json();
    const { idPedido, monto } = data;
    alert(`Pedido creado: ${idPedido} y monto: ${monto} `);

    //necesito usar esos datos para hacer los post a shipping y payments
   // const respuestaPayment = await fetch('http://localhost:PUERTO_PAYMENTS/payments/nuevaTransaccion', {
   const respuestaPayment = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/nuevaTransaccion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idPedido,
      }),
    });

    const respuestaShipping = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shipping/nuevaEntrada`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idPedido,
      }),
    });

    if (respuestaPayment.status === 201 && respuestaShipping.status === 201) {
      alert(`se creo nueva transacción ynueva entrada de shipping para el pedido ${idPedido}`);
    }
    else {      alert(`Hubo un error al crear la transaccion o la entrada de shipping para el pedido ${idPedido}`);
    }
  }

  return (
    <button onClick={comprar}>
      Comprar
    </button>
  );
}*/