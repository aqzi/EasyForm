/*
  Warnings:

  - The `responseType` column on the `Field` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `FormParticipation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FormResponseType" AS ENUM ('text', 'multipleChoice', 'checkbox', 'image', 'file', 'date', 'yesOrNo');

-- DropForeignKey
ALTER TABLE "FormParticipation" DROP CONSTRAINT "FormParticipation_formId_fkey";

-- DropForeignKey
ALTER TABLE "FormParticipation" DROP CONSTRAINT "FormParticipation_userId_fkey";

-- AlterTable
ALTER TABLE "Field" ALTER COLUMN "response" DROP NOT NULL,
DROP COLUMN "responseType",
ADD COLUMN     "responseType" "FormResponseType" NOT NULL DEFAULT 'text';

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "FormParticipation";

-- DropEnum
DROP TYPE "ParticipationRole";

-- CreateTable
CREATE TABLE "FormCreator" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,

    CONSTRAINT "FormCreator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponse" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponder" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "formResponseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormResponder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FieldToFormResponse" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FormCreator_userId_formId_key" ON "FormCreator"("userId", "formId");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponder_formResponseId_key" ON "FormResponder"("formResponseId");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponder_userId_formResponseId_key" ON "FormResponder"("userId", "formResponseId");

-- CreateIndex
CREATE UNIQUE INDEX "_FieldToFormResponse_AB_unique" ON "_FieldToFormResponse"("A", "B");

-- CreateIndex
CREATE INDEX "_FieldToFormResponse_B_index" ON "_FieldToFormResponse"("B");

-- AddForeignKey
ALTER TABLE "FormCreator" ADD CONSTRAINT "FormCreator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormCreator" ADD CONSTRAINT "FormCreator_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponder" ADD CONSTRAINT "FormResponder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponder" ADD CONSTRAINT "FormResponder_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldToFormResponse" ADD CONSTRAINT "_FieldToFormResponse_A_fkey" FOREIGN KEY ("A") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldToFormResponse" ADD CONSTRAINT "_FieldToFormResponse_B_fkey" FOREIGN KEY ("B") REFERENCES "FormResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
