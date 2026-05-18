'use server';

import { prisma } from "@/lib/prisma";
import { get } from "http";
import { getOrCreateUser } from "./usuarios";

type ComprarArgs = {
  idEvento: number;
  cantidad: number;
};
 

export async function comprar({
  idEvento,
  cantidad,
}: ComprarArgs) {
    //url de seller, payments y shipping para apis 
     const sellerUrl =   process.env.URL_SELLER ?? 'http://localhost:3000/';
     const paymentsUrl = process.env.URL_PAYMENTS ?? 'http://localhost:3000/';
     const shippingUrl = process.env.URL_SHIPPING ?? 'http://localhost:3000/';

    //obtener y asegurar el usuario en la BD
    const usuario = await getOrCreateUser();
    
    //control de cantidad para evitar que se hagan pedidos con cantidades no válidas
     if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new Error('Cantidad inválida');
    }

    //hago el POST a seller para crear el pedido
    const respuestaSeller = await fetch(
      `${sellerUrl}api/seller/pedidos`,
    
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
   const respuestaPayment = await fetch(`${paymentsUrl}api/payments/nuevaTransaccion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idPedido,
      }),
    });
    //if (!respuestaPayment.ok) {
    //throw new Error('Error creando transacción');
    //  }

    const paymentData = await respuestaPayment.json();
    console.log('PAYMENT DATA:', paymentData);
    const { idTransaccion } = paymentData;
    console.log('ID TRANSACCION:', idTransaccion);
    //temporalmente 
    if (!idTransaccion) {
     throw new Error(
    `idTransaccion inválido: ${JSON.stringify(paymentData)}`
    );
}
    // Ahora que tengo el idTransaccion, puedo guardar la compra en la base de datos. 
    try {
    const compraGuardada = await prisma.compras.create({
      data: {
        id_pedido: Number(idPedido),
        id_usuario:  usuario.id_usuario,
        id_transaccion: Number(idTransaccion) ,
      },
    });
    console.log('Compra guardada directamente desde el Server Action:', compraGuardada);
  } catch (error) {
    console.error('Error al guardar en BD:', error);
    throw new Error('No se pudo registrar la compra en la base de datos');
  }
    
    const respuestaShipping = await fetch(`${shippingUrl}api/shipping/nuevaEntrada`, {
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
    return {
    ok: true,
    idPedido,
    idTransaccion,
    };
}
