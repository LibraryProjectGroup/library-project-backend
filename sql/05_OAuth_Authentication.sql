CREATE TABLE oauth_challenge_storage
(
    oauth_challenge_storage_id BIGINT       NOT NULL AUTO_INCREMENT,
    code_parameter             VARCHAR(255) NOT NULL,
    code_verifier              VARCHAR(255) NOT NULL,
    created_at                 TIMESTAMP    NOT NULL,
    PRIMARY KEY (oauth_challenge_storage_id)
);

CREATE TABLE oidc_connection
(
    oidc_connection_id BIGINT       NOT NULL AUTO_INCREMENT,
    oidc_issuer        VARCHAR(255) NOT NULL, /* I.e. "google" */
    oidc_subject       VARCHAR(255) NOT NULL, /* Stored in the "sub" claim of the JWT */
    library_user_id    INT          NOT NULL,
    FOREIGN KEY (library_user_id) REFERENCES library_user (id),
    PRIMARY KEY (oidc_connection_id)
);

/* Drop the NOT NULL */
ALTER TABLE library_user
    MODIFY COLUMN passw VARCHAR(150);

