CREATE TABLE IF NOT EXISTS book_requests
(
    id     int(11)      NOT NULL AUTO_INCREMENT,
    userId int(11)      NOT NULL,
    isbn   varchar(20)  NOT NULL,
    title  varchar(250) NOT NULL,
    reason varchar(150) NOT NULL,
    status int(11)      NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY FK_book_requests_user_id (userId),
    CONSTRAINT FOREIGN KEY FK_book_requests_user_id (userId) REFERENCES library_user (id) ON DELETE CASCADE ON UPDATE CASCADE
);
