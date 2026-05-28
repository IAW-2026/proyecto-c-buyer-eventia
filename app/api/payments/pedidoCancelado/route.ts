import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
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