var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

module.exports.addSignature = function addSignature(first, last, signature) {
    return db.query(
        "INSERT INTO signatures (first, last, signature) VALUES ($1, $2, $3) RETURNING id, first, last",
        [first, last, signature]
    );
};

// module.exports.getSignNames = function getSignNames(first, last) {
//     return db.query(
//         `SELECT first, last From signatures WHERE firs=${first} AND last=${last} `
//     );
// };

module.exports.getImage = function getImage(id) {
    return db.query(
        `SELECT first, last, signature From signatures WHERE id = $1`,
        [id]
    );
};

module.exports.getSignNames = function getSignNames() {
    return db.query(`SELECT COUNT (*) FROM signatures `);
};
