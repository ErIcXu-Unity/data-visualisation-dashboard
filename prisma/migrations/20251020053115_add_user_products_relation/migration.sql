/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `internalId` was added to the `Product` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DailyRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER NOT NULL,
    "procurementQty" INTEGER NOT NULL,
    "procurementPrice" REAL NOT NULL,
    "salesQty" INTEGER NOT NULL,
    "salesPrice" REAL NOT NULL,
    "inventory" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "DailyRecord_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("internalId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DailyRecord" ("day", "id", "inventory", "procurementPrice", "procurementQty", "productId", "salesPrice", "salesQty") SELECT "day", "id", "inventory", "procurementPrice", "procurementQty", "productId", "salesPrice", "salesQty" FROM "DailyRecord";
DROP TABLE "DailyRecord";
ALTER TABLE "new_DailyRecord" RENAME TO "DailyRecord";
CREATE UNIQUE INDEX "DailyRecord_productId_day_key" ON "DailyRecord"("productId", "day");
CREATE TABLE "new_Product" (
    "internalId" TEXT NOT NULL PRIMARY KEY,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "openingInventory" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("id", "name", "openingInventory", "userId") SELECT "id", "name", "openingInventory", "userId" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_userId_id_key" ON "Product"("userId", "id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
