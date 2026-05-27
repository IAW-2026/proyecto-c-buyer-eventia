"use client"; 
import Link from "next/link";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import styles from "./NavBar.module.css";

const links = [
	{ href: "/", label: "Home" },
    { href: "/eventos", label: "Eventos" },
	{ href: "/mis-eventos", label: "Mis eventos" },
];

export default function NavBar({ esAdmin }: { esAdmin: boolean }) {
	 const { isSignedIn } = useAuth();
	return (
		<header className={styles.navbar}>
			<div className={styles.brand}>
				<Link href="/" className={styles.brandLink}>
					Eventia
				</Link>
			</div>

			<nav aria-label="Navegación principal" className={styles.navigation}>
				{links.map((link) => (
					<Link key={link.href} href={link.href} className={styles.link}>
						{link.label}
					</Link>
				))}

			{esAdmin && (
			<Link href="/admin" className={styles.link}>
				Panel Administrador
			</Link>
			)}
			</nav>
        <div className={styles.userButton}>
           {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal" />
          )}
         </div>
		</header>
	);
}
