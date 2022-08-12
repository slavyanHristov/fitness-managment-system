module.exports = (sequelizeConn, DataTypes) => {
  const EatingDay = sequelizeConn.define(
    "eating_day",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  EatingDay.findEatingDay = async (eatingDayId) => {
    const foundEatingDay = await EatingDay.findOne({
      where: {
        id: eatingDayId,
      },
    });
    return foundEatingDay;
  };

  EatingDay.associate = (models) => {
    EatingDay.belongsToMany(models.meal_type, {
      through: models.meal,
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    EatingDay.hasMany(models.meal, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    EatingDay.belongsTo(models.meal_plan, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    EatingDay.belongsTo(models.day_of_week, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return EatingDay;
};
