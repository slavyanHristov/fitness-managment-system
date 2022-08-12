const { regularExpressions } = require("../utils");

module.exports = (sequelizeConn, DataTypes) => {
  const Gym = sequelizeConn.define(
    "gym",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
          is: {
            args: regularExpressions.gymName.regex,
            msg: regularExpressions.gymName.msg,
          },
        },
      },
      size: {
        type: DataTypes.FLOAT(11),
        validate: {
          isDecimal: true,
        },
      },
      open_at: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          is: {
            args: regularExpressions.hours_mins_secs.regex,
            msg: regularExpressions.hours_mins_secs.msg,
          },
        },
      },
      closed_at: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          is: {
            args: regularExpressions.hours_mins_secs.regex,
            msg: regularExpressions.hours_mins_secs.msg,
          },
        },
      },
      monthly_cost: {
        type: DataTypes.FLOAT(6),
        allowNull: false,
        validate: {
          isDecimal: true,
        },
      },
      phone: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          is: {
            args: regularExpressions.phone.regex,
            msg: regularExpressions.phone.msg,
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        validate: {
          is: {
            args: regularExpressions.description.regex,
            msg: regularExpressions.description.msg,
          },
        },
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  Gym.associate = (models) => {
    Gym.hasMany(models.employee, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Gym.hasMany(models.membership, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Gym.belongsTo(models.manager, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Gym.belongsTo(models.address, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Gym.hasMany(models.image, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return Gym;
};
