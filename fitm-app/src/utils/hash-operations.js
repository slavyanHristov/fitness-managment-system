const bcrypt = require('bcrypt')
const {
    BCRYPT_SALT
} = require('../../config/config')
exports.hashSecret = async (plainSecret) => {
    return await bcrypt.hash(plainSecret, BCRYPT_SALT)
}

exports.compare = async (plainSecret, hashFromDB) => {
    return await bcrypt.compare(plainSecret, hashFromDB)
}