USE `efilibrarydb`;

CREATE TABLE home_office
(
    home_office_id BIGINT       NOT NULL AUTO_INCREMENT,
    name           VARCHAR(255) NOT NULL,
    country_code   CHAR(3)      NOT NULL, /* ISO 3166-1 alpha-3 */
    PRIMARY KEY (home_office_id)
);

# Create home offices for existing book locations
INSERT INTO home_office (name, country_code)
SELECT location, 'XXX'
FROM book;

# Properly update the locations of books
ALTER TABLE book
    ADD COLUMN home_office_id BIGINT REFERENCES home_office (home_office_id);

UPDATE book
SET home_office_id = (SELECT home_office_id FROM home_office WHERE home_office.name = book.location);

ALTER TABLE book
    DROP COLUMN location;

# This shouldn't remove the foreign key
ALTER TABLE book
    MODIFY COLUMN home_office_id BIGINT NOT NULL;

# Add a reference to the user their home office (may be null)
ALTER TABLE library_user
    ADD COLUMN home_office_id BIGINT REFERENCES home_office (home_office_id);
