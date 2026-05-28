import { validarApiKey } from '@/lib/apiKey';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
     // Validar api key
        const paymentsKey = process.env.PAYMENTS_API_KEY;
        if (!validarApiKey(request, paymentsKey)) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }
    const { idPedido } = await request.json();

    if (!idPedido) {
      return NextResponse.json({ error: 'idPedido es requerido' }, { status: 400 });
    }
    //genera un idTransaccion simulado, luego lo obtendria de la app payments
    const numAleatorio = Math.floor(Math.random() * 900000) + 100000;

    return NextResponse.json({ message: 'transaccion nueva debug', idTransaccion: numAleatorio,  debug: 'VERSION NUEVA' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }
}