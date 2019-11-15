var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/petition"
);

module.exports.addSignature = function addSignature(signature, userId) {
    return db.query(
        "INSERT INTO signatures (signature, user_id) VALUES ($1, $2 ) RETURNING id",
        [signature, userId]
    );
};

module.exports.getImage = function getImage(id) {
    return db.query(
        `SELECT signature, first, last
        FROM signatures
        JOIN users
        ON users.id = signatures.user_id
        WHERE signatures.id = $1`,
        [id]
    );
};

module.exports.countSignNames = function countSignNames() {
    return db.query(`SELECT COUNT (*) FROM signatures `);
};

module.exports.getSignNames = function getSignNames() {
    return db.query(`SELECT first, last, city, age, url
        FROM signatures
        JOIN users
        ON user_id = users.id
        LEFT JOIN user_profiles
        ON users.id = user_profiles.user_id`);
};

module.exports.getCity = function getCity(city) {
    return db.query(
        `SELECT first, last, age, url  FROM signatures
        JOIN users
        ON signatures.user_id = users.id
        LEFT JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE LOWER(city) = LOWER($1)`,
        [city]
    );
};

//////////   REGISTER  ///////

module.exports.register = function register(first, last, email, password) {
    return db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );
};

// ///// LOG IN //////

// module.exports.getUserInfo = function getUserInfo(email) {
//     return db.query(`SELECT password, id FROM users WHERE email = $1`, [email]);
// };
module.exports.getUserInfo = function getUserInfo(email) {
    return db.query(
        `SELECT users.password, users.id, signatures.id
AS "signid" FROM users LEFT JOIN signatures ON signatures.user_id = users.id WHERE email = $1`,
        [email]
    );
};

// module.exports.getSigners = function getSigners(userId) {
//     return db.query(`SELECT * FROM signatures WHERE user_id = $1`, [userId]);
// };

//////// PROFILE //////

module.exports.addUserInfo = function addUserInfo(age, city, url, userId) {
    return db.query(
        "INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4) RETURNING id",
        [age ? Number(age) : null || null, city, url, userId]
    );
};

////////// PROFILE EDIT //////////

module.exports.getProfile = function getProfile(userId) {
    return db.query(
        `SELECT first, last, city, age, url, email
        FROM users
        JOIN user_profiles
        ON users.id = user_profiles.user_id WHERE users.id=$1`,
        [userId]
    );
};

module.exports.updateUsers = function updatUsers(first, last, email, userId) {
    return db.query(
        `UPDATE users
        SET first = $1, last = $2, email = $3
        WHERE id = $4`,
        [first, last, email, userId]
    );
};

module.exports.updateProfileUsers = function updateProfileUsers(
    age,
    city,
    url,
    userId
) {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $1, city = $2, url = $3`,
        [age, city, url, userId]
    );
};

module.exports.updatePassword = function updatePassword(
    first,
    last,
    email,
    password,
    userId
) {
    return db.query(
        `UPDATE users
        SET first = $1, last = $2, email = $3, password = $4
        WHERE id = $5`,
        [first, last, email, password, userId]
    );
};

////////// Delete signatures /////

module.exports.deleteSignature = function deleteSignature(sigUserId) {
    return db.query(`DELETE from signatures WHERE user_id = $1`, [sigUserId]);
};
