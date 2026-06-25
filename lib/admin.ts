import { currentUser } from "@clerk/nextjs/server";

export async function isAdminBuyer() {
  const user  = await currentUser();
  if (!user) {
    return false;
  }
  const rolesAdministrador = (user?.publicMetadata?.rolesAdmin as string[]) || [];
  return rolesAdministrador.includes('adminBuyer');
}