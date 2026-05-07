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
    <main>
      <h1>{evento.nombre}</h1>

      <p>{evento.descripcion}</p>
      <p>{evento.fecha}</p>
      <p>{evento.ubicacion}</p>
      <p>${evento.precio}</p>
      <p>Stock: {evento.stock}</p>

      <BotonComprar
        idEvento={evento.idEvento}
        cantidad={2}
      />
    </main>
  );
}