const bcrypt = require('bcrypt')
const saltRounds = 10;

exports.hashPassword = (plainPassword) => {
     return bcrypt.hash(plainPassword, saltRounds)
}

exports.comparePassword = (plainPassword, hashFromDB) => {
    return bcrypt.compare(plainPassword, hashFromDB)
}