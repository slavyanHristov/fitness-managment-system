const config = require("../../config/config");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define(
    "refreshToken",
    {
      token: {
        type: DataTypes.STRING,
      },
      expiryDate: {
        type: DataTypes.DATE,
      },
    },
    {
      freezeTableName: true,
    }
  );

  RefreshToken.createToken = async (user) => {
    let expiredAt = new Date();
    console.log("Before: ", expiredAt);
    console.log("REFRESH TIMER: ", config.JWT_REFRESH_EXPIRATION);
    expiredAt.setSeconds(
      expiredAt.getSeconds() + config.JWT_REFRESH_EXPIRATION
    );
    console.log("After: ", expiredAt);
    let _token = uuidv4();
    let refreshToken = await RefreshToken.create({
      token: _token,
      userId: user.id,
      expiryDate: expiredAt.getTime(),
    });

    return refreshToken.token;
  };
  RefreshToken.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
  };

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.user, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };

  return RefreshToken;
};
