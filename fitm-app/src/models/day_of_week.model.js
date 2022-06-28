module.exports = (sequelizeConn, DataTypes) => {
    const DayOfWeek = sequelizeConn.define("day_of_week", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false

        }
    }, {
        freezeTableName: true,
        timestamps: false
    })

    DayOfWeek.associate = (models) => {
        DayOfWeek.hasMany(models.eating_day, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
    };
    return DayOfWeek
}