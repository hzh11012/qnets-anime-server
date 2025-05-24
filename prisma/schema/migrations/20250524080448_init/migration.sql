/*
  Warnings:

  - You are about to drop the column `animeRecommendId` on the `anime` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `anime` DROP FOREIGN KEY `Anime_animeRecommendId_fkey`;

-- DropIndex
DROP INDEX `Anime_animeRecommendId_fkey` ON `anime`;

-- AlterTable
ALTER TABLE `anime` DROP COLUMN `animeRecommendId`;

-- CreateTable
CREATE TABLE `_AnimeToAnimeRecommend` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AnimeToAnimeRecommend_AB_unique`(`A`, `B`),
    INDEX `_AnimeToAnimeRecommend_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AnimeToAnimeRecommend` ADD CONSTRAINT `_AnimeToAnimeRecommend_A_fkey` FOREIGN KEY (`A`) REFERENCES `Anime`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AnimeToAnimeRecommend` ADD CONSTRAINT `_AnimeToAnimeRecommend_B_fkey` FOREIGN KEY (`B`) REFERENCES `AnimeRecommend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
