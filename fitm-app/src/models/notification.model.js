module.exports = (sequelizeConn, DataTypes) => {
    const Notification = sequelizeConn.define("notification", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
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

    Notification.associate = (models) => {
        Notification.hasMany(models.notification_recipient, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Notification.belongsTo(models.user, {onDelete: "cascade", onUpdate: "cascade"})
      };
    return Notification
}
