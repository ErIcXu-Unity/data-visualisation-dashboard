-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "internalId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "openingInventory" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "DailyRecord" (
    "id" SERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "procurementQty" INTEGER NOT NULL,
    "procurementPrice" DOUBLE PRECISION NOT NULL,
    "salesQty" INTEGER NOT NULL,
    "salesPrice" DOUBLE PRECISION NOT NULL,
    "inventory" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "DailyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_userId_id_key" ON "Product"("userId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRecord_productId_day_key" ON "DailyRecord"("productId", "day");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRecord" ADD CONSTRAINT "DailyRecord_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("internalId") ON DELETE CASCADE ON UPDATE CASCADE;
