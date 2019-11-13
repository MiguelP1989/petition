var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

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
    return db.query(`SELECT first, last, city, age, url FROM signatures
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
AS signatureId FROM users LEFT JOIN signatures ON signatures.user_id = users.id WHERE email = $1`,
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

// db.getSigners(userId)
//                     .then(sign => {
//                         console.log("sign : ", sign);
//                         if (sign.rows.length === 1) {
//                             res.redirect("/signed");
//                         } else {
//                             res.redirect("/petition");
//                         }
//                     })
//                     .catch(err => {
//                         console.log("error: ", err);
//                     });
//             }
//             if (match === false) {
//                 res.redirect("/petition");
//             }
//         })
//         .catch(() => res.redirect("/petition"));
// })
// .catch(() => res.redirect("/register"));
// });
