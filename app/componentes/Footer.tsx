// app/components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#e0533c] text-[#650003] px-6 md:px-16 py-12 border-t border-[#650003]/10 font-body">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        
        {/* Lado Izquierdo: Branding */}
        <div className="flex flex-col gap-3 max-w-sm">
          <div className="flex items-center gap-2">
            <Image 
              src="/icon.png" 
              alt="Eventia Logo"
              width={32} 
              height={32}
              className="rounded-full object-cover"
            />
            {/* Usamos la tipografía impactante de tu logo si la tenés, o font-bold */}
            <span className="font-label font-bold text-lg uppercase tracking-wider text-[#650003]">
              Eventia
            </span>
          </div>
          <p className="text-sm text-[#650003]/80 font-medium leading-relaxed">
            Conectando personas con sus pasiones. Elevando la experiencia de tus eventos con Eventia.
          </p>
        </div>

        {/* Lado Derecho: Enlaces Rápidos */}
        <div className="flex flex-col gap-3">
          <h3 className="font-label font-bold text-xs uppercase tracking-widest text-[#650003]/60">
            Plataforma
          </h3>
          <nav className="flex flex-col gap-2 text-sm font-semibold">
            <Link href="/" className="hover:underline transition-all">
              Inicio
            </Link>
            <Link href="/eventos" className="hover:underline transition-all">
              Eventos
            </Link>
            <Link href="https://proyecto-c-seller-eventia.vercel.app/" className="hover:underline transition-all">
              Crear eventos
            </Link>
          </nav>
        </div>

      </div>

      {/* Barra Inferior de Copyright */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#650003]/10 text-xs font-medium text-[#650003]/70 flex flex-col sm:flex-row justify-between gap-4">
        <span className="text-xs inline-flex items-center gap-1">
            Hecho con 
            <Heart className="w-3.5 h-3.5 text-[#650003] fill-[#650003] animate-pulse" /> 
            para creadores de experiencias.
        </span>
      </div>
    </footer>
  );
}