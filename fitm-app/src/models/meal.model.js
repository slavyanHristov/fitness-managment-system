module.exports = (sequelizeConn, DataTypes) => {
  const Meal = sequelizeConn.define(
    "meal",
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
      timestamps: false,
    }
  );

  Meal.associate = (models) => {
    Meal.belongsTo(models.eating_day, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Meal.belongsTo(models.meal_type, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Meal.belongsToMany(models.food, {
      through: models.meal_has_food,
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Meal.hasMany(models.meal_has_food, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return Meal;
};
