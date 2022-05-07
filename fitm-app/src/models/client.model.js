const { regularExpressions } = require("../utils");

module.exports = (sequelizeConn, DataTypes) => {
    const Client = sequelizeConn.define("client", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                is: {
                    args: regularExpressions.name.regex,
                    msg: regularExpressions.name.msg
                }
            }
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                is: {
                    args: regularExpressions.age.regex,
                    msg: regularExpressions.age.msg
                }
            }
        },
        height: {
            type: DataTypes.DECIMAL(3,2),
            allowNull: false,
            validate: {
                isDecimal: {
                    args: true,
                    msg: "Height should be in meters and decimal format!"
                }
            }
        },
        weight: {
            type: DataTypes.DECIMAL(6,2),
            allowNull: false,
            validate: {
                isDecimal: {
                    args: true,
                    msg: "Weight should be in KG's"
                }
            }
        },
        phone: {
            type: DataTypes.STRING(10),
            unique: true,
            validate: {
                is: {
                    args: regularExpressions.phone.regex,
                    msg: regularExpressions.phone.msg
                }
            }
        },
        sleep_time: {
            type: DataTypes.TIME,
            validate: {
                is: {
                    args: regularExpressions.sleep_time.regex,
                    msg: regularExpressions.sleep_time.msg
                }
            }
        },
    }, {
        freezeTableName: true
    })

    Client.associate = (models) => {
        Client.hasMany(models.membership, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Client.belongsTo(models.user, {
            foreignKey: {
                allowNull:false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Client.belongsTo(models.fitness_instructor, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Client.belongsTo(models.address, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Client.belongsTo(models.client_fitness_level, {
            foreignKey: {
                allowNull:false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Client.belongsTo(models.meal_plan, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Client.belongsTo(models.routine, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
      };
    return Client
}
