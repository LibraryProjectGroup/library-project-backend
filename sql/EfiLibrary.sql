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
  `passw` varchar(150) NOT NULL,
  `administrator` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_libary_user_username` (`username`),
  CONSTRAINT `CHK_libary_user_username_not_empty` CHECK (char_length(`username`) > 0)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Dumping data for table efilibrarydb.library_user: ~4 rows (approximately)
INSERT INTO `library_user` (`id`, `username`, `passw`, `administrator`) VALUES
	(1, 'hemuli', 'qweqweqwe', 0),
	(2, 'joonajoo', 'soin5oeran', 1),
	(3, 'mikkoR', '4egdv3a453', 0),
	(4, 'Erika', 'h4whs54htrh', 1);

-- Dumping structure for table efilibrarydb.book
DROP TABLE IF EXISTS `book`;
CREATE TABLE IF NOT EXISTS `book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `library_user` int(11) NOT NULL,
  `title` varchar(250) NOT NULL,
  `author` varchar(250) NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `topic` varchar(50) NOT NULL,
  `location` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_book_library_user` (`library_user`),
  CONSTRAINT `FK_book_library_user` FOREIGN KEY (`library_user`) REFERENCES `library_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table efilibrarydb.book: ~3 rows (approximately)
INSERT INTO `book` (`id`, `library_user`, `title`, `author`, `isbn`, `topic`, `location`) VALUES
	(1, 1, 'JS for Dummies', 'Mikko Mallikas', '123-456-789', 'JS', 'Nevada'),
	(2, 2, 'Java for Babies', 'John Doe', '123-5223-789', 'Java', 'Florida'),
	(3, 3, 'Python for Pets', 'S. Bonsai', '123-456-5623', 'JS', 'Hong Kong');

-- Dumping structure for table efilibrarydb.borrowing
DROP TABLE IF EXISTS `borrowing`;
CREATE TABLE IF NOT EXISTS `borrowing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `library_user` int(11) NOT NULL,
  `book` int(11) NOT NULL,
  `dueDate` date NOT NULL,
  `borrowDate` date NOT NULL,
  `returned` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `library_user` (`library_user`),
  KEY `book` (`book`),
  CONSTRAINT `FK_borrowing_book` FOREIGN KEY (`book`) REFERENCES `book` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_borrowing_library_user` FOREIGN KEY (`library_user`) REFERENCES `library_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1 COMMENT='data entry that shows which book was borrowed and when and by which library user';

-- Dumping data for table efilibrarydb.borrowing: ~3 rows (approximately)
INSERT INTO `borrowing` (`id`, `library_user`, `book`, `dueDate`, `borrowDate`, `returned`) VALUES
	(1, 1, 2, '2022-08-20', '2022-08-13', b'1'),
	(2, 3, 3, '2022-08-18', '2022-08-11', b'1'),
	(3, 2, 1, '2022-09-29', '2022-09-22', b'0');



/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
