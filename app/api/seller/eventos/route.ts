//import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { NextResponse } from 'next/server';
import { eventos } from '@/app/data/eventos';
import { validarApiKey } from '@/lib/apiKey';

export async function GET(request: Request) {
  try {
    // Validamos la API Key antes de devolver los eventos
      const sellerKey = process.env.SELLER_API_KEY;
      if (!validarApiKey(request, sellerKey)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
   }

    return NextResponse.json(eventos, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'No se pudieron obtener eventos' },
      { status: 500 }
    );
  }
}
