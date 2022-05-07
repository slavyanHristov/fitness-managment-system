module.exports = (sequelizeConn, DataTypes) => {
    const Meal = sequelizeConn.define("meal", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false

        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        freezeTableName: true
    })

    Meal.associate = (models) => {
        // TODO: Many-To-Many with Food
      };
    return Meal
}
