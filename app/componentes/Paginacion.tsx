"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface PaginacionProps {
  totalPaginas: number;
}

export default function Paginacion({ totalPaginas }: PaginacionProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Leer la página actual de la URL (si no existe, es la 1)
  const paginaActual = Number(searchParams.get("page")) || 1;

  // Si solo hay 1 página o ninguna, no hace falta mostrar los botones
  if (totalPaginas <= 1) return null;

  function cambiarPagina(nuevaPagina: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", nuevaPagina.toString());
    
    // Cambia la URL de forma reactiva preservando otros filtros (como search)
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between bg-transparent px-5 py-4 mt-8 max-w-6xl mx-auto w-full font-body">
    {/* Vista Mobile (Botones */}
    <div className="flex flex-1 justify-between sm:hidden w-full">
      <button
        disabled={paginaActual <= 1}
        onClick={() => cambiarPagina(paginaActual - 1)}
        className="disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed relative inline-flex items-center rounded-xl bg-[#650003] text-[#fe9ea2] px-5 py-2.5 text-xs font-label font-bold uppercase tracking-wider transition-all hover:bg-[#650003]/90 active:scale-95"
      >
        Anterior
      </button>
      <button
        disabled={paginaActual >= totalPaginas}
        onClick={() => cambiarPagina(paginaActual + 1)}
        className="disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed relative inline-flex items-center rounded-xl bg-[#650003] text-[#fe9ea2] px-5 py-2.5 text-xs font-label font-bold uppercase tracking-wider transition-all hover:bg-[#650003]/90 active:scale-95"
      >
        Siguiente
      </button>
    </div>

    {/* Vista Desktop (Con indicador de página) */}
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
      <div>
        <p className="text-sm font-medium text-[#650003]/80">
          Mostrando página{" "}
          <span className="font-bold text-[#650003] bg-[#fe9ea2]/40 px-2.5 py-1 rounded-md mx-0.5">
            {paginaActual}
          </span>{" "}
          de <span className="font-bold text-[#650003]">{totalPaginas}</span>
        </p>
      </div>
      
      <div>
        <nav className="inline-flex gap-2" aria-label="Pagination">
          <button
            disabled={paginaActual <= 1}
            onClick={() => cambiarPagina(paginaActual - 1)}
            className="disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#650003] disabled:cursor-not-allowed relative inline-flex items-center rounded-xl border-2 border-[#650003] bg-transparent px-4 py-2 text-xs font-label font-bold uppercase tracking-wider text-[#650003] transition-all hover:bg-[#650003] hover:text-[#fe9ea2] active:scale-95"
          >
            Anterior
          </button>
          
          <button
            disabled={paginaActual >= totalPaginas}
            onClick={() => cambiarPagina(paginaActual + 1)}
            className="disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#650003] disabled:cursor-not-allowed relative inline-flex items-center rounded-xl border-2 border-[#650003] bg-[#650003] px-4 py-2 text-xs font-label font-bold uppercase tracking-wider text-[#fe9ea2] transition-all hover:bg-[#650003]/90 active:scale-95"
          >
            Siguiente
          </button>
        </nav>
      </div>
    </div>

  </div>
);
}