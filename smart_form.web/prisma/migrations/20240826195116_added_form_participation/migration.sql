/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the `_FormResponders` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ParticipationRole" AS ENUM ('CREATOR', 'RESPONDER');

-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "_FormResponders" DROP CONSTRAINT "_FormResponders_A_fkey";

-- DropForeignKey
ALTER TABLE "_FormResponders" DROP CONSTRAINT "_FormResponders_B_fkey";

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "creatorId";

-- DropTable
DROP TABLE "_FormResponders";

-- CreateTable
CREATE TABLE "FormParticipation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "formId" INTEGER NOT NULL,
    "role" "ParticipationRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormParticipation_userId_formId_key" ON "FormParticipation"("userId", "formId");

-- AddForeignKey
ALTER TABLE "FormParticipation" ADD CONSTRAINT "FormParticipation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormParticipation" ADD CONSTRAINT "FormParticipation_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
