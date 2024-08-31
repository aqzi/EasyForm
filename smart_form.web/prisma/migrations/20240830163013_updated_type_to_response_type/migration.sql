/*
  Warnings:

  - You are about to drop the column `type` on the `Field` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Field" DROP COLUMN "type",
ADD COLUMN     "responseType" TEXT NOT NULL DEFAULT 'text';
