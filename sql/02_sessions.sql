CREATE TABLE IF NOT EXISTS sessions
(
    id          int(11)     NOT NULL AUTO_INCREMENT,
    userId      int(11)     NOT NULL,
    secret      VARCHAR(32) NOT NULL,
    expires     int(11)     NOT NULL,
    invalidated int(1)      NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY FK_sessions_user_id (userId),
    CONSTRAINT FOREIGN KEY FK_sessions_user_id (userId) REFERENCES library_user (id) ON DELETE CASCADE ON UPDATE CASCADE
);
