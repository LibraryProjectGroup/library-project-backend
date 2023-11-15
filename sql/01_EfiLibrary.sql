-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.11.0-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for efilibrarydb
DROP DATABASE IF EXISTS `efilibrarydb`;
CREATE DATABASE IF NOT EXISTS `efilibrarydb` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `efilibrarydb`;

-- Dumping structure for table efilibrarydb.library_user
DROP TABLE IF EXISTS `library_user`;
CREATE TABLE IF NOT EXISTS `library_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(80) NOT NULL,
  `passw` varchar(150) NOT NULL,
  `administrator` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_libary_user_username` (`username`),
  UNIQUE KEY `UQ_libary_user_email` (`email`),
  CONSTRAINT `CHK_libary_user_username_not_empty` CHECK (char_length(`username`) > 0)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Dumping data for table efilibrarydb.library_user: ~4 rows (approximately)

INSERT INTO `library_user` (`id`, `username`, `email`, `passw`, `administrator`) VALUES
	(1, 'hemuli', 'hemuli@place.holder', 'qweqweqwe', 0),
	(2, 'joonajoo', 'joonajoo@place.holder', 'soin5oeran', 1),
	(3, 'mikkoR', 'mikkoR@place.holder', '4egdv3a453', 0),
	(4, 'Erika', 'Erika@place.holder', 'h4whs54htrh', 1),
  (5, 'admin', 'admin@eficode.com', '$2b$08$InfyNU.vUe8qc9BXLFmtzOfTcaxUz9POMIEw62UyNHWWDAv4S/NJm', 1),
  (6, 'rascal', 'rascal@place.holder', 'heckthelibrarians', 0),
  (7, 'testityyppi', 'testityyppi', '$2b$08$81Cv2lgk43p6EDHQ/qa3buFVcCMDtebDju4iAsoGOuRzAyqFnwHS6', 1),
  (8, 'asd', 'asd@asd', '$2b$08$2okL0BPRzVnLKQujmmRK7u4NU/FyeAXBRDJ9FDD7zQKzJ6r9aTyDW', 1),
  (9, 'testattavatyyppi', 'etu.suku@doesnt.exist', '$2b$08$4LdND6u7LymHX5DCBtmyweaYCOxKvUY6Rd9Z4N4cWQalAVtBSBOvi', 0),
  (10, 'testuser', 'test@user.com', 'T3st_Us3r', 0),
  (11, 'testuser1', 'testuser1', '$2b$08$periKenl3yqe4Myj7UfM3u02GAgcOQGztvqYEabeg9lLvBBC913Ye', 1),
  (12, 'testuser2', 'testuser2', '$2b$08$2lpBR4j.vTbR2EnpnoCnR.qxCuFuZdlRRy8xpxZenSi9I4CB49MYy', 0);

-- Dumping structure for table efilibrarydb.book
DROP TABLE IF EXISTS `book`;
CREATE TABLE IF NOT EXISTS `book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `library_user` int(11) NOT NULL,
  `title` varchar(250) NOT NULL,
  `image` varchar(500),
  `author` varchar(250) NOT NULL,
  `year` YEAR NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `topic` varchar(50) NOT NULL,
  `description` TEXT,
  `language` varchar(3),
  `location` varchar(20) NOT NULL,
  `deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `FK_book_library_user` (`library_user`),
  CONSTRAINT `FK_book_library_user` FOREIGN KEY (`library_user`) REFERENCES `library_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table efilibrarydb.book: ~3 rows (approximately)
INSERT INTO `book` (`id`, `library_user`, `title`, `image`,`author`, `year`, `isbn`, `topic`, `location`) VALUES
	(1, 1, 'JS for Dummies', "https://images.isbndb.com/covers/91/26/9789513119126.jpg", 'Mikko Mallikas', 2000, '123-456-789', 'JS', 'Nevada'),
	(2, 2, 'Java for Babies', "https://images.isbndb.com/covers/91/26/9789513119126.jpg", 'John Doe', 2015, '123-5223-789', 'Java', 'Florida'),
	(3, 3, 'Python for Pets', "https://images.isbndb.com/covers/91/26/9789513119126.jpg", 'S. Bonsai', 2020, '123-456-5623', 'JS', 'Hong Kong'),
  (4, 5, 'Assembly for Infants', "https://images.isbndb.com/covers/91/26/9789513119126.jpg", 'A. Einstein', 2007, '999-999-999', 'Assembly', 'Switzerland'),
  (5, 5, 'Animal Pictures for Programmers', "https://images.isbndb.com/covers/91/26/9789513119126.jpg", 'Oreally', 2010, '987-654-321', 'Safari', 'Pacific Ocean');

-- Dumping structure for table efilibrarydb.borrowing
DROP TABLE IF EXISTS `borrowing`;
CREATE TABLE IF NOT EXISTS `borrowing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `library_user` int(11) NOT NULL,
  `book` int(11) NOT NULL,
  `dueDate` date NOT NULL,
  `borrowDate` date NOT NULL,
  `returned` tinyint(1) NOT NULL,
  `returnDate` date,
  PRIMARY KEY (`id`),
  KEY `library_user` (`library_user`),
  KEY `book` (`book`),
  CONSTRAINT `FK_borrowing_book` FOREIGN KEY (`book`) REFERENCES `book` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_borrowing_library_user` FOREIGN KEY (`library_user`) REFERENCES `library_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1 COMMENT='data entry that shows which book was borrowed and when and by which library user';

-- Dumping data for table efilibrarydb.borrowing: ~3 rows (approximately)
INSERT INTO `borrowing` (`id`, `library_user`, `book`, `dueDate`, `borrowDate`, `returned`) VALUES
	(1, 1, 2, '2022-08-20', '2022-08-13', 0),
	(2, 3, 3, '2022-08-18', '2022-08-11', 0),
	(3, 2, 1, '2022-09-29', '2022-09-22', 1),
  (4, 6, 4, '2020-01-08', '2020-01-01', 0),
  (5, 6, 5, '2008-09-09', '2008-09-02', 0);

  DROP TABLE IF EXISTS `book_list`;
  CREATE TABLE IF NOT EXISTS `book_list` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `library_user` int(11) NOT NULL,
    `name` varchar(250),
    PRIMARY KEY (`id`),
    KEY `library_user` (`library_user`),
    CONSTRAINT `FK_book_list_library_user` FOREIGN KEY (`library_user`) REFERENCES `library_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  );


  DROP TABLE IF EXISTS `book_list_entry`;
  CREATE TABLE IF NOT EXISTS `book_list_entry` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `list` int(11) NOT NULL,
    `book` int(11) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `list` (`list`),
    KEY `book` (`book`),
    CONSTRAINT `FK_book_list_entry_list` FOREIGN KEY (`list`) REFERENCES `book_list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `FK_book_list_entry_book` FOREIGN KEY (`book`) REFERENCES `book` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  );

  DROP TABLE IF EXISTS `book_reservation`;
  CREATE TABLE IF NOT EXISTS `book_reservation` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `userId` int(11) NOT NULL,
    `bookId` int(11) NOT NULL,
    `borrowId` int(11) NOT NULL,
    `reservationDatetime` datetime NOT NULL,
    `loaned` tinyint(1) NOT NULL,
    `canceled` tinyint(1) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `userId` (`userId`),    
    KEY `bookId` (`bookId`),
    CONSTRAINT FOREIGN KEY `FK_book_reservation_user_id` (`userId`) REFERENCES `library_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FOREIGN KEY `FK_book_reservation_book_id` (`bookId`) REFERENCES `book` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FOREIGN KEY `FK_book_reservation_borrow_id` (`borrowId`) REFERENCES `borrowing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  );

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
