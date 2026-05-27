import { currentUser } from "@clerk/nextjs/server";

export async function isAdminBuyer() {
  const user  = await currentUser();
  if (!user) {
    return false;
  }
  return user.publicMetadata?.role === "adminBuyer";
}