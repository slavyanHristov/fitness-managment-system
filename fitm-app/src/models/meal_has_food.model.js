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
    MealHasFood.belongsTo(models.meal, {
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
  };
  return MealHasFood;
};
