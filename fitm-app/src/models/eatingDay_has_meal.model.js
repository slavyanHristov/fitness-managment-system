module.exports = (sequelizeConn, DataTypes) => {
  const EatingDayHasMeal = sequelizeConn.define(
    "eatingDay_has_meal",
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

  EatingDayHasMeal.associate = (models) => {
    EatingDayHasMeal.belongsTo(models.eating_day, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    EatingDayHasMeal.belongsTo(models.meal, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    EatingDayHasMeal.belongsToMany(models.food, {
      through: models.meal_has_food,
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    EatingDayHasMeal.hasMany(models.meal_has_food, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return EatingDayHasMeal;
};
