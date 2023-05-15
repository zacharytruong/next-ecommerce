/*
  Warnings:

  - You are about to drop the column `quantiy` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "quantiy",
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0;
