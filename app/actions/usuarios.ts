// actions/usuarios.ts
"use server";
import { auth, currentUser } from "@clerk/nextjs/server";
import {prisma} from "@/lib/prisma";

export async function getOrCreateUser() {
  // auth()  para obtener solo el ID
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No autorizado");
  }

  // buscar en la bd si ya existe un usuario con ese id_usuario (que es el id de Clerk)
  const usuarioExistente = await prisma.usuarios.findUnique({
    where: { id_usuario: userId },
  });

  // si ya existe, lo devuelvo
  if (usuarioExistente) {
    return usuarioExistente;
  }

  // si no existe, es el primer ingreso del usuario, entonces busco los datos completos en Clerk y lo guardo en la bd
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    throw new Error("No se pudieron obtener los datos de Clerk");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress || "";
  const nombreCompleto = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();

  // agregar nuevo usuario en la BD
  const nuevoUsuario = await prisma.usuarios.create({
    data: {
      id_usuario: userId,
      mail: email,
      nombre_usuario: nombreCompleto || "Usuario de Clerk",
    },
  });

  return nuevoUsuario;
}