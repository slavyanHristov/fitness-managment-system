const { regularExpressions } = require("../utils");

module.exports = (sequelizeConn, DataTypes) => {
  const Manager = sequelizeConn.define(
    "manager",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      salary: {
        type: DataTypes.FLOAT(11),
        validate: {
          isDecimal: true,
        },
      },
      phone: {
        type: DataTypes.STRING(10),
        validate: {
          is: {
            args: regularExpressions.phone.regex,
            msg: regularExpressions.phone.msg,
          },
        },
      },
    },
    {
      freezeTableName: true,
    }
  );

  Manager.associate = (models) => {
    Manager.hasMany(models.gym, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Manager.hasMany(models.employee, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Manager.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return Manager;
};
