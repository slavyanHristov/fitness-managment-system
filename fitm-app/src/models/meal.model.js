module.exports = (sequelizeConn, DataTypes) => {
  const Meal = sequelizeConn.define(
    "meal",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  Meal.findMeal = async (mealId) => {
    const foundMeal = await Meal.findOne({
      where: {
        id: mealId,
      },
    });
    return foundMeal;
  };

  Meal.associate = (models) => {
    Meal.belongsToMany(models.eating_day, {
      through: models.eatingDay_has_meal,
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Meal.hasMany(models.eatingDay_has_meal, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };

  return Meal;
};
