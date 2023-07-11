/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserHasBook` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `UserHasBook` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserHasBook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserHasBook` DROP COLUMN `createdAt`,
    DROP COLUMN `deletedAt`,
    DROP COLUMN `updatedAt`;
