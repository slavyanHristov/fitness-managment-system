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
        models.meal_has_food.belongsToMany(models.eating_day, {
            through: EatingDayHasMealFood,
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        models.eating_day.belongsToMany(models.meal_has_food, {
            through: EatingDayHasMealFood,
            onDelete: "cascade",
            onUpdate: "cascade"
        })
      };
    return EatingDayHasMealFood
}
