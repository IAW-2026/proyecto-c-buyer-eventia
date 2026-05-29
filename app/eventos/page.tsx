import EventoCard from "../componentes/EventoCard";

async function getEventos() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const sellerApiKey = process.env.SELLER_API_KEY;
  const res = await fetch(`${base}/api/seller/eventos`, { 
    headers: { 'x-api-key': sellerApiKey ?? '' }, 
    cache: 'no-store' 
  });
  if (!res.ok) throw new Error('Error fetching eventos: ' + res.status);
  return res.json();
}

export default async function Page() {
  const eventos = await getEventos();
  const ahora = new Date();

  // La fecha del evento debe ser posterior a la actualidad
  const eventosFuturos = eventos.filter((evento: any) => new Date(evento.fecha) > ahora);

  return (
    <main className="layout-container">
    
      <h1 className="text-headline-lg-mobile md:text-headline-lg text-secondary mb-8">
        Eventos
      </h1>
      
      <div className="grid-retro-fluid">
        {eventosFuturos.map((evento: any) => (
          <div key={evento.idEvento} className="col-span-4 sm:col-span-2 md:col-span-4 lg:col-span-3">
            <EventoCard evento={evento} />
          </div>
        ))}
      </div> 
    </main>
  );
}