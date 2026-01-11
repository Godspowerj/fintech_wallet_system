/*
  Warnings:

  - A unique constraint covering the columns `[externalReference]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "externalReference" TEXT,
ALTER COLUMN "idempotencyKey" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_externalReference_key" ON "transactions"("externalReference");

-- CreateIndex
CREATE INDEX "transactions_externalReference_idx" ON "transactions"("externalReference");
