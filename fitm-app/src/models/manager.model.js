const { regularExpressions } = require("../utils");

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
                    args: regularExpressions.name.regex,
                    msg: regularExpressions.name.msg
                },
                len: {
                    args: [4, 45],
                    msg: "Name not in correct range!"
                }
            }
        }
    }, {
        freezeTableName: true
    })

    Manager.associate = (models) => {
        Manager.hasMany(models.gym, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Manager.belongsTo(models.user, {
            foreignKey: {allowNull: false},
            onDelete: "cascade",
            onUpdate: "cascade"
        })
      };
    return Manager
}
