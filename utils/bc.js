const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const hash = promisify(bcrypt.hash);
const genSalt = promisify(bcrypt.genSalt);

//will be called in the post registratiom route
exports.hash = password => genSalt().then(salt => hash(password, salt));

//will be called in the post login route
exports.compare = promisify(bcrypt.compare);
//compare takes two arguments
//1. the password user sends from the client (browser)
//2. the hashed pasword from database
