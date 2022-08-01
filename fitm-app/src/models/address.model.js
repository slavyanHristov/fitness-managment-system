module.exports = (sequelizeConn, DataTypes) => {
  const Address = sequelizeConn.define(
    "address",
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

  Address.associate = (models) => {
    Address.hasMany(models.client, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Address.hasMany(models.gym, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Address.belongsTo(models.city, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return Address;
};
