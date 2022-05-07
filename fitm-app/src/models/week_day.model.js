module.exports = (sequelizeConn, DataTypes) => {
    const WeekDay = sequelizeConn.define("week_day", {
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

    WeekDay.associate = (models) => {
        WeekDay.hasMany(models.workout, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        
      };
    return WeekDay
}
