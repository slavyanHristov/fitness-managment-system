module.exports = (sequelizeConn, DataTypes) => {
    const ExerciseWorkoutRoutine = sequelizeConn.define("exercise_workout_routine", {
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

    ExerciseWorkoutRoutine.associate = (models) => {
        ExerciseWorkoutRoutine.belongsTo(models.routine, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        ExerciseWorkoutRoutine.belongsTo(models.exercise_has_workout, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        ExerciseWorkoutRoutine.hasMany(models.log_exercise, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
    };
    return ExerciseWorkoutRoutine
}