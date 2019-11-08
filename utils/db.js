var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

// 'SELECT city, population FROM cities'
// ('SELECT * FROM cities');
//
//
// module.export.addSignature = function addSignature(population) {
//     return db.query(
//         "INSERT INTO signature (city, population) VALUES ($1, $2)",
//         [city, population]
//     );
// };

module.exports.getNames = function getNames() {
    return db.query("SELECT * FROM cities");
};
