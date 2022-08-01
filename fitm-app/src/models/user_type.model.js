module.exports = (sequelizeConn, DataTypes) => {
    const UserType = sequelizeConn.define("user_type", {
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

    UserType.associate = (models) => {
        UserType.hasMany(models.user, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
    };
    return UserType
}