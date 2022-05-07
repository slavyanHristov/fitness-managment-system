module.exports = (sequelizeConn, DataTypes) => {
    const ExerciseHasWorkout = sequelizeConn.define("exercise_has_workout", {
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

    ExerciseHasWorkout.associate = (models) => {
        // TODO: !!!!!!!
        models.exercise.belongsToMany(models.workout, {
            through: ExerciseHasWorkout,
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        models.workout.belongsToMany(models.exercise, {
            through: ExerciseHasWorkout,
            onDelete: "cascade",
            onUpdate: "cascade"
        })
      };
    return ExerciseHasWorkout
}
