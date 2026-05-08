-- CreateEnum
CREATE TYPE "Sexe" AS ENUM ('MASCULIN', 'FEMININ', 'AUTRE');

-- CreateEnum
CREATE TYPE "TypeStage" AS ENUM ('ACADEMIQUE', 'PROFESSIONNEL');

-- CreateEnum
CREATE TYPE "StatutAvancement" AS ENUM ('EN_COURS', 'TERMINE');

-- CreateTable
CREATE TABLE "Stagiaire" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "sexe" "Sexe" NOT NULL DEFAULT 'AUTRE',
    "dateNaissance" TIMESTAMP(3),
    "lieuProvenance" TEXT NOT NULL,
    "ecoleUniversite" TEXT NOT NULL,
    "filiere" TEXT NOT NULL,
    "niveauEtude" TEXT,
    "typeStage" "TypeStage" NOT NULL,
    "dureeMois" INTEGER NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "objetStage" TEXT NOT NULL,
    "cvUrl" TEXT,
    "statutAvancement" "StatutAvancement" NOT NULL DEFAULT 'EN_COURS',
    "commentaireInterne" TEXT,
    "dateInscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFinReelle" TIMESTAMP(3),

    CONSTRAINT "Stagiaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "stagiaireId" INTEGER,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stagiaire_email_key" ON "Stagiaire"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_stagiaireId_fkey" FOREIGN KEY ("stagiaireId") REFERENCES "Stagiaire"("id") ON DELETE SET NULL ON UPDATE CASCADE;
