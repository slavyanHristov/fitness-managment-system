module.exports = (sequelizeConn, DataTypes) => {
    const MealHasFood = sequelizeConn.define("meal_has_food", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
    }, {
        freezeTableName: true
    })

    MealHasFood.associate = (models) => {
        models.meal.belongsToMany(models.food, {
            through: MealHasFood,
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        models.food.belongsToMany(models.meal, {
            through: MealHasFood,
            onDelete: "cascade",
            onUpdate: "cascade"
        })
      };
    return MealHasFood
}
