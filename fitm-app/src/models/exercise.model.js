module.exports = (sequelizeConn, DataTypes) => {
    const Exercise = sequelizeConn.define("exercise", {
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
        freezeTableName: true,
        timestamps: false
    })

    Exercise.associate = (models) => {
        Exercise.belongsTo(models.muscle_group, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Exercise.belongsTo(models.exercise_type, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Exercise.belongsToMany(models.workout, {
            through: models.exercise_has_workout,
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Exercise.hasMany(models.exercise_has_workout, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })

    };
    return Exercise
}