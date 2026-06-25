"use client"; 
import Link from "next/link";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import styles from "./NavBar.module.css";
import {ShieldAlert, Calendar, Home, Ticket, CalendarDays, Menu} from 'lucide-react';
import Image from "next/image";
import {usePathname} from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function NavBar({ esAdmin }: { esAdmin: boolean }) {
	 const { isSignedIn, userId } = useAuth();
	 const pathname = usePathname();
	 const router = useRouter();
	 // Función auxiliar para calcular los estilos dinámicos de cada link
	const getLinkClass = (href: string) => {
		const isActive = pathname === href;
		
		return `flex items-center gap-1.5 pb-2 border-b-2 transition-all duration-200 ${
		isActive 
			? "text-[#650003] border-[#650003] font-bold" // Estilo Activo (con subrayado)
			: "text-on-surface-variant/80 border-transparent hover:text-[#650003]" // Estilo Inactivo
		}`;
	};
	// Estado para controlar el menú móvil
     const [menuAbierto, setMenuAbierto] = useState(false);

	 //Si el estado de autenticación cambia en el cliente, le avisamos a Next.js que refresque el Layout del Servidor en segundo plano.
		useEffect(() => {router.refresh();}, [userId, router]);
	return (
      <header className={`${styles.navbar} flex items-center justify-between px-6 md:px-16 py-4 bg-background border-b border-on-surface/5 relative`}>
    
    {/* 1. BOTÓN HAMBURGUESA: A la izquierda en móvil (order-1), oculto en escritorio */}
    <button 
      onClick={() => setMenuAbierto(!menuAbierto)} 
      className="md:hidden p-2 rounded-xl bg-surface-container-low text-[#650003] hover:bg-surface-container transition-colors order-1"
      aria-label="Abrir menú de navegación"
    >
      <Menu className="w-6 h-6" />
    </button>

    {/* 2. LOGO: Al medio en móvil (order-2 y centrado absoluto/flex), a la izquierda en escritorio (md:order-1) */}
    <div className={`${styles.brand} order-2 md:order-1 flex-1 md:flex-initial flex justify-center md:justify-start`}>
      <Link href="/" className="flex items-center transition-transform hover:scale-105">
        <Image 
          src="/icon.png" 
          alt="Eventia Logo"
          width={40} 
          height={40}
          className="rounded-full object-cover"
        />
      </Link>
    </div>

    {/* 3. NAVEGACIÓN ESCRITORIO: Oculta en móvil, al medio en escritorio (md:order-2) */}
    <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-8 font-body text-sm font-semibold md:order-2">
      <Link href="/" className={getLinkClass("/")}>
        <Home className="w-4 h-4" />
        <span>Inicio</span>
      </Link>

      <Link href="/eventos" className={getLinkClass("/eventos")}>
        <Ticket className="w-4 h-4" />
        <span>Eventos</span>
      </Link>

      <Link href="/mis-eventos" className={getLinkClass("/mis-eventos")}>
        <Calendar className="w-4 h-4" />
        <span>Mis Eventos</span>
      </Link>

      
      <Link href="https://proyecto-c-shipping-eventia.vercel.app/buyer" className={getLinkClass("https://proyecto-c-shipping-eventia.vercel.app/buyer")}>
        <Ticket className="w-4 h-4" />
        <span>Mis entradas </span>
      </Link>

      {esAdmin && (
        <Link href="/admin" className={getLinkClass("/admin")}>
          <ShieldAlert className="w-4 h-4" />
          <span>Panel Administrador</span>
        </Link>
      )}
    </nav>

    {/* 4. AUTENTICACIÓN: A la derecha en móvil (order-3), a la derecha en escritorio (md:order-3) */}
    <div className={`${styles.userButton} order-3 md:order-3`}>
      {isSignedIn ? (
        <UserButton />
      ) : (
        <div className="bg-[#fe9ea2] hover:opacity-90 text-[#650003] text-xs font-label font-bold px-5 py-2.5 rounded-2xl transition-all shadow-soft-ambient">
          <SignInButton mode="modal">
            <span>Ingresar</span>
          </SignInButton>
        </div>
      )}
    </div>

    {/* MENÚ MÓVIL DESPLEGABLE */}
    {menuAbierto && (
      <div className={`${styles.mobileMenu} md:hidden absolute top-full left-0 w-full h-screen bg-background border-t border-primary/10 z-50`}>
        <nav className="flex flex-col gap-6 p-8 font-body text-lg font-semibold">
          <Link href="/" className="flex items-center gap-2 text-primary" onClick={() => setMenuAbierto(false)}>
            <Home className="w-5 h-5"/> Inicio
          </Link>
          <Link href="/eventos" className="flex items-center gap-2 text-on-surface-variant" onClick={() => setMenuAbierto(false)}>
            <Ticket className="w-5 h-5"/> Eventos
          </Link>
          <Link href="/mis-eventos" className="flex items-center gap-2 text-on-surface-variant" onClick={() => setMenuAbierto(false)}>
            <CalendarDays className="w-5 h-5"/> Mis Eventos
          </Link>
          {esAdmin && (
            <Link href="/admin" className="flex items-center gap-2 text-on-surface-variant" onClick={() => setMenuAbierto(false)}>
              <ShieldAlert className="w-5 h-5"/> Panel Administrador
            </Link>
          )}
        </nav>
      </div>
    )}

  </header>
  );
}
