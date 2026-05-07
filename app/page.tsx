import EventoCard from "./componentes/EventoCard";


/*async function getEventos() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${baseUrl}/api/seller/eventos`);
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
}*/

export default function Page() {
  //doy la bienvenida al sitio
  return (
    <main>
      <h1>Bienvenido a la tienda de eventos</h1>
      <p>Explora nuestros eventos y compra tus entradas</p>
    </main>
  );
}