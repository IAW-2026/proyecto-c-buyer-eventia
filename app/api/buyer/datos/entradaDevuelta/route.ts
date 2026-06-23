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
    
    // conversión a número por si llega como string
    const idPedido = body.idPedido ? Number(body.idPedido) : NaN;

    // Validar que sea un número válido y no un NaN (Not a Number)
    if (isNaN(idPedido)) {
      return NextResponse.json(
        { error: 'El campo idPedido es requerido y debe ser un número válido.' }, 
        { status: 400 }
      );
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