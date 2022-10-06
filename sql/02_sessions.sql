CREATE TABLE IF NOT EXISTS `sessions` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `secret` VARCHAR(30) NOT NULL,
    `expires` int(11) NOT NULL,
    `invalidated` int(1) DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `FK_sessions_user_id` (`user_id`),
    CONSTRAINT FOREIGN KEY `FK_sessions_user_id` (`user_id`) REFERENCES `library_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);