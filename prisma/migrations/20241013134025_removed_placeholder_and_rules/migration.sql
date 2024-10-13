/*
  Warnings:

  - You are about to drop the column `rules` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `placeholder` on the `FormField` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "rules";

-- AlterTable
ALTER TABLE "FormField" DROP COLUMN "placeholder";
