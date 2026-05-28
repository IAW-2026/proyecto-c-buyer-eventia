'use server';

import { prisma } from "@/lib/prisma";
import { get } from "http";
import { getOrCreateUser } from "./usuarios";

type ComprarArgs = {
  idEvento: number;
  cantidad: number;
};
 
type EventoSeller = {
  idEvento: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  precio: number;
  stock: number;
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
        cantidad: cantidad,
        id_evento: idEvento,
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

//Server Action para cancelar un pedido
export async function cancelarPedido({ idPedido }: { idPedido: number }) {
  // obtengo el registro de compra de la base de datos
  const compra = await prisma.compras.findUnique({
    where: { id_pedido: idPedido },
  });

  if (!compra) {
    throw new Error('Pedido no encontrado.');
  }

  //  detalles del evento de la API del Vendedor para verificar la fecha original
  const sellerUrl = process.env.URL_SELLER ?? 'http://localhost:3000/';
  const res = await fetch(`${sellerUrl}api/seller/eventos/${compra.id_evento}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Error al obtener información del evento desde el sistema del vendedor.');
  }
  const eventoSeller: EventoSeller = await res.json(); // Casteamos al tipo EventoSeller
  const eventDate = new Date(eventoSeller.fecha); // Esta es la fecha original del evento
  // Re-verificar la regla de las 48 horas 
  const now = new Date();
  const differenceMs = eventDate.getTime() - now.getTime();
  const hoursRemaining = differenceMs / (1000 * 60 * 60);

  if (hoursRemaining <= 48) {
    throw new Error('No se puede cancelar el pedido. Faltan menos de 48 horas para el evento.');
  }

  // API de Payments para cancelar el pedido en el sistema de pagos
  const paymentsUrl = process.env.URL_PAYMENTS ?? 'http://localhost:3000/';
  const cancelarPaymentsRes = await fetch(`${paymentsUrl}api/payments/pedidoCancelado`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idPedido: compra.id_pedido,
    }),
  });
  
  if (!cancelarPaymentsRes.ok) {
    let errorMessage = cancelarPaymentsRes.statusText;
    const contentType = cancelarPaymentsRes.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await cancelarPaymentsRes.json();
      errorMessage = errorData.message || errorMessage;
    }
    console.error('Error de la API de Payments durante la cancelación:', errorMessage);
    throw new Error(`Error al cancelar el pedido en el sistema de pagos: ${errorMessage}`);
  }

  // API de Shipping para cancelar entradas
  const shippingUrl = process.env.URL_SHIPPING ?? 'http://localhost:3000/';
  const cancelarShippingRes = await fetch(`${shippingUrl}api/shipping/pedidoCancelado`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idPedido: compra.id_pedido,
    }),
  });
  
  if (!cancelarShippingRes.ok) {
    let errorMessage = cancelarShippingRes.statusText;
    const contentType = cancelarShippingRes.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await cancelarShippingRes.json();
      errorMessage = errorData.message || errorMessage;
    }
    console.error('Error de la API de Shipping durante la cancelación:', errorMessage);
    throw new Error(`Error al cancelar el pedido en el sistema de shipping: ${errorMessage}`);
  }

  //Eliminar el registro de compra de la base de datos
  await prisma.compras.delete({
    where: { id_pedido: idPedido },
  });

  return { success: true };
}
