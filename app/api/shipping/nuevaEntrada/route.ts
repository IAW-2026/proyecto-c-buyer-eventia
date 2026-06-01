import { NextResponse } from 'next/server';
import { validarApiKey } from '@/lib/apiKey';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idPedido, idEvento, cantidad, idUsuario} = body;
    console.log("shipping Petición recibida :");
    console.log(JSON.stringify(body, null, 2));
     // Validar api key
    const shippingKey = process.env.SHIPPING_API_KEY;
    if (!validarApiKey(request, shippingKey)) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    if (!idPedido) {
      return NextResponse.json(
        { error: 'idPedido es requerido' },
        { status: 400 }
      );
    }


    return NextResponse.json(
      { message: 'Entrada de shipping creada' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Body inválido' },
      { status: 400 }
    );
  }
}