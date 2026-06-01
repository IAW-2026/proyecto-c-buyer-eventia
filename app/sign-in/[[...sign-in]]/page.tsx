import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
  // Este contenedor ocupa todo el alto y ancho disponible, centrando el contenido
    <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center p-4">
      <SignIn />
    </div>
    )
}