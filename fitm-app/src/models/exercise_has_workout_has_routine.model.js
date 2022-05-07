module.exports = (sequelizeConn, DataTypes) => {
    const ExerciseHasWorkoutHasRoutine = sequelizeConn.define("exercise_workout_routine", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
    }, {
        freezeTableName: true,
        timestamps: false
    })

    ExerciseHasWorkoutHasRoutine.associate = (models) => {
        models.exercise_has_workout.belongsToMany(models.routine, {
            through: ExerciseHasWorkoutHasRoutine,
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        models.routine.belongsToMany(models.exercise_has_workout, {
            through: ExerciseHasWorkoutHasRoutine,
            onDelete: "cascade",
            onUpdate: "cascade"
        })
      };
    return ExerciseHasWorkoutHasRoutine
}
