CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR,
    url VARCHAR,
    user_id INT REFERENCES users(id) NOT NULL UNIQUE
);
