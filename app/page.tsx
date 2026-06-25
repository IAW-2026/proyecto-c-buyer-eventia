'use client';
import Link from 'next/link';
import Image from 'next/image'; 
import { Plus } from 'lucide-react';

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full flex-col bg-background text-on-background">
      {/* SECCIÓN 1: */}
      <section 
        aria-label="Presentación de Eventia"
        className="layout-container w-full max-w-6xl mx-auto flex flex-col justify-center px-6 py-10 md:py-16"
      >
        {/* Contenedor flexible en móvil que pasa a grilla en escritorio */}
        <div className="flex flex-col justify-start md:justify-center w-full md:grid md:grid-cols-2 md:gap-12 items-center">
          
          {/* Columna Izquierda: Texto y Botón */}
          <div className="flex flex-col items-start space-y-4 max-w-xl w-full">
            
            {/* Tag rosa */}
            <span className="chip-retro text-[10px] md:text-label-sm px-2.5 py-0.5 md:px-3 md:py-1">
              Bienvenido a Eventia
            </span>

            {/* Título adaptable */}
            <h1 className="text-[32px] sm:text-4xl md:text-display-lg font-display text-on-background tracking-tight leading-none lowercase first-letter:uppercase">
              Descubrí, <br />
              crea y viví los <br />
              mejores <br />
              eventos
            </h1>

            <p className="text-sm md:text-body-lg text-on-surface-variant/80 font-body leading-relaxed max-w-md">
              La plataforma para organizar eventos, comprar entradas y gestionar pagos de manera simple, segura y confiable.
            </p>

            {/* Botón a cartelera */}
            <div className="pt-2 w-full sm:w-auto">
              <Link 
                href="/eventos" 
                className="btn-retro-secondary inline-block text-center px-10 py-3.5 font-label text-sm md:text-base tracking-wide"
              >
                Ver eventos
              </Link>
            </div>
          </div>

          {/* Columna Derecha / Imagen (Mejorada para Layout Shift en Lighthouse) */}
          <div className="relative w-full h-64 sm:h-80 md:h-[450px] mt-8 md:mt-0 rounded-3xl overflow-hidden shadow-soft-ambient">
            <Image
              src="/imgHome.jpeg" 
              alt="Personas disfrutando de un festival de música organizado en Eventia"
              fill 
              priority 
              sizes="(max-w-768px) 100vw, 50vw"
              className="object-cover" 
            />
          </div>

        </div>
      </section>

      {/* SECCIÓN 2: SECCIÓN MOTIVADORA*/}
      <section 
        aria-label="Explorar cartelera"
        className="w-full bg-[#650003] text-background px-6 py-16 md:py-24 flex flex-col items-center text-center relative overflow-hidden mt-auto"
      >
        {/* Círculos de diseño orgánicos usando opacidades seguras */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#fe9ea2]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#e0533c]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4 relative z-10">
          {/* Título de sección h2 para mantener una jerarquía SEO impecable */}
          <h2 className="font-display font-black text-3xl md:text-display-sm text-[#fe9ea2] uppercase tracking-tight leading-none max-w-2xl">
           Creá tu próximo evento hoy
          </h2>
          
          <p className="font-body text-sm md:text-body-lg text-background/80 font-medium max-w-md md:max-w-xl mt-2">
           Sumate a quienes ya gestionan sus entradas con Eventia.
          </p>

          <Link 
            href="https://proyecto-c-seller-eventia.vercel.app/" 
            className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-[#fe9ea2] hover:bg-[#fe9ea2]/90 text-[#650003] font-label font-bold text-sm rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
             Crear evento
          </Link>
        </div>
      </section>

    </main>
  );
}