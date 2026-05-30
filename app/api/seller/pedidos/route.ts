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
    const {idEvento, cantidad, idUsuario} = body;
    console.log("seller Petición recibida :");
    console.log(JSON.stringify(body, null, 2));
 
  const evento = eventos.find(
    (e) => e.idEvento === idEvento
  );

  if (!evento) {
    return NextResponse.json(
      { error: 'Evento no encontrado' },
      { status: 404 }
    );
  }
  //para simular la compra, restamos el stock del evento. 
  // Luego se hace para evitar problemas de concurrencia desde seller 
  evento.stock -= cantidad;
  
  return NextResponse.json({
    idPedido: Math.floor(Math.random() * 1000)+1,
    monto: evento.precio * cantidad,
  });
}