const { hashOperations, mailSender } = require("../utils");
const env = process.env.NODE_ENV || "development";
const { RESET_PASSWORD_EXPIRATION, CLIENT_URL, JWT_REFRESH_EXPIRATION } =
  require("../../config/config")[env];
const scheduler = require("node-schedule");
const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "token",
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiryDate: {
        type: DataTypes.DATE,
      },
      token_type: {
        type: DataTypes.ENUM("reset_password_token", "refresh_token"),
      },
    },
    {
      freezeTableName: true,
    }
  );

  Token.createResetPasswordToken = async (user) => {
    let token = await Token.findOne({
      where: {
        userId: user.id,
        token_type: 1, //reset password token
      },
    });
    if (token) {
      await token.destroy();
    }
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + RESET_PASSWORD_EXPIRATION);

    let generatedToken = crypto.randomBytes(32).toString("hex");
    let hashedToken = await hashOperations.hashSecret(generatedToken);
    let resetPasswordToken = await Token.create({
      token: hashedToken,
      userId: user.id,
      expiryDate: expiredAt.getTime(),
      token_type: 1, //reset password token
    });

    scheduler.scheduleJob(expiredAt.getTime(), async () => {
      await resetPasswordToken.destroy();
    });
    const link = `${CLIENT_URL}/password-reset?token=${generatedToken}&id=${user.id}`;
    const msg = {
      from: '"Fit-M Staff" <fitMCorp@example.com>',
      to: `${user.email}`,
      subject: "Password Reset Request",
      template: "passwordReset",
      context: {
        title: "Password Reset",
        resetPasswordLink: `${link}`,
      },
    };
    mailSender.sendMailEthereal(msg);
    return link;
  };

  Token.createRefreshToken = async (user) => {
    let expiredAt = new Date();
    console.log("Before: ", expiredAt);
    console.log("REFRESH TIMER: ", JWT_REFRESH_EXPIRATION);
    expiredAt.setSeconds(expiredAt.getSeconds() + JWT_REFRESH_EXPIRATION);
    console.log("After: ", expiredAt);
    let _token = crypto.randomBytes(32).toString("hex");
    let refreshToken = await Token.create({
      token: _token,
      userId: user.id,
      expiryDate: expiredAt.getTime(),
      token_type: 2, //refresh_token
    });

    return refreshToken.token;
  };
  Token.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
  };

  // associations
  Token.associate = (models) => {
    Token.belongsTo(models.user, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return Token;
};
