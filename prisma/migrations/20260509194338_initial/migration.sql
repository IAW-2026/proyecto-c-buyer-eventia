-- CreateTable
CREATE TABLE "compras" (
    "id_pedido" INTEGER NOT NULL,
    "id_usuario" INTEGER,
    "id_transaccion" INTEGER,

    CONSTRAINT "compras_pkey" PRIMARY KEY ("id_pedido")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre_usuario" TEXT NOT NULL,
    "mail" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_mail_key" ON "usuarios"("mail");

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "id_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;
