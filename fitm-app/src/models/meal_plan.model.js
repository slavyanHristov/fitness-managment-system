module.exports = (sequelizeConn, DataTypes) => {
  const MealPlan = sequelizeConn.define(
    "meal_plan",
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
    }
  );

  MealPlan.getMealPlan = async (mealPlanId, instructor) => {
    const mealPlan = await MealPlan.findOne({
      where: {
        id: mealPlanId,
        fitnessInstructorId: instructor.id,
      },
    });

    return mealPlan;
  };

  MealPlan.associate = (models) => {
    MealPlan.hasMany(models.client, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    MealPlan.belongsTo(models.fitness_instructor, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    MealPlan.hasMany(models.eating_day, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    MealPlan.belongsToMany(models.day_of_week, {
      through: models.eating_day,
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return MealPlan;
};
