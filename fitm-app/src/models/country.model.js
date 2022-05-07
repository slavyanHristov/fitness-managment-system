module.exports = (sequelizeConn, DataTypes) => {
    const Country = sequelizeConn.define("country", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(45)
        }
    }, {
        freezeTableName: true,
        timestamps: false
    })

    Country.associate = (models) => {
        Country.hasMany(models.city, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"

        });
      };
    return Country
}
