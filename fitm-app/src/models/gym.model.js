module.exports = (sequelizeConn, DataTypes) => {
    const Gym = sequelizeConn.define("gym", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        size: {
            type: DataTypes.FLOAT(11)
        },
        open_at: {
            type: DataTypes.TIME,
            allowNull: false
        },
        closed_at: {
            type: DataTypes.TIME,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        freezeTableName: true,
        timestamps: false
    })

    Gym.associate = (models) => {
        Gym.hasMany(models.employee, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade",
        })
        Gym.hasMany(models.membership, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade",
        })
        Gym.belongsTo(models.manager, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Gym.belongsTo(models.address, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
      };
    return Gym
}
