module.exports = (sequelizeConn, DataTypes) => {
  const MealHasFood = sequelizeConn.define(
    "meal_has_food",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  MealHasFood.findMealHasFood = async (mealHasFoodId) => {
    const foundMealHasFood = await MealHasFood.findOne({
      where: {
        id: mealHasFoodId,
      },
    });
    return foundMealHasFood;
  };

  MealHasFood.associate = (models) => {
    // MealHasFood.belongsToMany(models.eating_day, {
    //     through: models.eating_day_has_meal_has_food,
    //     onDelete: "cascade",
    //     onUpdate: "cascade"
    // })
    MealHasFood.belongsTo(models.eatingDay_has_meal, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    MealHasFood.belongsTo(models.food, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    // MealHasFood.hasMany(models.eating_day_has_meal_has_food, {
    //     foreignKey: {
    //         allowNull: false
    //     },
    //     onDelete: "cascade",
    //     onUpdate: "cascade"
    // })
  };
  return MealHasFood;
};
