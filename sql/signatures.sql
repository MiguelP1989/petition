DROP TABLE IF EXISTS  signatures;

CREATE TABLE signatures (
    id SERIAL primary key,
    signature TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

);


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- INSERT INTO cities (city, country, population) VALUES ('Berlin', 'Germany', 3610156);
-- INSERT INTO cities (city, country, population) VALUES ('Hamburg', 'Germany', 1774242);
-- INSERT INTO cities (city, country, population) VALUES ('Munch', 'Germany', 1450381);
-- INSERT INTO cities (city, country, population) VALUES ('Tokyo', 'Japan', 13617445);
-- INSERT INTO cities (city, country, population) VALUES ('Sydney', 'Australia', 4921000);
