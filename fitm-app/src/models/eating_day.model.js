module.exports = (sequelizeConn, DataTypes) => {
    const EatingDay = sequelizeConn.define("eating_day", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // date: {  TODO: Should i remove it?
        //     type: DataTypes.DATEONLY,
        //     allowNull: false
        // }
    }, {
        freezeTableName: true,
        timestamps: false
    })

    EatingDay.findEatingDay = async (eatingDayId) => {
        const foundEatingDay = await EatingDay.findOne({
            where: {
                id: eatingDayId
            }
        })
        return foundEatingDay
    }

    EatingDay.associate = (models) => {
        EatingDay.belongsToMany(models.meal_has_food, {
            through: models.eating_day_has_meal_has_food,
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        EatingDay.hasMany(models.eating_day_has_meal_has_food, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        EatingDay.belongsTo(models.meal_plan, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        EatingDay.belongsTo(models.day_of_week, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
    };
    return EatingDay
}