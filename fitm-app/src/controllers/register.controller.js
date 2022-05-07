const db = require('../models')
const User = db.user
const Country = db.country

// -------------- Create Admin -------------- 

exports.createAdmin = async (req, res) => {
    const {username, password, email} = req.body

    if(!username || !password || !email) {
        return res.status(401).send("Error: Empty fields!")
    }
    try {
        let newAdmin = await User.create({
            username: username,
            password: password, 
            email: email,
            userTypeId: 1 
        })
        return res.send(newAdmin)
    } catch(error) {
        res.status(401).send(`Error occured: ${error.message}`)
    }
} 

// -------------- Create Manager --------------

exports.registerManager = async (req, res) => {
    const {username, password, email, name} = req.body

    if(!username || !password || !email || !name) {
        return res.status(401).send("Error: Empty fields!")
    }

    const t = await db.sequelize.transaction()
    try {
        let newUser = await User.create({
            username: username,
            password: password, 
            email: email,
            userTypeId: 2 
        }, { transaction: t })
        await newUser.createManager({name}, { transaction: t })
        await t.commit()
        return res.send(newUser)
    } catch (error) {
        await t.rollback()
        return res.status(401).send(`Error occured: ${error.message}`)
    }
} 

// -------------- Create Client -------------- 

exports.registerClient = async (req, res) => {
    const {
        username,
        password,
        email,
        name,
        age,
        height,
        weight,
        fitnessLevel,
        country,
        city,
        address,
        phone,
        sleep_time
        // Instructor,
        // meal_plan,
        // routine
    } = req.body

    if(!username || !password || !email || !name || !age || !height || !weight || !fitnessLevel
        || !country || !city || !address) {
        return res.status(401).send("Error: Empty fields!")
    }

    const t = await db.sequelize.transaction()
    try {
        let newUser = await User.create({
            username: username,
            password: password, 
            email: email,
            userTypeId: 4 
        }, {transaction: t})

        let newCountry = await Country.create({
            name: country
        }, {transaction: t})
        
        let newCity = await newCountry.createCity({
            name: city
        }, {transaction: t})
        await newCity.createAddress({
            name: address
        }, {transaction: t})

        await newUser.createClient({
            name,
            age, 
            height, 
            weight, 
            clientFitnessLevelId: fitnessLevel
        }, {transaction: t})

        t.commit()
        return res.send(newUser)

    } catch (error) {
        await t.rollback()
        return res.status(401).send(`Error occured: ${error.message}`)
    }
} 