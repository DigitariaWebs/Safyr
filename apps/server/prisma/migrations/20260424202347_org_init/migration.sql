/*
  Warnings:

  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `site` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[organizationId,employeeNumber]` on the table `member` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[representativeId]` on the table `organization` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_primarySiteId_fkey";

-- DropForeignKey
ALTER TABLE "site" DROP CONSTRAINT "site_organizationId_fkey";

-- AlterTable
ALTER TABLE "member" ADD COLUMN     "address" TEXT,
ADD COLUMN     "appointmentDate" TIMESTAMP(3),
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "birthPlace" TEXT,
ADD COLUMN     "children" INTEGER,
ADD COLUMN     "civilStatus" TEXT,
ADD COLUMN     "contractType" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "employeeNumber" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "hireDate" TIMESTAMP(3),
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "socialSecurityNumber" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "terminatedAt" TIMESTAMP(3),
ADD COLUMN     "workSchedule" TEXT,
ALTER COLUMN "role" SET DEFAULT 'owner';

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "authorizationNumber" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "representativeId" TEXT,
ADD COLUMN     "shareCapital" TEXT;

-- DropTable
DROP TABLE "employee";

-- DropTable
DROP TABLE "site";

-- CreateTable
CREATE TABLE "representative" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "birthPlace" TEXT,
    "nationality" TEXT,
    "address" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "position" TEXT,
    "appointmentDate" TIMESTAMP(3),
    "socialSecurityNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "representative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_address" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'France',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_bank_details" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "bic" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_bank_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'valid',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_requirement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "hasExpiry" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'valid',
    "expiryDate" TIMESTAMP(3),
    "requirementId" TEXT,
    "organizationId" TEXT,
    "memberId" TEXT,
    "uploaderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_address_memberId_key" ON "member_address"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "member_bank_details_memberId_key" ON "member_bank_details"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "certification_documentId_key" ON "certification"("documentId");

-- CreateIndex
CREATE INDEX "certification_memberId_idx" ON "certification"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "document_requirement_type_targetType_key" ON "document_requirement"("type", "targetType");

-- CreateIndex
CREATE UNIQUE INDEX "document_storageKey_key" ON "document"("storageKey");

-- CreateIndex
CREATE INDEX "document_organizationId_idx" ON "document"("organizationId");

-- CreateIndex
CREATE INDEX "document_memberId_idx" ON "document"("memberId");

-- CreateIndex
CREATE INDEX "document_uploaderId_idx" ON "document"("uploaderId");

-- CreateIndex
CREATE INDEX "document_requirementId_idx" ON "document"("requirementId");

-- CreateIndex
CREATE UNIQUE INDEX "document_organizationId_requirementId_key" ON "document"("organizationId", "requirementId");

-- CreateIndex
CREATE UNIQUE INDEX "member_organizationId_employeeNumber_key" ON "member"("organizationId", "employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "organization_representativeId_key" ON "organization"("representativeId");

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "representative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_address" ADD CONSTRAINT "member_address_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_bank_details" ADD CONSTRAINT "member_bank_details_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification" ADD CONSTRAINT "certification_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification" ADD CONSTRAINT "certification_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "document_requirement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
