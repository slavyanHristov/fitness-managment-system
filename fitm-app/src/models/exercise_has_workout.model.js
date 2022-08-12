module.exports = (sequelizeConn, DataTypes) => {
  const ExerciseHasWorkout = sequelizeConn.define(
    "exercise_has_workout",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sets: {
        type: DataTypes.INTEGER,
      },
      reps: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  ExerciseHasWorkout.associate = (models) => {
    ExerciseHasWorkout.belongsTo(models.exercise, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    ExerciseHasWorkout.belongsTo(models.workout, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return ExerciseHasWorkout;
};
