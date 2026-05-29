import { validarApiKey } from '@/lib/apiKey';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
     // Validar api key
        const buyerKey = process.env.BUYER_API_KEY;
        if (!validarApiKey(request, buyerKey)) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }
    const body = await request.json();
    const idsPedidos= body.idsPedidos;

    if (!idsPedidos || !Array.isArray(idsPedidos)) {
      return NextResponse.json(null, { status: 400 });
    }

    const resultado = await prisma.compras.deleteMany({
      where: {
        id_pedido: {
          in: idsPedidos,
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Pedidos cancelados exitosamente',
        eliminados: resultado.count,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(null, { status: 400 });
  }
}