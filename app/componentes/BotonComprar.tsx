'use client';

type Props = {
  idEvento: number;
  cantidad: number;
};

 export default function BotonComprar({
  idEvento,cantidad
}: Props) {

  async function comprar() {

    const respuestaSeller = await fetch(
      '/api/seller/pedidos',
    
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

    const data = await respuestaSeller.json();
    const { idPedido, monto } = data;
    alert(`Pedido creado: ${idPedido} y monto: ${monto} `);

    //necesito usar esos datos para hacer los post a shipping y payments
   // const respuestaPayment = await fetch('http://localhost:PUERTO_PAYMENTS/payments/nuevaTransaccion', {
   const respuestaPayment = await fetch('/api/payments/nuevaTransaccion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idPedido,
      }),
    });
    const paymentData = await respuestaPayment.json();
    const { idTransaccion } = paymentData;
     alert(`Transacción creada: ${idTransaccion} `);
    
    // Ahora que tengo el idTransaccion, puedo hacer el POST a compras para guardar la compra en la base de datos
    const respuestaCompra = await fetch('/api/compras', {
      method: 'POST',
      headers: {      'Content-Type': 'application/json',               
      },
      body: JSON.stringify({
        idUsuario: 1, 
        idPedido,
        idTransaccion,  
      }),
    }); 
    if (respuestaCompra.status === 201) {alert('Compra guardada en la base de datos');}

    const respuestaShipping = await fetch('/api/shipping/nuevaEntrada', {
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
}