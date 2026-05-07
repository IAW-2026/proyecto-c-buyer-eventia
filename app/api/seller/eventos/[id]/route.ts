import { NextResponse } from 'next/server';
import { eventos } from '@/app/data/eventos';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: Params
) {
  const { id } = await params;

  const idEvento = Number(id);

  const evento = eventos.find(
    (e) => e.idEvento === idEvento
  );

  if (!evento) {
    return NextResponse.json(
      { error: 'Evento no encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json(evento);
}