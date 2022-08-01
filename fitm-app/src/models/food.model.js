module.exports = (sequelizeConn, DataTypes) => {
  const Food = sequelizeConn.define(
    "food",
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
      calories: {
        type: DataTypes.FLOAT(11),
        allowNull: false,
      },
      protein: {
        type: DataTypes.FLOAT(6),
        allowNull: false,
      },
      carbohydrates: {
        type: DataTypes.FLOAT(6),
        allowNull: false,
      },
      fats: {
        type: DataTypes.FLOAT(6),
        allowNull: false,
      },
      //TODO: Separate Table?
      quantity: {
        type: DataTypes.FLOAT(6),
        allowNull: false,
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
    Food.belongsTo(models.food_type, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Food.belongsToMany(models.eatingDay_has_meal, {
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
    Food.belongsTo(models.image, {
      onDelete: "cascade",
    });
  };
  return Food;
};
