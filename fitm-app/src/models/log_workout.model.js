module.exports = (sequelizeConn, DataTypes) => {
    const LogWorkout = sequelizeConn.define("log_workout", {
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
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
    }, {
        freezeTableName: true
    })

    LogWorkout.associate = (models) => {
        LogWorkout.belongsTo(models.exercise_has_workout, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        
      };
    return LogWorkout
}
