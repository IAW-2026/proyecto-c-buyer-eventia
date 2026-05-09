import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idUsuario, idPedido, idTransaccion } = body;

    if (!idPedido) {
      return NextResponse.json(
        { error: 'idPedido es requerido' },
        { status: 400 }
      );
    }

 const compra = await prisma.compras.create({
  data: {
    id_pedido: Number(idPedido),
    id_usuario: idUsuario ?? null,
    id_transaccion: idTransaccion ? Number(idTransaccion) : null,
  },
});

    return NextResponse.json(
      { message: 'Compra guardada', compra },
      { status: 201 }
    );
  } catch (error) {
     console.error(error);
    return NextResponse.json(
      { error: 'No se pudo guardar la compra' },
      { status: 500 }
    );
  } finally {
  }
}