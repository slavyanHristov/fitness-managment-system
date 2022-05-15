const db = require("../models")
const User = db.user
const Gym = db.gym
const Manager = db.manager
const Address = db.address
const City = db.city
const Country = db.country

// TODO: Think of moving this statement to utils directory
const gymInnerJoins = [{
        model: Manager,
        attributes: ['name', 'userId'],
        required: true,
        include: [{
            model: User,
            attributes: ['username', 'email'],
            required: true
        }]
    },
    {
        model: Address,
        attributes: ['name', 'cityId'], // ATTRIBUTES RETURNED
        required: true, // INNER JOIN
        include: [{
            model: City,
            attributes: ['name', 'countryId'],
            required: true,
            include: [{
                model: Country,
                attributes: ['name'],
                required: true
            }]
        }]
    }
]

const managerInnerJoins = [{
    model: User,
    attributes: ['username', 'email'],
    required: true
}]

// -------------- Get all gyms --------------
exports.getAllGyms = async (req, res) => {
    const allGyms = await Gym.findAll({
        include: gymInnerJoins
    })
    try {
        if (!allGyms) {
            return res.status(404).json({
                success: false,
                message: "There are no gyms in the database!"
            })
        }
        return res.status(200).json({
            success: true,
            allGyms
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// -------------- Get a single Gym --------------
exports.getOneGym = async (req, res) => {
    const id = req.params.id
    const foundGym = await Gym.findOne({
        where: {
            id: id // Condition
        },
        include: gymInnerJoins
    })

    try {
        if (!foundGym) {
            return res.status(404).json({
                success: false,
                message: "Gym not found!"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Gym has been found!",
            foundGym
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

// -------------- Delete a Gym --------------
exports.deleteGym = async (req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Provide gym id!"
        })
    }

    const foundGym = await Gym.findOne({
        where: {
            id
        }
    })

    if (!foundGym) {
        return res.status(404).json({
            success: false,
            message: "Gym not found!"
        })
    }
    try {
        await foundGym.destroy()
        return res.status(200).json({
            success: true,
            message: "Gym has been deleted!"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// -------------- Update a Gym --------------
exports.updateGym = async (req, res) => {
    const id = req.params.id
    try {
        const updatedGym = await Gym.update(req.body, {
            where: {
                id: id
            }
        })
        if (!updatedGym) {
            return res.status(404).json({
                success: false,
                message: "Record not found!"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Gym updated successfully!",
            updatedGym
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// -------------- Get All Managers --------------
exports.getAllManagers = async (req, res) => {
    const allManagers = await Manager.findAll({
        include: managerInnerJoins
    })
    try {
        if (!allManagers) {
            return res.status(404).json({
                success: false,
                message: "There are no managers in the database!"
            })
        }
        return res.status(200).json({
            success: true,
            allManagers
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// -------------- Get a Single Manager --------------
exports.getOneManager = async (req, res) => {
    const id = req.params.id
    const foundManager = await Manager.findOne({
        where: {
            id: id // Condition
        },
        include: managerInnerJoins
    })

    try {
        if (!foundManager) {
            return res.status(404).json({
                success: false,
                message: "Manager not found!"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Manager has been found!",
            foundManager
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

}