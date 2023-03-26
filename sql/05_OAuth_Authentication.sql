CREATE TABLE oidc_issuer
(
    oidc_issuer_id      BIGINT       NOT NULL AUTO_INCREMENT,
    issuer_name         VARCHAR(255) NOT NULL, /* I.e. "google" */
    oidc_well_known_url VARCHAR(255) NOT NULL,
    oauth_client_id     VARCHAR(255) NOT NULL,
    oauth_client_secret VARCHAR(255) NOT NULL,
    metadata            JSON         NULL,
    PRIMARY KEY (oidc_issuer_id),
    UNIQUE (issuer_name)
);

CREATE TABLE oauth_challenge_storage
(
    oauth_challenge_storage_id BIGINT       NOT NULL AUTO_INCREMENT,
    code_parameter             VARCHAR(255) NOT NULL,
    code_verifier              VARCHAR(255) NOT NULL,
    created_at                 TIMESTAMP    NOT NULL,
    oidc_issuer_id             BIGINT       NOT NULL,
    PRIMARY KEY (oauth_challenge_storage_id),
    FOREIGN KEY (oidc_issuer_id) REFERENCES oidc_issuer (oidc_issuer_id)
);

CREATE TABLE oidc_connection
(
    oidc_connection_id BIGINT       NOT NULL AUTO_INCREMENT,
    oidc_issuer_id     BIGINT       NOT NULL,
    oidc_subject       VARCHAR(255) NOT NULL, /* Stored in the "sub" claim of the JWT */
    library_user_id    INT          NOT NULL,
    FOREIGN KEY (library_user_id) REFERENCES library_user (id),
    FOREIGN KEY (oidc_issuer_id) REFERENCES oidc_issuer (oidc_issuer_id),
    PRIMARY KEY (oidc_connection_id)
);

/* Drop the NOT NULL */
ALTER TABLE library_user
    MODIFY COLUMN passw VARCHAR(150);

