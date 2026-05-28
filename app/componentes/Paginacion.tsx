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
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm mt-4">
      {/* Vista Mobile (Botones simplificados) */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          disabled={paginaActual <= 1}
          onClick={() => cambiarPagina(paginaActual - 1)}
          className="disabled:opacity-40 relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-opacity"
        >
          Anterior
        </button>
        <button
          disabled={paginaActual >= totalPaginas}
          onClick={() => cambiarPagina(paginaActual + 1)}
          className="disabled:opacity-40 relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-opacity"
        >
          Siguiente
        </button>
      </div>

      {/* Vista Desktop (Con indicador de página) */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-700">
            Mostrando página <span className="font-medium">{paginaActual}</span> de{" "}
            <span className="font-medium">{totalPaginas}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              disabled={paginaActual <= 1}
              onClick={() => cambiarPagina(paginaActual - 1)}
              className="disabled:opacity-40 relative inline-flex items-center rounded-l-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-opacity"
            >
              Anterior
            </button>
            <button
              disabled={paginaActual >= totalPaginas}
              onClick={() => cambiarPagina(paginaActual + 1)}
              className="disabled:opacity-40 relative inline-flex items-center rounded-r-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-opacity"
            >
              Siguiente
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}