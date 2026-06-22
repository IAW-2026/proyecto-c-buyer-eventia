import { validarApiKey } from '@/lib/apiKey';
import { NextResponse } from 'next/server';
import { cancelarPedido } from '@/app/actions/compras';

export async function POST(request: Request) {
  try {
     // Validar api key
        const buyerKey = process.env.BUYER_API_KEY;
        if (!validarApiKey(request, buyerKey)) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }
    const body = await request.json();
    const idPedido = body.idPedido;

    if (!idPedido || typeof idPedido !== 'number') {
      return NextResponse.json(null, { status: 400 });
    }

    await cancelarPedido({ idPedido }); //uso server action

    return NextResponse.json(
      { message: 'Pedido cancelado exitosamente' },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(null, { status: 400 });
  }
}