'use server';

import { prisma } from "@/lib/prisma";
import { get } from "http";
import { getOrCreateUser } from "./usuarios";
import { eventos } from "../data/eventos";

type ComprarArgs = {
  idEvento: number;
  cantidad: number;
};
 
type EventoSeller = {
  idEvento: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  categoria: string;
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
    try{
    //obtener y asegurar el usuario en la BD
    const usuario = await getOrCreateUser();
    
    //control de cantidad para evitar que se hagan pedidos con cantidades no válidas
     if (!Number.isInteger(cantidad) || cantidad <= 0) {
      //Devolvemos un objeto de error controlado
      return { success: false, error: 'Cantidad inválida' };
    }
    const sellerKey = process.env.SELLER_API_KEY;
    //hago el POST a seller para crear el pedido
    const respuestaSeller = await fetch(
      `${sellerUrl}api/seller/pedidos`,
    
      {
        method: 'POST',

        headers: {
          'x-api-key': sellerKey ?? '',
        },

        body: JSON.stringify({
          idEvento,
          cantidad,
          idUsuario: usuario.id_usuario
        }),
      }
    );
    //extraer error para mostrar lo correcto en la pantalla del cliente
    if (!respuestaSeller.ok) {
      // Extraer error controlado
      try {
        const errorData = await respuestaSeller.json();
        // Mapeamos los errores técnicos a códigos
        if (errorData?.error?.includes("Stock insuficiente") || errorData?.error === "STOCK_INSUFICIENTE") {
          return { success: false, error: 'ENTRADAS_AGOTADAS' };
        }
        if (errorData?.error?.includes("Evento no encontrado") || errorData?.error === "EVENTO_NO_ENCONTRADO") {
          return { success: false, error: 'EVENTO_NO_ENCONTRADO' };
        }
        return { success: false, error: errorData?.error || 'Error creando el pedido' };
      } catch (e: any) {
        return { success: false, error: e.message || 'Error en el servidor de pedidos' };
      }
    }
    const data = await respuestaSeller.json();
    const { idPedido, monto } = data;
    const paymentsKey = process.env.PAYMENTS_API_KEY;
    //necesito usar esos datos para hacer los post a shipping y payments
    //hago POST a payments para crear la transacción
   const respuestaPayment = await fetch(`${paymentsUrl}api/payments/nuevaTransaccion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': paymentsKey ?? '',
      },
      body: JSON.stringify({
        idPedido, idEvento, monto, idComprador: usuario.id_usuario
      }),
    });

    if (!respuestaPayment.ok) {
    try {
      const errorData = await respuestaPayment.json();
      throw new Error(errorData?.error || 'Error creando transaccion de pago');
    } catch (e: any) {
      // Si no es un JSON válido lo que devolvió, pasamos el error tal cual
      throw new Error(e.message || 'Error en el servidor de pagos');
    }
    }

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
    //POST a shipping para generar la entrada
    const shippingKey = process.env.SHIPPING_API_KEY;
    const respuestaShipping = await fetch(`${shippingUrl}api/shipping/nuevaEntrada`, {
      method: 'POST',
      headers: {
         'x-api-key': shippingKey ?? '',
      },
      body: JSON.stringify({
        idPedido, idEvento, cantidad, idUsuario: usuario.id_usuario
      }),
    });
    
      if (!respuestaShipping.ok) {
      try {
        const errorData = await respuestaShipping.json();
        throw new Error(errorData?.error || 'Error creando entrada');
      } catch (e: any) {
        // Si no es un JSON válido lo que devolvió, pasamos el error tal cual
        throw new Error(e.message || 'Error en el servidor de shipping');
      }
    }
    //revalidatePath(`/eventos/${idEvento}`);
    //revalidatePath('/mis-eventos');
    return { success: true, idPedido };
  } catch (criticalError: any) {
    // Si algo explota (Prisma, Fetch falló), devolvemos un error anónimo
    console.error('CRITICAL SERVER ERROR:', criticalError);
    return { success: false, error: 'ERROR_TECNICO' };
  }
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
  const sellerApiKey = process.env.SELLER_API_KEY;
  const res = await fetch(`${sellerUrl}api/seller/eventos/${compra.id_evento}`, {
    headers: {
      // API Key en header igual que en el POST
      'x-api-key': sellerApiKey ?? '', 
    },
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
  const paymentsKey = process.env.PAYMENTS_API_KEY;
  const cancelarPaymentsRes = await fetch(`${paymentsUrl}api/payments/pedidoCancelado`, {
    method: 'POST', 
    headers: {
      'x-api-key': paymentsKey ?? '',
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
  const shippingKey = process.env.SHIPPING_API_KEY;
  const cancelarShippingRes = await fetch(`${shippingUrl}api/shipping/pedidoCancelado`, {
    method: 'POST',
    headers: {
      'x-api-key': shippingKey ?? '',
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