//import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { NextResponse } from 'next/server';
import { eventos } from '@/app/data/eventos';

export async function GET() {
  return NextResponse.json(eventos);
}
