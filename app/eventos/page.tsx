import EventoCard from "../componentes/EventoCard";

async function getEventos() {
  //const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const res = await fetch(`${base}/api/seller/eventos`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error fetching eventos: ' + res.status);
  return res.json();
}


export default async function Page() {
  const eventos = await getEventos();
  const ahora = new Date();

  // la fecha del evento debe ser posterior a la actualidad
  const eventosFuturos = eventos.filter((evento: any) => new Date(evento.fecha) > ahora);

  return (
      <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Eventos</h1>
     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {eventosFuturos.map((evento: any) => (
      <EventoCard key={evento.idEvento} evento={evento} />
       ))}
    </div> 
    </main>
  );
}
