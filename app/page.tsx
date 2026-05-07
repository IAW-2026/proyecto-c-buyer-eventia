import EventoCard from "./componentes/EventoCard";


async function getEventos() {
  //const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const res = await fetch(`${base}/api/seller/eventos`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error fetching eventos: ' + res.status);
  return res.json();
}


export default async function Page() {
  const eventos = await getEventos();

  return (
    <main>
      <h1>Eventos</h1>
      {eventos.map((evento: any) => (
      <EventoCard key={evento.idEvento} evento={evento} />
       ))}
    
    </main>
  );
}

