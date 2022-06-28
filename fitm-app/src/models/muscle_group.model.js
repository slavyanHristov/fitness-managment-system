module.exports = (sequelizeConn, DataTypes) => {
    const MuscleGroup = sequelizeConn.define("muscle_group", {
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

    MuscleGroup.associate = (models) => {
        MuscleGroup.hasMany(models.exercise, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })

    };
    return MuscleGroup
}