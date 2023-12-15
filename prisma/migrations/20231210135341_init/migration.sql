/*
  Warnings:

  - You are about to alter the column `name` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `email` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `secondary_email` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "secondary_email" SET DATA TYPE VARCHAR(50);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "agreeToTerms" BOOLEAN NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "senderUserName" TEXT NOT NULL,
    "receiverUserName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userName_key" ON "Teacher"("userName");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderUserName_fkey" FOREIGN KEY ("senderUserName") REFERENCES "Teacher"("userName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiverUserName_fkey" FOREIGN KEY ("receiverUserName") REFERENCES "Teacher"("userName") ON DELETE RESTRICT ON UPDATE CASCADE;
