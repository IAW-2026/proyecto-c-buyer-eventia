/*
  Warnings:

  - Made the column `id_usuario` on table `compras` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cantidad` on table `compras` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_evento` on table `compras` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "compras" ALTER COLUMN "id_usuario" SET NOT NULL,
ALTER COLUMN "cantidad" SET NOT NULL,
ALTER COLUMN "id_evento" SET NOT NULL;
