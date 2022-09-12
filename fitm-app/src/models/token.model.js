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
  // associations
  Token.associate = (models) => {
    Token.belongsTo(models.user, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return Token;
};
