module.exports = (sequelizeConn, DataTypes) => {
    const ClientFitnessLevel = sequelizeConn.define("client_fitness_level", {
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
        }
    }, {
        freezeTableName: true,
        timestamps: false
    })

    ClientFitnessLevel.associate = (models) => {
        ClientFitnessLevel.hasMany(models.client, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade",
        })
      };
    return ClientFitnessLevel
}
