const {
    regularExpressions
} = require("../utils");

module.exports = (sequelizeConn, DataTypes) => {
    const Manager = sequelizeConn.define("manager", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            validate: {
                is: {
                    args: regularExpressions.fullName.regex,
                    msg: regularExpressions.fullName.msg
                },
                len: {
                    args: [4, 45],
                    msg: "Name not in correct range!"
                }
            }
        },
        firstLogin: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        freezeTableName: true
    })

    Manager.associate = (models) => {
        Manager.hasMany(models.gym, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Manager.hasMany(models.employee, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Manager.belongsTo(models.user, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
    };
    return Manager
}