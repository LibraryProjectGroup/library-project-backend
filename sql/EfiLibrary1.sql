-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.9.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for efilibrarydb
CREATE DATABASE IF NOT EXISTS `efilibrarydb` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `efilibrarydb`;

-- Dumping structure for table efilibrarydb.book
CREATE TABLE IF NOT EXISTS `book` (
  `id` int(11) NOT NULL,
  `library_user` int(11) NOT NULL,
  `topic` varchar(50) NOT NULL,
  `title` varchar(250) NOT NULL,
  `author` varchar(250) NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `location` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_book_library_user` (`library_user`),
  CONSTRAINT `FK_book_library_user` FOREIGN KEY (`library_user`) REFERENCES `library_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table efilibrarydb.book: ~1 rows (approximately)
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` (`id`, `library_user`, `topic`, `title`, `author`, `isbn`, `location`) VALUES
	(1, 1, 'JS', 'JS For Dummies', 'JS Teacher', '12345-67-89', 'MERICA');
/*!40000 ALTER TABLE `book` ENABLE KEYS */;

-- Dumping structure for table efilibrarydb.library_user
CREATE TABLE IF NOT EXISTS `library_user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `passw` varchar(150) NOT NULL,
  `administrator` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_libary_user_username` (`username`),
  CONSTRAINT `CHK_libary_user_username_not_empty` CHECK (char_length(`username`) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table efilibrarydb.library_user: ~1 rows (approximately)
/*!40000 ALTER TABLE `library_user` DISABLE KEYS */;
INSERT INTO `library_user` (`id`, `username`, `passw`, `administrator`) VALUES
	(1, 'mikkomallikas', '1234', 1);
/*!40000 ALTER TABLE `library_user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
