module.exports = (sequelizeConn, DataTypes) => {
  const FoodInfo = sequelizeConn.define(
    "food_info",
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
      grams: {
        type: DataTypes.FLOAT(6),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  FoodInfo.findFood = async (foodId) => {
    const foundFood = await FoodInfo.findOne({
      where: {
        id: foodId,
      },
    });
    return foundFood;
  };

  FoodInfo.associate = (models) => {
    FoodInfo.belongsTo(models.food_type, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    FoodInfo.hasMany(models.food, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    FoodInfo.belongsTo(models.image, {
      onDelete: "cascade",
    });
  };
  return FoodInfo;
};
