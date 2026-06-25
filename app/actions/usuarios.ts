// actions/usuarios.ts
"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {prisma} from "@/lib/prisma";
import { isAdminBuyer } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function getOrCreateUser() {
  // auth()  para obtener solo el ID
  const { userId } = await auth();

  if (!userId) {
   redirect("/sign-in");
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
  //agrego el rol de buyer a los usuarios que se crean desde esta función
  const currentRoles =(clerkUser.publicMetadata.roles as string[]) || [];
  //combinar con 'buyer' por si es seller o tiene otros roles, para no sobreescribirlos
  const updatedRoles = [...currentRoles, 'buyer'];
  // guardar en clerk el nuevo rol de buyer (para que se refleje en el jwt y se pueda usar desde shipping)
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      roles: updatedRoles,
    },
  });

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

