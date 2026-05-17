/*
  Warnings:

  - The primary key for the `usuarios` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "compras" DROP CONSTRAINT "id_usuario";

-- AlterTable
ALTER TABLE "compras" ALTER COLUMN "id_usuario" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_pkey",
ALTER COLUMN "id_usuario" DROP DEFAULT,
ALTER COLUMN "id_usuario" SET DATA TYPE TEXT,
ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario");
DROP SEQUENCE "usuarios_id_usuario_seq";

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "id_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;
