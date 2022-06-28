module.exports = (sequelizeConn, DataTypes) => {
    const Routine = sequelizeConn.define("routine", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        }
    }, {
        freezeTableName: true
    })

    Routine.associate = (models) => {
        Routine.belongsToMany(models.exercise_has_workout, {
            through: models.exercise_workout_routine,
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Routine.hasMany(models.exercise_workout_routine, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Routine.hasMany(models.client, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Routine.hasMany(models.workout, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Routine.hasMany(models.log_exercise, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })

        Routine.belongsTo(models.fitness_instructor, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })

    };
    return Routine
}