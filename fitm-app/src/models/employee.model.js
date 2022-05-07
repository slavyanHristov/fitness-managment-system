module.exports = (sequelizeConn, DataTypes) => {
    const Employee = sequelizeConn.define("employee", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING(45)
        },
        lastName: {
            type: DataTypes.STRING(45)
        },
        salary: {
            type: DataTypes.FLOAT(11)
        },
        phone: {
            type: DataTypes.STRING(10)
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
      };
    return Employee
}
