'use server';

type ComprarArgs = {
  idEvento: number;
  cantidad: number;
};

export async function comprar({
  idEvento,
  cantidad,
}: ComprarArgs) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    //hago el POST a seller para crear el pedido
    const respuestaSeller = await fetch(
      `${baseUrl}/api/seller/pedidos`,
    
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
     //if (!respuestaSeller.ok) {
    // throw new Error('Error creando pedido');
     //}
    const data = await respuestaSeller.json();
    const { idPedido, monto } = data;
   // alert(`Pedido creado: ${idPedido} y monto: ${monto} `);

    //necesito usar esos datos para hacer los post a shipping y payments
    //hago POST a payments para crear la transacción
   const respuestaPayment = await fetch(`${baseUrl}/api/payments/nuevaTransaccion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idPedido,
      }),
    });
     // if (!respuestaPayment.ok) {
    //throw new Error('Error creando transacción');
     // }
    const paymentData = await respuestaPayment.json();
    const { idTransaccion } = paymentData;
    
    // Ahora que tengo el idTransaccion, puedo guardar la compra en la base de datos. 
   /* const respuestaCompra = await fetch(`${baseUrl}/api/compras`, {
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
    */

    const respuestaShipping = await fetch(`${baseUrl}/api/shipping/nuevaEntrada`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idPedido,
      }),
    });
    //if (!respuestaShipping.ok) {
   // throw new Error('Error creando shipping');
   // }

    //if (respuestaPayment.status === 201 && respuestaShipping.status === 201) 
    return {
    ok: true,
    idPedido,
    idTransaccion,
    };
}
