module.exports = (sequelizeConn, DataTypes) => {
    const LogExercise = sequelizeConn.define("log_exercise", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        setNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reps: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        weight: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        freezeTableName: true
    })

    LogExercise.associate = (models) => {
        // LogExercise.belongsTo(models.exercise_has_workout, { TODO: Not sure about this
        //     onDelete: "cascade",
        //     onUpdate: "cascade"
        // })
        LogExercise.belongsTo(models.exercise_workout_routine, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })

        LogExercise.belongsTo(models.routine, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })


    };
    return LogExercise
}