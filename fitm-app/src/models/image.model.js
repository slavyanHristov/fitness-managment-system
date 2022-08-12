module.exports = (sequelizeConn, DataTypes) => {
  const Image = sequelizeConn.define(
    "image",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      path: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  Image.associate = (models) => {
    Image.belongsTo(models.gym, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Image.hasMany(models.user, {
      onUpdate: "cascade",
    });
    Image.hasMany(models.exercise, {
      onUpdate: "cascade",
    });
    Image.hasMany(models.food_info, {
      onUpdate: "cascade",
    });
  };
  return Image;
};
