//import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { NextResponse } from 'next/server';
import { eventos } from '@/app/data/eventos';

export async function GET() {
  try {
    return NextResponse.json(eventos, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'No se pudieron obtener eventos' },
      { status: 500 }
    );
  }
}
