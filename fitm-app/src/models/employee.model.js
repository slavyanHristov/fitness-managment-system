const {
    regularExpressions
} = require('../utils')

module.exports = (sequelizeConn, DataTypes) => {
    const Employee = sequelizeConn.define("employee", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING(45),
            validate: {
                is: {
                    args: regularExpressions.name.regex,
                    msg: regularExpressions.name.msg
                }
            }
        },
        lastName: {
            type: DataTypes.STRING(45),
            validate: {
                is: {
                    args: regularExpressions.name.regex,
                    msg: regularExpressions.name.msg
                }
            }
        },
        salary: {
            type: DataTypes.FLOAT(11),
            validate: {
                isDecimal: true
            }
        },
        position: {
            type: DataTypes.ENUM("fitness instructor", "receptionist", "technician"),
            defaultValue: "fitness instructor"
        },
        phone: {
            type: DataTypes.STRING(10),
            validate: {
                is: {
                    args: regularExpressions.phone.regex,
                    msg: regularExpressions.phone.msg
                }
            }
        }
    }, {
        freezeTableName: true
    })

    Employee.associate = (models) => {
        Employee.hasMany(models.fitness_instructor, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Employee.belongsTo(models.address, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Employee.belongsTo(models.gym, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Employee.belongsTo(models.manager, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
    };
    return Employee
}