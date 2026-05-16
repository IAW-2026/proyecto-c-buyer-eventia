'use server';

import { prisma } from "@/lib/prisma";

type ComprarArgs = {
  idEvento: number;
  cantidad: number;
};

export async function comprar({
  idEvento,
  cantidad,
}: ComprarArgs) {
    //control de cantidad para evitar que se hagan pedidos con cantidades no válidas
     if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new Error('Cantidad inválida');
    }
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    
    //verificar que hay stock suficiente para la cantidad que se quiere comprar, hago un fetch a seller.
    const eventoResponse = await fetch(
    `${baseUrl}/api/seller/eventos/${idEvento}`,
    {
      cache: 'no-store',
    }
  );

  if (!eventoResponse.ok) {
    throw new Error('Evento no encontrado');
  }

  const evento = await eventoResponse.json();

  if (cantidad > evento.stock) {
    throw new Error('Stock insuficiente');
  }

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
    if (!respuestaSeller.ok) {
    throw new Error('Error creando pedido');
  }
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
    if (!respuestaPayment.ok) {
    throw new Error('Error creando transacción');
      }
    const paymentData = await respuestaPayment.json();
    const { idTransaccion } = paymentData;
    
    // Ahora que tengo el idTransaccion, puedo guardar la compra en la base de datos. 
    try {
    const compraGuardada = await prisma.compras.create({
      data: {
        id_pedido: Number(idPedido),
        id_usuario: 1, // ID de usuario fijo provisional
        id_transaccion: Number(idTransaccion) ,
      },
    });
    console.log('Compra guardada directamente desde el Server Action:', compraGuardada);
  } catch (error) {
    console.error('Error al guardar en BD:', error);
    throw new Error('No se pudo registrar la compra en la base de datos');
  }
    
    const respuestaShipping = await fetch(`${baseUrl}/api/shipping/nuevaEntrada`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idPedido,
      }),
    });
    if (!respuestaShipping.ok) {
    throw new Error('Error creando shipping');
}

    //if (respuestaPayment.status === 201 && respuestaShipping.status === 201) 
    return {
    ok: true,
    idPedido,
    idTransaccion,
    };
}
