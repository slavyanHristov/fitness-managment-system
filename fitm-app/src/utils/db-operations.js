const db = require('../models')

exports.syncWithDB = async () => {
    try {
        await db.sequelize.sync({force: true})
        console.log("Synced!");
    } catch (err) {
        console.log(err);
    }
    
}

exports.closeConnection = async () => {
    try {
        await db.sequelize.close()
    } catch(err) {
        console.log(err);
    }
}