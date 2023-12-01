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
  `library_user` int(11),
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
  CONSTRAINT `FK_book_library_user` FOREIGN KEY (`library_user`) REFERENCES `library_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table efilibrarydb.book: ~3 rows (approximately)
INSERT INTO `book` (`id`, `library_user`, `title`, `image`,`author`, `year`, `isbn`, `topic`, `location`, `language`, `description`) VALUES
	(1, 1, 'JavaScript All-in-One For Dummies', "http://books.google.com/books/content?id=Co61EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api", 'Chris Minnick', 2023, '9781119906834', 'JavaScript', 'Nevada', 'en', 
    "A developer’s resource to learning one of the most-used scripting languages JavaScript All-in-One For Dummies saves you shelf space by offering a complete introduction to JavaScript and how it’s used in the real world. This book serves up JavaScript coding basics before diving into the tools, libraries, frameworks, and runtime environments new and experienced coders need to know. Start by learning the basics of JavaScript and progress through the techniques and tools used by professional JavaScript developers, even if you’ve never written code before. You also get the details of today’s hottest libraries and frameworks—React.js, Vue.js, Svelte, and Node.js. Learn the basics of web and application development with the JavaScript language Grasp the similarities and differences between React.js, Vue.js, and Svelte Discover how to write server-side JavaScript and how to access databases with Node.js Gain a highly marketable skill, with one of the most popular coding languages Launch or further your career as a coder with easy-to-follow instruction This is the go-to Dummies guide for future and current coders who need an all-inclusive guide JavaScript. This is the go-to Dummies guide for future and current coders who need an all-inclusive guide to the world of JavaScript."),
  (2, 2, 'Pieni Java 8 -kirja', "http://books.google.com/books/content?id=bEWCBAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api", 'Juha Peltomäki', 2014, '9789522869968', 'Java', 'Florida', 'fi', 
    "Uuden suomenkielisen Java-perusteoksen toinen painos! Kirja sopii opiskelijalle, Javaa aloittavalle sekä Javan aiempia versioita hieman osaavalle. Tiivis kirja on sopiva sekä oppilaitosten kurssikirjaksi että itseopiskeluun. Java on säilyttänyt jo lähes 20 vuotta asemansa johtavana olio-ohjelmointikielenä. Java 8 tuo mukanaan kaivatun tuen funktionaaliselle ohjelmoinnille lambda-lausekkeiden muodossa. Kirjan alkuosassa käydään läpi Javan perusteet, olio-ohjelmointi ja kokoelmat. Loppuosa pureutuu Java 8:n tärkeimpiin uudistuksiin eli lambda-lausekkeisiin ja uuteen graafiseen JavaFX-kirjastoon. Kirjaan liittyvän lisämateriaalin, kuten esimerkit, voi ladata osoitteesta books.jupelearning.com."),
  (3, 3, 'Python for Kids, 2nd Edition', "http://books.google.com/books/content?id=R511EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api", 'Jason R. Briggs', 2022, '9781718503021', 'Python', 'Hong Kong', 'en',
    "The second edition of the best-selling Python for Kids—which brings you (and your parents) into the world of programming—has been completely updated to use the latest version of Python, along with tons of new projects! Python is a powerful, expressive programming language that’s easy to learn and fun to use! But books about learning to program in Python can be dull and gray—and that’s no fun for anyone. Python for Kids brings Python to life and brings kids (and their parents) into the wonderful world of programming. Author Jason R. Briggs guides readers through the basics, experimenting with unique (and often hilarious) example programs that feature ravenous monsters, secret agents, thieving ravens, and more. New terms are defined; code is colored, dissected, and explained; and quirky, full-color illustrations keep things fun and engaging throughout. Chapters end with programming puzzles designed to stretch the brain and strengthen understanding. By the end of the book, young readers will have programmed two complete games: a clone of the famous Pong, and “Mr. Stick Man Races for the Exit”—a platform game with jumps, animation, and much more. This second edition has been completely updated and revised to reflect the latest Python version and programming practices, with new puzzles to inspire readers to take their code farther than ever before. Why should serious adults have all the fun? Python for Kids is the ticket into the amazing world of computer programming."),
  (4, 5, 'Docker Cookbook', "http://books.google.com/books/content?id=VcjYrQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api", 'Sébastien Goasguen', 2015, '9781491919712', 'Docker', 'Switzerland', 'en', 
    "Whether you’re deploying applications on-premise or in the cloud, this cookbook is for developers, operators, and IT professionals who need practical solutions for using Docker. The recipes in this book will help developers go from zero knowledge to distributed applications packaged and deployed within a couple of chapters. IT professionals will be able to use this cookbook to solve everyday problems, as well as create, run, share, and deploy Docker images quickly. Operators will learn and understand what developers are excited about and start to adopt the tools that will change the way they work. Get started using Docker immediately Learn how to use Docker for large-scale deployments Become familiar with other tools in the Docker ecosystem, such as kubernetes and coreos Use Docker in production, with recipes on cloud administration, monitoring, and common related components Docker’s new approach to containerization and its enhancements in terms of security, integration with existing development tools, and application sharing are revolutionizing the way developers think about creating new applications and the way system administrators might operate their infrastructure in the future."),
  (5, 5, 'Learn C# in One Day and Learn It Well', "http://books.google.com/books/content?id=n_YZjwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api", 'Jamie Chan', 2015, '9781518800276', 'C#', 'Pacific Ocean', 'en', 
    "Have you ever wanted to learn computer programming but were afraid it would be too difficult for you? Or perhaps you already know other programming languages, and are now interested in learning C#. C# is part of the .Net framework and is intended to be a simple general-purpose programming language that can be used to develop different types of applications, including console, windows, web and mobile apps.");

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
