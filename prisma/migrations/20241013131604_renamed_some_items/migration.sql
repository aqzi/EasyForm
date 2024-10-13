/*
  Warnings:

  - You are about to drop the `Field` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FieldResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_formId_fkey";

-- DropForeignKey
ALTER TABLE "FieldResponse" DROP CONSTRAINT "FieldResponse_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "FieldResponse" DROP CONSTRAINT "FieldResponse_formResponseId_fkey";

-- DropTable
DROP TABLE "Field";

-- DropTable
DROP TABLE "FieldResponse";

-- CreateTable
CREATE TABLE "FormField" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "responseType" "FormResponseType" NOT NULL DEFAULT 'text',
    "placeholder" TEXT,
    "config" JSONB,
    "sequenceNumber" INTEGER NOT NULL DEFAULT 1,
    "formId" TEXT NOT NULL,

    CONSTRAINT "FormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormFieldResponse" (
    "id" SERIAL NOT NULL,
    "formResponseId" TEXT NOT NULL,
    "fieldId" INTEGER NOT NULL,
    "response" TEXT NOT NULL,

    CONSTRAINT "FormFieldResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormFieldResponse_formResponseId_fieldId_key" ON "FormFieldResponse"("formResponseId", "fieldId");

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormFieldResponse" ADD CONSTRAINT "FormFieldResponse_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormFieldResponse" ADD CONSTRAINT "FormFieldResponse_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "FormField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
