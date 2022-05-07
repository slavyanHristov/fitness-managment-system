const createServer = require('./app')
const {PORT} = require('../config/config')
const dbOperations = require('./utils/db-operations')
const app = createServer()

const start = () => {
    try {
        app.listen(PORT, async () => {
            console.log(`Server is listening on PORT: ${PORT}`);
            await dbOperations.syncWithDB()
        })
    } catch (error) {
        console.error("Error encountered", error)
    }
}
start()
// db.sequelize.sync({force: true})
// .then(console.log("Synced")).catch(err => console.error("Error: ", err))