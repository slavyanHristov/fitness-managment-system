module.exports = (sequelizeConn, DataTypes) => {
    const NotificationRecipient = sequelizeConn.define("notification_recipient", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        is_read: {
            type: DataTypes.ENUM("true", "false")
        }
    }, {
        freezeTableName: true
    })

    NotificationRecipient.associate = (models) => {
        NotificationRecipient.belongsTo(models.user, {onDelete: "cascade", onUpdate: "cascade"})
        NotificationRecipient.belongsTo(models.notification, {onDelete: "cascade", onUpdate: "cascade"})
    };
    return NotificationRecipient
}
