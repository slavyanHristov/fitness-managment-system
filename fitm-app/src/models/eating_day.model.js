module.exports = (sequelizeConn, DataTypes) => {
    const EatingDay = sequelizeConn.define("eating_day", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        day: {
            type: DataTypes.STRING(45),
            allowNull: false

        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false
    })

    EatingDay.associate = (models) => {
        EatingDay.belongsTo(models.meal_plan, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
      };
    return EatingDay
}
