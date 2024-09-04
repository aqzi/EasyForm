/*
  Warnings:

  - You are about to drop the column `response` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the `_FieldToFormResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FieldToFormResponse" DROP CONSTRAINT "_FieldToFormResponse_A_fkey";

-- DropForeignKey
ALTER TABLE "_FieldToFormResponse" DROP CONSTRAINT "_FieldToFormResponse_B_fkey";

-- AlterTable
ALTER TABLE "Field" DROP COLUMN "response";

-- DropTable
DROP TABLE "_FieldToFormResponse";

-- CreateTable
CREATE TABLE "FieldResponse" (
    "id" SERIAL NOT NULL,
    "formResponseId" TEXT NOT NULL,
    "fieldId" INTEGER NOT NULL,
    "response" TEXT NOT NULL,

    CONSTRAINT "FieldResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FieldResponse_formResponseId_fieldId_key" ON "FieldResponse"("formResponseId", "fieldId");

-- AddForeignKey
ALTER TABLE "FieldResponse" ADD CONSTRAINT "FieldResponse_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldResponse" ADD CONSTRAINT "FieldResponse_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
