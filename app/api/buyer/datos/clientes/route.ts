import { validarApiKey } from '@/lib/apiKey';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
     // Validar api key
        const buyerKey = process.env.BUYER_API_KEY;
        if (!validarApiKey(request, buyerKey)) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }
    const clientes = await prisma.usuarios.findMany();
    return NextResponse.json(clientes);
  } catch (error) {
    return NextResponse.json(null, { status: 400 });
  }
}