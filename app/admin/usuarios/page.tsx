import { prisma } from '@/lib/prisma';
import { isAdminBuyer } from '@/lib/admin';
import { redirect } from 'next/navigation';
import { Users } from 'lucide-react';

export default async function Page() {
  // Verificación de seguridad
  const admin = await isAdminBuyer();
  if (!admin) {
    redirect("/");
  }

  // Consulta a la base de datos
  const usuarios = await prisma.usuarios.findMany();

  return (
   <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10 bg-background text-on-background">
      {/* Encabezado Estilizado */}
      <div className="flex flex-col gap-1 border-b border-primary/10 pb-5">
        <span className="inline-flex items-center gap-1 text-on-secondary-container text-label-sm font-bold uppercase tracking-widest bg-secondary-container px-2.5 py-0.5 rounded-full w-fit">
          <Users className="w-3.5 h-3.5" /> Registros Globales
        </span>
        <h1 className="text-headline-md md:text-headline-lg text-primary mt-1">
          Panel Admin: Usuarios
        </h1>
        <p className="text-body-md text-on-surface-variant/80 font-medium">
          Listado de usuarios registrados en la plataforma vinculados con Clerk.
        </p>
      </div>

      {/* Tabla  */}
      <div className="overflow-x-auto rounded-xl border border-primary/15 bg-surface-container-lowest shadow-soft-ambient">
        <table className="w-full text-left font-body">
          <thead className="bg-surface-container text-on-surface-variant text-label-lg uppercase tracking-wider border-b border-primary/15">
            <tr>
              <th className="px-6 py-4 font-label font-bold text-xs">ID de Clerk</th>
              <th className="px-6 py-4 font-label font-bold text-xs">Nombre</th>
              <th className="px-6 py-4 font-label font-bold text-xs">Mail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10 text-body-md text-on-surface">
            {usuarios.map((u) => (
              <tr key={u.id_usuario} className="hover:bg-surface-container-low transition-colors duration-200">
                {/* ID  */}
                <td className="px-6 py-4 font-mono text-xs text-on-surface-variant/60 tracking-tight">
                  {u.id_usuario}
                </td>
                {/* Nombre destacado */}
                <td className="px-6 py-4 font-bold text-primary tracking-tight">
                  {u.nombre_usuario}
                </td>
                {/* Mail  */}
                <td className="px-6 py-4 text-on-surface-variant/80 font-medium">
                  {u.mail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}