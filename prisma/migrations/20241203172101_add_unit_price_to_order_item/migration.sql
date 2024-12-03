/*
  Warnings:

  - Added the required column `unitPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "unitPrice" DOUBLE PRECISION;

-- Update
UPDATE "OrderItem"
SET "unitPrice" = p."unitPrice"
FROM "Product" p
WHERE "OrderItem"."productId" = p."id";

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN   "unitPrice" SET NOT NULL;