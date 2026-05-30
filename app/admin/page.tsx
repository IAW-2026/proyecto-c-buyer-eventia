import { isAdminBuyer } from "@/lib/admin";
import Link from "next/link";
export default async function AdminPage() {
  const esAdmin = await isAdminBuyer();
  if (!esAdmin) {
    return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center text-slate-700">
        No tienes permisos para acceder a esta página.
      </div>
    </main>
  );
  }
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">

      {/* Título */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900">
          Panel Administrador
        </h1>

        <p className="mt-2 text-slate-600">
          Gestión general del sistema
        </p>
      </div>

      {/* Opciones */}
      <div className="flex gap-6">

        {/* Compras */}
        <Link
          href="/admin/compras"
          className="flex-1 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md hover:border-slate-300"
        >
          <h2 className="text-2xl font-semibold text-slate-900">
            Listar Compras
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            Ver todas las compras realizadas por los usuarios.
          </p>
        </Link>

        {/* Usuarios */}
        <Link
          href="/admin/usuarios"
          className="flex-1 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md hover:border-slate-300"
        >
          <h2 className="text-2xl font-semibold text-slate-900">
            Listar Usuarios
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            Administrar y visualizar usuarios registrados.
          </p>
        </Link>
        {/* Simulación */}
        <Link
          href="/admin/simulacion"
          className="rounded-2xl border border-dashed border-sky-300 bg-sky-50/40 p-8 shadow-sm transition hover:shadow-md hover:border-sky-400 hover:bg-sky-50"
        >
          <h2 className="text-2xl font-semibold text-sky-950">
            Simulación
          </h2>
          <p className="mt-3 text-sm text-sky-800">
            Simular cancelación usando la API de Buyer.
          </p>
        </Link>
      </div>

    </main>
  );
}

