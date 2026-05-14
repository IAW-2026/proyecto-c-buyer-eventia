import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import styles from "./NavBar.module.css";

const links = [
	{ href: "/", label: "Home" },
    { href: "/eventos", label: "Eventos" },
	{ href: "/mis-eventos", label: "Mis eventos" },
];

export default function NavBar() {
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
			</nav>
        <div className={styles.userButton}>
          <UserButton />
         </div>
		</header>
	);
}
