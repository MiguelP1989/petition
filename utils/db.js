var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

module.exports.addSignature = function addSignature(signature, userId) {
    return db.query(
        "INSERT INTO signatures (signature, user_id) VALUES ($1, $2 ) RETURNING id",
        [signature, userId]
    );
};

module.exports.getImage = function getImage(id) {
    return db.query(`SELECT signature From signatures WHERE id = $1`, [id]);
};

module.exports.countSignNames = function countSignNames() {
    return db.query(`SELECT COUNT (*) FROM signatures `);
};

module.exports.getSignNames = function getSignNames() {
    return db.query(`SELECT * FROM users `);
};

//////////   REGISTER  ///////

module.exports.register = function register(first, last, email, password) {
    return db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );
};

// ///// LOG IN //////

module.exports.getUserInfo = function getUserInfo(email) {
    return db.query(`SELECT password, id FROM users WHERE email = $1`, [email]);
};

module.exports.getSigners = function getSigners(userId) {
    return db.query(`SELECT * FROM signatures WHERE user_id = $1`, [userId]);
};
