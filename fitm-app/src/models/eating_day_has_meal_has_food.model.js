module.exports = (sequelizeConn, DataTypes) => {
    const EatingDayHasMealFood = sequelizeConn.define("eating_day_has_meal_has_food", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

    }, {
        freezeTableName: true,
        timestamps: false
    })

    EatingDayHasMealFood.associate = (models) => {
        EatingDayHasMealFood.belongsTo(models.eating_day, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        EatingDayHasMealFood.belongsTo(models.meal_has_food, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
    };
    return EatingDayHasMealFood
}