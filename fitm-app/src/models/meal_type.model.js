module.exports = (sequelizeConn, DataTypes) => {
  const MealType = sequelizeConn.define(
    "meal_type",
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

  MealType.findMeal = async (mealId) => {
    const foundMeal = await MealType.findOne({
      where: {
        id: mealId,
      },
    });
    return foundMeal;
  };

  MealType.associate = (models) => {
    MealType.belongsToMany(models.eating_day, {
      through: models.meal,
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    MealType.hasMany(models.meal, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };

  return MealType;
};
