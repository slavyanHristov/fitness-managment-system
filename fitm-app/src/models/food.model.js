module.exports = (sequelizeConn, DataTypes) => {
  const Food = sequelizeConn.define(
    "food",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      total_calories: {
        type: DataTypes.FLOAT(11),
        allowNull: false,
      },
      total_protein: {
        type: DataTypes.FLOAT(6),
        allowNull: false,
      },
      total_carbohydrates: {
        type: DataTypes.FLOAT(6),
        allowNull: false,
      },
      total_fats: {
        type: DataTypes.FLOAT(6),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.FLOAT(6),
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  Food.findFood = async (foodId) => {
    const foundFood = await Food.findOne({
      where: {
        id: foodId,
      },
    });
    return foundFood;
  };

  Food.associate = (models) => {
    Food.belongsTo(models.food_info, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Food.belongsToMany(models.meal, {
      through: models.meal_has_food,
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    Food.hasMany(models.meal_has_food, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return Food;
};
