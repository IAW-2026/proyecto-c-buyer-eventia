import { prisma } from '@/lib/prisma';
import { isAdminBuyer } from '@/lib/admin';
import { redirect } from 'next/navigation';
import { eliminarUsuario } from '@/app/actions/usuarios';

export default async function Page() {
  // Verificación de seguridad
  const admin = await isAdminBuyer();
  if (!admin) {
    redirect("/");
  }

  // Consulta a la base de datos
  const usuarios = await prisma.usuarios.findMany();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Panel Admin: Usuarios</h1>
        <p className="mt-2 text-sm text-slate-600">
          Listado de usuarios registrados en la plataforma vinculados con Clerk.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">ID de Clerk</th>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Mail</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {usuarios.map((u) => (
              <tr key={u.id_usuario} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{u.id_usuario}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{u.nombre_usuario}</td>
                <td className="px-6 py-4 text-slate-600">{u.mail}</td>
                <td className="px-6 py-4 text-right">
                  <form action={eliminarUsuario.bind(null, u.id_usuario)}>
                    <button className="text-xs font-bold uppercase tracking-wider text-red-600 transition-colors hover:text-red-800">
                      Eliminar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}