'use client';

import BotonComprar from './BotonComprar';

//Evento es un tipo que describe la forma del objeto evento que recibo como prop. 
type Evento = {
  idEvento: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  precio: number;
  stock: number;
};

type Props = {
  evento: Evento;
};

// Espera recibir un prop "evento" que es un objeto con las propiedades definidas en el tipo Evento.
export default function EventoCard({ evento }: Props) {
  return (
    <div>
      <h2>{evento.nombre}</h2>
      <p>{evento.descripcion}</p>
      <p>{evento.fecha}</p>
      <p>{evento.ubicacion}</p>
      <p>${evento.precio}</p>
      <p>Stock: {evento.stock}</p>
      <BotonComprar
        idEvento={evento.idEvento}
        cantidad={2}
      />
    </div>
  );
}