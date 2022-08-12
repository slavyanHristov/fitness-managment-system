const { regularExpressions } = require("../utils");

module.exports = (sequelizeConn, DataTypes) => {
  const Client = sequelizeConn.define(
    "client",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          is: {
            args: regularExpressions.age.regex,
            msg: regularExpressions.age.msg,
          },
        },
      },
      sex: {
        type: DataTypes.ENUM("Male", "Female"),
        defaultValue: null,
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isDecimal: {
            args: true,
            msg: "Height should be in centimeters!",
          },
        },
      },
      weight: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        validate: {
          isDecimal: {
            args: true,
            msg: "Weight should be in KG's",
          },
        },
      },
      phone: {
        type: DataTypes.STRING(10),
        unique: true,
        validate: {
          is: {
            args: regularExpressions.phone.regex,
            msg: regularExpressions.phone.msg,
          },
        },
      },
      activity_level: {
        type: DataTypes.ENUM(
          "not active",
          "lightly active",
          "active",
          "very active"
        ),
        defaultValue: "lightly active",
      },
      fitness_goal: {
        type: DataTypes.ENUM("Muscle Gain", "Weight loss", "Maintenance"),
        defaultValue: "Maintenance",
      },
      fitness_level: {
        type: DataTypes.ENUM("Beginner", "Novice", "Intermediate", "Advanced"),
        defaultValue: "Novice",
      },
      calories: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );

  Client.resetMembershipExtras = async (client) => {
    if (client.fitnessInstructorId !== null || client.routineId !== null) {
      client.fitnessInstructorId = null;
      client.routineId = null;
      await client.save().catch(() => {
        throw new Error("Something went wrong with client update!");
      });
      return;
    }
    return;
  };

  Client.associate = (models) => {
    Client.hasMany(models.membership, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Client.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Client.belongsTo(models.fitness_instructor, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Client.belongsTo(models.address, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Client.belongsTo(models.meal_plan, {
      onUpdate: "cascade",
    });
    Client.belongsTo(models.routine, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return Client;
};
