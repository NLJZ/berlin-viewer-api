/*
  Warnings:

  - You are about to drop the column `endTime` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('Screening', 'Exhibition');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_seriesId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_venueId_fkey";

-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_eventId_fkey";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "endTime",
DROP COLUMN "eventId",
DROP COLUMN "startTime",
ADD COLUMN     "artist" TEXT[],
ADD COLUMN     "cast" TEXT[],
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "director" TEXT[],
ADD COLUMN     "language" TEXT[],
ADD COLUMN     "runtime" TEXT,
ADD COLUMN     "seriesId" TEXT,
ADD COLUMN     "subs" TEXT[],
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "ListingType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "venueId" TEXT,
ADD COLUMN     "year" TEXT;

-- DropTable
DROP TABLE "Event";

-- DropEnum
DROP TYPE "EventType";

-- CreateTable
CREATE TABLE "Showtime" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "listingId" TEXT NOT NULL,
    "showtimeUrl" TEXT,

    CONSTRAINT "Showtime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
