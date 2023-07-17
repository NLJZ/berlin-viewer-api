/*
  Warnings:

  - You are about to drop the column `startTime` on the `Showtime` table. All the data in the column will be lost.
  - Added the required column `date` to the `Showtime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Showtime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Showtime" DROP COLUMN "startTime",
ADD COLUMN     "date" DATE NOT NULL,
ADD COLUMN     "endDate" DATE,
ADD COLUMN     "time" TIME(4) NOT NULL,
ALTER COLUMN "endTime" SET DATA TYPE TIME(4);

-- DropEnum
DROP TYPE "user_status";
