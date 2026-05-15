import { NextResponse } from 'next/server';
import { eventos } from '@/app/data/eventos';

export async function POST(request: Request) {

  const body = await request.json();

  const { idEvento, cantidad } = body;
 
  const evento = eventos.find(
    (e) => e.idEvento === idEvento
  );

  if (!evento) {
    return NextResponse.json(
      { error: 'Evento no encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    idPedido: Math.floor(Math.random() * 1000)+1,
    monto: evento.precio * cantidad,
  });
}