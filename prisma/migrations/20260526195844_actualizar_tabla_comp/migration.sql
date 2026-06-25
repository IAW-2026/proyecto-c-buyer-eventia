/*
  Warnings:

  - You are about to drop the column `id_transaccion` on the `compras` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "compras" DROP COLUMN "id_transaccion",
ADD COLUMN     "cantidad" INTEGER,
ADD COLUMN     "id_evento" INTEGER;
