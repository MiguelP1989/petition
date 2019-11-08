DROP TABLE IF EXISTS  signatures;

CREATE TABLE signatures (
    id SERIAL primary key,
    first VARCHAR,
    last VARCHAR,
    signature TEXT,
    created_at TIMESTAMP
);


-- INSERT INTO cities (city, country, population) VALUES ('Berlin', 'Germany', 3610156);
-- INSERT INTO cities (city, country, population) VALUES ('Hamburg', 'Germany', 1774242);
-- INSERT INTO cities (city, country, population) VALUES ('Munch', 'Germany', 1450381);
-- INSERT INTO cities (city, country, population) VALUES ('Tokyo', 'Japan', 13617445);
-- INSERT INTO cities (city, country, population) VALUES ('Sydney', 'Australia', 4921000);
