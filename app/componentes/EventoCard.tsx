'use client';


import styles from './EventoCard.module.css';
import Link from 'next/link';

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
    <article className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{evento.nombre}</h2>
      </header>

      <div className={styles.meta}>
        <span className={styles.date}>{evento.fecha}</span>
        <span className={styles.location}>{evento.ubicacion}</span>
      </div>

      <div className={styles.footer}>
        <div className={styles.priceStock}>
          <span className={styles.price}>${evento.precio}</span>
        </div>

        <div className={styles.buttonWrapper}>
          <Link href={`/eventos/${evento.idEvento}`}>
           Ver evento
          </Link>
        </div>
      </div>
    </article>
  );
}