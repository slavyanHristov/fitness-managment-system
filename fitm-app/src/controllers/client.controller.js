const db = require("../models")
const Client = db.client
const Membership = db.membership
const Gym = db.gym
const FitnessInstructor = db.fitness_instructor
const Notification = db.notification
const NotificationRecipient = db.notification_recipient


exports.createMembership = async (req, res) => {
    const {
        gymId,
        membershipTypeId,
    } = req.body
    const foundGym = await Gym.findOne({
        where: {
            id: gymId
        }
    })
    const foundClient = await Client.findOne({
        where: {
            id: req.clientId
        }
    })

    if (!foundGym || !foundClient) {
        return res.status(404).json({
            success: false,
            message: "Gym or client do not exist!"
        })
    }

    try {
        const isMembershipExistent = await Membership.findOne({
            where: {
                clientId: foundClient.id,
                gymId: gymId
            }
        })
        if (isMembershipExistent) {
            return res.status(400).json({
                success: false,
                message: "Client already has membership in this gym."
            })
        }
        const membership = await Membership.createMembership(foundGym, foundClient, membershipTypeId)
        return res.status(200).json({
            success: true,
            membership
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

exports.verifyEndDate = async (req, res) => {
    const {
        clientId
    } = req.body

    const foundClient = await Client.findOne({
        where: {
            id: clientId
        }
    })
    if (!foundClient) {
        return res.status(404).json({
            success: false,
            message: "Client doesn't exist"
        })
    }

    try {
        const foundMembership = await Membership.verifyValidity(foundClient)
        if (!foundMembership) {
            return res.status(404).json({
                success: false,
                message: "User doesn't have membership or it's not valid!"
            })
        }

        if (Membership.verifyEndDate(foundMembership)) {
            foundMembership.status = 'expired'
            await foundMembership.save()
        }

        return res.status(200).json({
            success: true,
            message: foundMembership.status
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

exports.setInstructor = async (req, res) => {
    const instructorId = req.params.id

    if (!instructorId) {
        return res.status(404).json({
            success: false,
            message: "Please provide an instructor!"
        })
    }

    try {
        const instructor = await FitnessInstructor.findOne({
            where: {
                id: instructorId
            }
        })
        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor doesn't exist!"
            })
        }
        const loggedClient = await Client.findOne({
            where: req.clientId
        })
        const validMembership = await Membership.verifyValidity(loggedClient)

        if (!validMembership) {
            return res.status(400).json({
                success: false,
                message: "You don't have a valid membership to hire an instructor!"
            })
        }
        await loggedClient.setFitness_instructor(instructor)

        await createNotification(loggedClient, instructor)
        return res.status(200).json({
            success: true,
            message: "You now have a fitness instructor!",
            loggedClient
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

const createNotification = async (sender, recipient) => {
    const notification = await Notification.create({
        title: "New client!",
        description: "You've been chosen for instructor by a client!",
        userId: sender.userId
    })
    await notification.createNotification_recipient({
        is_read: 2,
        userId: recipient.userId
    })
}

// Send, Recieve notifications?