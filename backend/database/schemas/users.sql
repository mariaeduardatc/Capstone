CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    password VARCHAR(500) NOT NULL,
    first_name VARCHAR(500) NOT NULL,
    last_name VARCHAR(500) NOT NULL,
    email VARCHAR(500) NOT NULL UNIQUE CHECK (position('@' IN email) > 1)
);
