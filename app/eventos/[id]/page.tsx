import BotonComprar from '@/app/componentes/BotonComprar';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Evento = {
  idEvento: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  precio: number;
  stock: number;
};

async function getEvento(id: string) {

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(
    `${baseUrl}/api/seller/eventos/${id}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json() as Promise<Evento>;
}

export default async function Page({ params }: Props) {

  const { id } = await params;

  const evento = await getEvento(id);

  if (!evento) {
    notFound();
  }

  return (

  <main className="flex min-h-screen items-start justify-center bg-slate-100 pt-12 px-6">

     <div className="flex w-full max-w-5xl min-h-[60vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      {/* imagen */}
      <div className="flex w-1/3 items-center justify-center bg-slate-300 text-slate-600">Image</div>

      {/* informacion */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h1 className="mb-4 text-3xl font-bold text-slate-900"> {evento.nombre} </h1>

          <p className="mb-6 text-slate-600">{evento.descripcion}  </p>

          <div className="space-y-3 text-sm text-slate-700">
            <p>📍 {evento.ubicacion}</p>
            <p>📅 {new Date(evento.fecha).toLocaleString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'UTC'
            })} hs</p>
            <p>🎟️ Stock disponible: {evento.stock}</p>
          </div>
        </div>
      </div>

      {/* compra */}
      <div className="flex w-72 flex-col justify-between border-l border-slate-200 bg-slate-50 p-6">

        <div>
          <p className="text-sm text-slate-500">Entrada: </p>
          <h2 className="mb-6 text-4xl font-bold text-slate-900"> ${evento.precio} </h2>
        </div>

        <BotonComprar idEvento={evento.idEvento } stock={evento.stock} />
      </div>
    </div>
  </main>
  );
}