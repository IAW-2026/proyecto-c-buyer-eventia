'use client';
import Link from 'next/link';
import Image from 'next/image'; 

export default function Page() {
  return (
    /* h-screen y overflow-hidden congelan la pantalla. */
    <main className="layout-container h-screen overflow-hidden flex items-start md:items-center justify-center p-6 md:py-0 md:!pr-0">
      
      {/* Contenedor flexible en móvil que pasa a grilla en escritorio */}
      <div className="flex flex-col justify-start md:justify-center w-full h-full max-h-[95vh] pt-4 md:pt-0 md:grid md:grid-cols-2 md:gap-0 md:max-h-none">
        
        {/* Columna Izquierda: Texto y Botón */}
        <div className="flex flex-col items-start space-y-4 max-w-xl md:justify-center md:h-full">
          
          {/* Tag rosa */}
          <span className="chip-retro text-[10px] md:text-label-sm px-2.5 py-0.5 md:px-3 md:py-1">
            Bienvenido a Eventia
          </span>

          {/* Título adaptable */}
          <h1 className="text-[28px] sm:text-3xl md:text-display-lg font-display text-on-background tracking-tight leading-none lowercase first-letter:uppercase">
            Descubrí, <br />
            crea y viví los <br />
            mejores <br />
            eventos
          </h1>

          <p className="text-sm md:text-body-lg text-on-surface-variant/80 font-body leading-relaxed max-w-md">
            La plataforma para organizar eventos, vender entradas y gestionar pagos de manera simple, segura y confiable.
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

        {/* Columna Derecha / Imagen */}
        <div className="relative -mx-6 w-[calc(100%+3rem)] h-44 sm:h-52 max-h-[220px] mt-10 overflow-hidden md:w-full md:mx-0 md:h-full md:max-h-none md:mt-0">
          
          <Image
            src="/imgHome.jpeg" 
            alt="Patrón Retro Eventia"
            fill 
            priority 
            className="object-cover" 
          />

        </div>

      </div>
    </main>
  );
}