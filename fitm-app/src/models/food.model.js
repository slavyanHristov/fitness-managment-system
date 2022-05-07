module.exports = (sequelizeConn, DataTypes) => {
    const Food = sequelizeConn.define("food", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false

        },
        calories: {
            type: DataTypes.FLOAT(11),
            allowNull: false
        },
        protein: {
            type: DataTypes.FLOAT(6),
            allowNull: false
        },
        carbohydrates: {
            type: DataTypes.FLOAT(6),
            allowNull: false
        },
        fats: {
            type: DataTypes.FLOAT(6),
            allowNull: false
        },
        quantity: {
            type: DataTypes.FLOAT(6),
            allowNull: false
        },
    }, {
        freezeTableName: true,
        timestamps: false
    })

    Food.associate = (models) => {
        Food.belongsTo(models.food_type, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
      };
    return Food
}