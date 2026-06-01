import { validarApiKey } from '@/lib/apiKey';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
     // Validar api key
    const paymentsKey = process.env.PAYMENTS_API_KEY;
    if (!validarApiKey(request, paymentsKey)) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { idPedido } = await request.json();
    if (!idPedido) {
      return NextResponse.json(
        { error: 'idPedido es requerido' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { status: 204 }
    );
  } catch {
    return NextResponse.json(
      { error: 'no se pudo procesar el pedido cancelado' },
      { status: 500 }
    );
  }
}