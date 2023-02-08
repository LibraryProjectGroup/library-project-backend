CREATE TABLE oauth_challenge_storage
(
    oauth_challenge_storage_id BIGINT       NOT NULL AUTO_INCREMENT,
    code_parameter             VARCHAR(255) NOT NULL,
    code_verifier              VARCHAR(255) NOT NULL,
    created_at                 TIMESTAMP    NOT NULL,
    PRIMARY KEY (oauth_challenge_storage_id)
)
