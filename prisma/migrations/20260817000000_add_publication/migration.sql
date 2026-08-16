-- CreateTable
CREATE TABLE "Publication" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "conference" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "abstract" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Published',
    "pdfUrl" TEXT,
    "doiUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);