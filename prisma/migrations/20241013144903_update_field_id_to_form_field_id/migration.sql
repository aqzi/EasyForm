/*
  Warnings:

  - You are about to drop the column `fieldId` on the `FormFieldResponse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[formResponseId,formFieldId]` on the table `FormFieldResponse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `formFieldId` to the `FormFieldResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FormFieldResponse" DROP CONSTRAINT "FormFieldResponse_fieldId_fkey";

-- DropIndex
DROP INDEX "FormFieldResponse_formResponseId_fieldId_key";

-- AlterTable
ALTER TABLE "FormFieldResponse" DROP COLUMN "fieldId",
ADD COLUMN     "formFieldId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FormFieldResponse_formResponseId_formFieldId_key" ON "FormFieldResponse"("formResponseId", "formFieldId");

-- AddForeignKey
ALTER TABLE "FormFieldResponse" ADD CONSTRAINT "FormFieldResponse_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "FormField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
