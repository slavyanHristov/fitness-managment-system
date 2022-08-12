module.exports = (sequelizeConn, DataTypes) => {
  const FitnessInstructor = sequelizeConn.define(
    "fitness_instructor",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      freezeTableName: true,
    }
  );

  FitnessInstructor.getInstructor = async (id) => {
    const loggedInstructor = await FitnessInstructor.findOne({
      where: {
        id: id,
      },
    });
    return loggedInstructor;
  };

  FitnessInstructor.associate = (models) => {
    FitnessInstructor.hasMany(models.client, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    FitnessInstructor.hasMany(models.routine, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    FitnessInstructor.hasMany(models.meal_plan, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    FitnessInstructor.hasMany(models.employee, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    FitnessInstructor.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return FitnessInstructor;
};
