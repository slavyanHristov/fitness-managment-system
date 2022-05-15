module.exports = (sequelizeConn, DataTypes) => {
  const City = sequelizeConn.define(
    "city",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(45),
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  City.associate = (models) => {
    City.hasMany(models.address, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    City.belongsTo(models.country, {
      foreignKey: { allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return City;
};
