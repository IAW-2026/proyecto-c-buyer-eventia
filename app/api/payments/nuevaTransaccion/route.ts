import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { idPedido } = await request.json();

    if (!idPedido) {
      return NextResponse.json({ error: 'idPedido es requerido' }, { status: 400 });
    }
    //genera un idTransaccion simulado, luego lo obtendria de la app payments
    const numAleatorio = Math.floor(Math.random() * 900000) + 100000;

    return NextResponse.json({ message: 'Transacción creada', idTransaccion: numAleatorio }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }
}