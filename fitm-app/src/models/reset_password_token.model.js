const {
    hashOperations,
    mailSender
} = require("../utils")
const {
    RESET_PASSWORD_EXPIRATION,
    CLIENT_URL,
} = require("../../config/config")
const scheduler = require("node-schedule")
const crypto = require("crypto")


module.exports = (sequelize, DataTypes) => {
    const ResetPasswordToken = sequelize.define("reset_password_token", {
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expiryDate: {
            type: DataTypes.DATE
        }
    }, {
        freezeTableName: true
    })

    ResetPasswordToken.createToken = async (user) => {
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
        const link = `${CLIENT_URL}/password-reset?token=${generatedToken}&id=${user.id}`;
        const msg = {
            from: '"Fit-M Staff" <fitMCorp@example.com>',
            to: `${user.email}`,
            subject: "Password Reset Request",
            template: 'passwordReset',
            context: {
                title: "Password Reset",
                resetPasswordLink: `${link}`
            }
            // text: `Here is the reset link: ${link}`,
            // html: `<strong>Here is the reset link: ${link}</strong>`
        }
        mailSender.sendMailEthereal(msg)
        return link
    }
    //TODO: Create Token method
    // associations
    ResetPasswordToken.associate = (models) => {
        ResetPasswordToken.belongsTo(models.user, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
    }

    return ResetPasswordToken
}