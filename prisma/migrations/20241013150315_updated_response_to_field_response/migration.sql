/*
  Warnings:

  - You are about to drop the column `response` on the `FormFieldResponse` table. All the data in the column will be lost.
  - Added the required column `fieldResponse` to the `FormFieldResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FormFieldResponse" DROP COLUMN "response",
ADD COLUMN     "fieldResponse" TEXT NOT NULL;
