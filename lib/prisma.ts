import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter }); // si ya existe prisma lo uso, sino lo creo
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;