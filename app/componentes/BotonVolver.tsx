// components/BotonVolver.tsx
'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BotonVolver() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 text-sm text-[#6f5a50] hover:text-[#2c2a28] transition"
    >
      <ArrowLeft size={16} />
      Volver
    </button>
  );
}