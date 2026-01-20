/*
  Warnings:

  - A unique constraint covering the columns `[cedula]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `cedula` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `usuarios_cedula_key` ON `usuarios`(`cedula`);
