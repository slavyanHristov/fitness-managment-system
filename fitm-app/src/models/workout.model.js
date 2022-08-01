module.exports = (sequelizeConn, DataTypes) => {
  const Workout = sequelizeConn.define(
    "workout",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  Workout.associate = (models) => {
    Workout.hasMany(models.exercise_has_workout, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Workout.belongsToMany(models.exercise, {
      through: models.exercise_has_workout,
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Workout.belongsTo(models.day_of_week, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Workout.belongsTo(models.workout_type, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Workout.belongsTo(models.routine, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return Workout;
};
