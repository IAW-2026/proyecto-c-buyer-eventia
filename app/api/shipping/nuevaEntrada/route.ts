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