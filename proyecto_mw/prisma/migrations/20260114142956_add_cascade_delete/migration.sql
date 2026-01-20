-- DropForeignKey
ALTER TABLE `auth` DROP FOREIGN KEY `auth_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `emprendimientos` DROP FOREIGN KEY `emprendimientos_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `mentorias` DROP FOREIGN KEY `mentorias_emprendimientoId_fkey`;

-- DropForeignKey
ALTER TABLE `mentorias` DROP FOREIGN KEY `mentorias_tutorId_fkey`;

-- DropForeignKey
ALTER TABLE `productos` DROP FOREIGN KEY `productos_emprendimientoId_fkey`;

-- DropForeignKey
ALTER TABLE `redes_sociales` DROP FOREIGN KEY `redes_sociales_emprendimientoId_fkey`;

-- DropForeignKey
ALTER TABLE `resenas` DROP FOREIGN KEY `resenas_emprendimientoId_fkey`;

-- DropForeignKey
ALTER TABLE `resenas` DROP FOREIGN KEY `resenas_usuarioId_fkey`;

-- AddForeignKey
ALTER TABLE `auth` ADD CONSTRAINT `auth_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emprendimientos` ADD CONSTRAINT `emprendimientos_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `productos_emprendimientoId_fkey` FOREIGN KEY (`emprendimientoId`) REFERENCES `emprendimientos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `redes_sociales` ADD CONSTRAINT `redes_sociales_emprendimientoId_fkey` FOREIGN KEY (`emprendimientoId`) REFERENCES `emprendimientos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mentorias` ADD CONSTRAINT `mentorias_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mentorias` ADD CONSTRAINT `mentorias_emprendimientoId_fkey` FOREIGN KEY (`emprendimientoId`) REFERENCES `emprendimientos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_emprendimientoId_fkey` FOREIGN KEY (`emprendimientoId`) REFERENCES `emprendimientos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
