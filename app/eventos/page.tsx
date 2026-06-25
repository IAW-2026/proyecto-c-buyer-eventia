import EventoCard from "../componentes/EventoCard";
import Paginacion from "../componentes/Paginacion";
import BusquedaFiltro from "../componentes/BusquedaFiltro";
import BotonVolver from "../componentes/BotonVolver";

type Evento = {
  idEvento: number;
  nombreEvento: string;
  descripcion: string;
  fecha: string;
  categoria: string;
  ubicacion: string;
  precio: number;
  stock: number;
  imagenes: string[];
}; 

async function getEventos() {
  const base = process.env.URL_SELLER ?? 'http://localhost:3000/';
  const sellerApiKey = process.env.SELLER_API_KEY;
  const res = await fetch(`${base}api/seller/eventos`, { 
    headers: { 'x-api-key': sellerApiKey ?? '' }, 
    cache: 'no-store' 
  });
  if (!res.ok) throw new Error('Error fetching eventos: ' + res.status);
  return res.json();
}

interface EventosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: EventosPageProps) {
  const params = await searchParams;

  /* captura de parámetros desde la url
     - params.search: Captura lo que el usuario escribió en la barra de búsqueda (ej: ?search=cerámica).
     - params.category: Captura la categoría seleccionada en el menú desplegable (ej: ?category=deportes).
  */
  const searchTerm = (params.search as string || '').toLowerCase();
  const selectedCategory = params.category as string || '';
  const fechaIni = params.desde as string || '';
  const fechaFin = params.hasta as string || '';

  const eventos: Evento[] = await getEventos();
  const ahora = new Date();

  /* Ver la URL del navegador. Si dice '?page=2', params.page vale "2" y la variable 'pagina' será 2.
     Si estamos en la portada y la URL no tiene nada, el "|| 1" arranca en la página 1 por defecto.
  */
  const pagina = Number(params.page) || 1;

  // La fecha del evento debe ser posterior a la actualidad
  const eventosFuturos = eventos.filter((evento: any) => new Date(evento.fecha) >ahora);
  
  /* DEFINIR EL TAMAÑO DE LOS GRUPOS*/
  /* Creamos una copia mutable de los eventos futuros para aplicarle los filtros  */
  let eventosFiltrados = eventosFuturos;

  /* filtrado por texto:buscador
     Si el usuario escribió algo en el buscador ejecutamos un .filter().
     Evaluamos si el nombre O la descripción del evento contienen el texto buscado de manera parcial.
  */
  if (searchTerm) {
    eventosFiltrados = eventosFiltrados.filter(
      (evento: any) =>
        evento.nombreEvento.toLowerCase().includes(searchTerm) ||
        evento.descripcion.toLowerCase().includes(searchTerm) ||
        evento.ubicacion.toLowerCase().includes(searchTerm)
    );
  }

  /*filtrado por categoría: selector desplegable
     Si el usuario seleccionó una categoría en la interfaz, volvemos a filtrar sobre lo que ya teníamos.
     Comparamos de forma estricta  si la categoría del evento coincide con la elegida.
  */
  if (selectedCategory) {
    eventosFiltrados = eventosFiltrados.filter(
      (evento: any) => evento.categoria.toLowerCase() === selectedCategory.toLowerCase()
    );
  }
  
  /* filtrado por rango de fechas */
if (fechaIni) {
  const inicioBusqueda = new Date(`${fechaIni}T00:00:00.000Z`); // Normalizado a UTC
  eventosFiltrados = eventosFiltrados.filter(
    (evento: any) => new Date(evento.fecha) >= inicioBusqueda
  );
}

if (fechaFin) {
  const finBusqueda = new Date(`${fechaFin}T23:59:59.999Z`); // Incluye todo el día elegido
  eventosFiltrados = eventosFiltrados.filter(
    (evento: any) => new Date(evento.fecha) <= finBusqueda
  );
}
  const eventosPorPagina = 6;
  /* cuántos eventos futuros hay en total en la base de datos .*/
  const totalRegistros = eventosFiltrados.length;

  /* CALCULAR CUÁNTAS PÁGINAS VA A HABER EN TOTAL: Dividimos el total de eventos por los 6 que queremos mostrar.  Usamos Math.ceil() para redondear siempre hacia arriba.  */
  const totalPaginas = Math.ceil(totalRegistros / eventosPorPagina);

  /* CALCULAR EL ÍNDICE DE INICIO (De dónde arranca a cortar):
    Le dice a JavaScript desde qué posición de la lista empezar a mostrar eventos según la página.
    - Si está en PÁGINA 1: (1 - 1) * 6 = 0. Empieza desde el primer evento (posición 0). 
    - Si está en PÁGINA 2: (2 - 1) * 6 = 6. Se salta los primeros 6 y empieza desde el evento 6.
  */
  const inicio = (pagina - 1) * eventosPorPagina;

  /* CALCULAR EL ÍNDICE DE FIN (Hasta dónde llega el corte):
    Le dice a JavaScript dónde poner el freno al conteo.
    Simplemente le sumamos los 6 permitidos al punto de inicio.
    - Si empezamos en 0 (pág 1), frena en 6.
    - Si empezamos en 6 (pág 2), frena en 12.
  */ 
  const fin = inicio + eventosPorPagina;

  /*Agarramos la lista completa de eventos futuros, solo los eventos que van desde la posición 'inicio' hasta la posición 'fin'".
    Esta sub-lista recortada de máximo 6 eventos es la que vamos a dibujar en la pantalla.
  */
  const eventosPagina = eventosFiltrados.slice(inicio, fin);

  /* 
     Para que el componente visual muestre un selector con categorías reales, mapeamos todos los eventos.
     Usamos "new Set()" para eliminar los nombres duplicados automáticamente (ej: que 'deportes' aparezca una sola vez).
     Finalmente lo volvemos a convertir en un Array simple para enviárselo al componente.
  */
  
  const availableCategories = Array.from(new Set(eventos.map((evento: any) => evento.categoria as string)));
  console.log("Total de eventos filtrados:", totalRegistros);
console.log("Total de páginas calculadas:", totalPaginas);
  return (
   <main className="layout-container">
    <BotonVolver />
    <h1 className="text-headline-lg-mobile md:text-headline-lg text-secondary mb-8">
      Eventos
    </h1>

    {/* Renderizado del componente visual que contiene el input de texto y la lista desplegable */}
    <BusquedaFiltro
      availableCategories={availableCategories}
      placeholder="Buscar eventos..."
    />
  
  {/* Ajustamos los spans de la grilla para que se acomoden en filas de 3  */}
  <div className="grid-retro-fluid">
    {eventosPagina.length === 0 ? (
      <p className="text-center text-gray-500 col-span-full font-medium py-8">
        No se encontraron eventos con los filtros aplicados.
      </p>
    ) : ( 
      eventosPagina.map((evento: any) => (
        /* - En pantallas chicas ocupa todo el ancho completo.
          - En pantallas medianas se divide en 2 columnas por fila.
          - En pantallas grandes  pasa a col-span-4, lo que es  3 tarjetas perfectas por fila.
        */
        <div 
          key={evento.idEvento} 
          className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 flex justify-center"
        >
          <EventoCard evento={evento} />
        </div>
      ))
    )}
  </div> 
  
      {/* COMPONENTE VISUAL DE PAGINACIÓN */}
      <div className="mt-8">
        <Paginacion totalPaginas={totalPaginas} />
      </div>
</main>
  );
}