module.exports = (sequelizeConn, DataTypes) => {
    const FoodType = sequelizeConn.define("food_type", {
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

    FoodType.associate = (models) => {
        FoodType.hasMany(models.food, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
      };
    return FoodType
}
