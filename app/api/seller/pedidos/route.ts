import { NextResponse } from 'next/server';
import { eventos } from '@/app/data/eventos';
import { validarApiKey } from '@/lib/apiKey';

export async function POST(request: Request) {
  // Validar api key
  const sellerKey = process.env.SELLER_API_KEY;
  if (!validarApiKey(request, sellerKey)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { idEvento, cantidad, idUsuario } = body;
  console.log("seller Petición recibida :");
  console.log(JSON.stringify(body, null, 2));

  const evento = eventos.find((e) => e.idEvento === idEvento);

  // Validar si el evento existe
  if (!evento) {
    return NextResponse.json(
      { error: 'EVENTO_NO_ENCONTRADO', message: 'El evento no existe.' },
      { status: 404 }
    );
  }

  // Validar si ya se quedó sin stock de antemano
  if (evento.stock <= 0) {
    return NextResponse.json(
      { error: 'ENTRADAS_AGOTADAS', message: '¡Lo sentimos! No hay suficiente cantidad de entradas.' },
      { status: 400 }
    );
  }

  // Validar si la cantidad solicitada supera al stock actual 
  if (cantidad > evento.stock) {
    return NextResponse.json(
      { error: 'STOCK_INSUFICIENTE', message: `Stock insuficiente. Solo quedan ${evento.stock} entradas.` },
      { status: 400 }
    );
  }

  // decremento el stock solo para simular la compra en el front, del stock se encarga la aplicacion seller 
  evento.stock -= cantidad;
  
  return NextResponse.json({
    idPedido: Math.floor(Math.random() * 1000) + 1,
    monto: evento.precio * cantidad,
  });
}