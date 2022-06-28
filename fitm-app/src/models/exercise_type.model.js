module.exports = (sequelizeConn, DataTypes) => {
    const ExerciseType = sequelizeConn.define("exercise_type", {
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

    ExerciseType.associate = (models) => {
        ExerciseType.hasMany(models.exercise, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })

    };
    return ExerciseType
}