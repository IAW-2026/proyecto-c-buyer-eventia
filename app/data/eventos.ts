// Arreglo para simular los eventos disponibles, 
// esto se va a reemplazar por pedidos a la app seller en la proxima entrega
export const eventos = [
  {
    idEvento: 1,
    nombre: 'Taller de cerámica',
    descripcion: "Aprender a crear piezas de cerámica",
    // 12 de Junio de 2026 a las 18:30 hs 
    fecha: "2026-06-12T18:30:00.000Z",
    ubicacion: "direccion del evento",
    precio: 5000,
    stock: 10,
    categoria: 'entretenimiento general',
    imagenes: []
  },
  {
    idEvento: 2,
    nombre: 'Cata de vinos',
    descripcion: "Degustación guiada",
    // 5 de Diciembre de 2026 a las 19:00 hs
    fecha: "2026-12-05T19:00:00.000Z",
    ubicacion: "direccion del evento",
    precio: 8000,
    stock: 5,
    categoria: 'Gastronoma exclusiva',
    imagenes: [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
      'https://images.unsplash.com/photo-1528823872057-9c018a7a72b5',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587'
    ]
  },
  {
    idEvento: 3,
    nombre: 'Taller de pintura',
    descripcion: "Aprender técnicas de pintura",
    // 5 de Enero de 2027 a las 14:00 hs
    fecha: "2027-01-05T14:00:00.000Z",
    ubicacion: "direccion del evento",
    precio: 4000,
    stock: 0,
    categoria: 'entretenimiento general',
    imagenes: [
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b'
    ]
  },
  {
    idEvento: 4,
    nombre: 'Festival de Rock Indie',
    descripcion: "Bandas emergentes en vivo al aire libre",
    // 20 de Julio de 2026 a las 21:00 hs
    fecha: "2026-07-20T21:00:00.000Z",
    ubicacion: "Anfiteatro Municipal",
    precio: 12000,
    stock: 150,
    categoria: 'musica y espectaculos',
    imagenes: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'
    ]
  },
  {
    idEvento: 5,
    nombre: 'Cine Bajo las Estrellas',
    descripcion: "Proyección de cortometrajes independientes",
    // 14 de Agosto de 2026 a las 20:00 hs
    fecha: "2026-08-14T20:00:00.000Z",
    ubicacion: "Plaza Central",
    precio: 2500,
    stock: 80,
    categoria: 'audiovisual',
    imagenes: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c'
    ]
  },
  {
    idEvento: 6,
    nombre: 'Torneo de Pádel Relámpago',
    descripcion: "Inscripción por parejas, incluye hidratación",
    // 22 de Septiembre de 2026 a las 09:00 hs
    fecha: "2026-09-22T09:00:00.000Z",
    ubicacion: "Complejo Deportivo Norte",
    precio: 6000,
    stock: 16,
    categoria: 'deportes',
    imagenes: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea'
    ]
  },
  {
    idEvento: 7,
    nombre: 'Fiesta Neon Retro de Primavera',
    descripcion: "DJs invitados y cotillón luminiscente",
    // 21 de Septiembre de 2026 a las 23:30 hs
    fecha: "2026-09-21T23:30:00.000Z",
    ubicacion: "Salón Premium Club",
    precio: 9500,
    stock: 300,
    categoria: 'fiestas y eventos sociales',
    imagenes: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
      'https://images.unsplash.com/photo-1545128485-c400e7702796',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063'
    ]
  },
  {
    idEvento: 8,
    nombre: 'Cena de Pasos: Fusión Asiática',
    descripcion: "Menú degustación de 5 pasos por Chef Internacional",
    // 18 de Octubre de 2026 a las 21:30 hs
    fecha: "2026-10-18T21:30:00.000Z",
    ubicacion: "Restó Escondido",
    precio: 22000,
    stock: 24,
    categoria: 'Gastronoma exclusiva',
    imagenes: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe'
    ]
  },
  {
    idEvento: 9,
    nombre: 'Maratón Urbana Nocturna 8K',
    descripcion: "Carrera nocturna con luces LED por la ciudad",
    // 7 de Noviembre de 2026 a las 20:00 hs
    fecha: "2026-11-07T20:00:00.000Z",
    ubicacion: "Punto de Partida: Obelisco",
    precio: 7500,
    stock: 500,
    categoria: 'deportes',
    imagenes: [
      'https://images.unsplash.com/photo-1502224562085-639556652f33',
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8'
    ]
  },
  {
    idEvento: 10,
    nombre: 'Masterclass de Coctelería Moderna',
    descripcion: "Aprendé a preparar tragos de autor con barra libre",
    // 15 de Enero de 2027 a las 19:30 hs
    fecha: "2027-01-15T19:30:00.000Z",
    ubicacion: "Bar Botánico",
    precio: 11000,
    stock: 12,
    categoria: 'Gastronoma exclusiva',
    imagenes: [
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b',
      'https://images.unsplash.com/photo-1536935338788-846bb9981813',
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87',
      'https://images.unsplash.com/photo-1560512823-829485b8bf24',
      'https://images.unsplash.com/photo-1575444758702-4a6b9222336e'
    ]
  }
];