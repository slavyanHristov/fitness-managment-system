const db = require("../models")
const hashOperations = require("./hash-operations")
const mailSender = require("./mail-sender")
const {
    RESET_PASSWORD_EXPIRATION,
    CLIENT_URL,
} = require("../../config/config")
const User = db.user
const ResetPasswordToken = db.reset_password_token
const scheduler = require("node-schedule")

const requestPasswordReset = async (user) => {

    let token = await ResetPasswordToken.findOne({
        where: {
            userId: user.id
        }
    })
    if (token) {
        await token.destroy();
    }
    let expiredAt = new Date()
    expiredAt.setSeconds(expiredAt.getSeconds() + RESET_PASSWORD_EXPIRATION)

    let generatedToken = crypto.randomBytes(32).toString("hex");
    let hashedToken = await hashOperations.hashSecret(generatedToken)
    let resetPasswordToken = await ResetPasswordToken.create({
        token: hashedToken,
        userId: user.id,
        expiryDate: expiredAt.getTime()
    })

    scheduler.scheduleJob(expiredAt.getTime(), async () => {
        await resetPasswordToken.destroy()
    })
    const link = `${CLIENT_URL}/passwordReset?token=${resetPasswordToken.token}&id=${user.id}`;
    const msg = {
        from: '"Fit-M Staff" <fitMCorp@example.com>',
        to: `${user.email}`,
        subject: "Password Reset Request",
        text: `Here is the reset link: ${link}`,
        html: `<strong>Here is the reset link: ${link}</strong>`
    }
    mailSender.sendMailEthereal(msg)
    return link
}

const changePassword = async (email, token, password) => {

    const user = await User.findOne({
        where: {
            email: email
        }
    })
    if (!user) {
        throw new Error("Provided user doesn't exist!")
    }

    let passwordResetToken = await ResetPasswordToken.findOne({
        where: {
            userId: user.id
        }
    })

    if (!passwordResetToken) {
        throw new Error("Invalid or expired password reset token!")
    }

    const isValid = await hashOperations.compare(token, passwordResetToken.token);
    if (!isValid) {
        throw new Error("Invalid or expired password reset token!")
    }
    const hashedPassword = await hashOperations.hashSecret(password)
    await User.update({
        password: hashedPassword
    }, {
        where: {
            id: user.id
        }
    })
    await passwordResetToken.destroy()
    return true
}

module.exports = {
    requestPasswordReset,
    changePassword
}