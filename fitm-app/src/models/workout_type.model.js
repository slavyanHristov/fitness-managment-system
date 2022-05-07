module.exports = (sequelizeConn, DataTypes) => {
    const WorkoutType = sequelizeConn.define("workout_type", {
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

    WorkoutType.associate = (models) => {
        WorkoutType.hasMany(models.workout, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        
      };
    return WorkoutType
}
