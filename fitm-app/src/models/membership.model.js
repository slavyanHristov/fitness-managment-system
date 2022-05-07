module.exports = (sequelizeConn, DataTypes) => {
    const Membership = sequelizeConn.define("membership", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("active", "cancelled", "expired"),
            defaultValue: "active"
        }
    }, {
        freezeTableName: true,
        timestamp: false,
    })

    Membership.associate = (models) => {
        Membership.belongsTo(models.client, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Membership.belongsTo(models.membership_type, {
            foreignKey: {allowNull:false},
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Membership.belongsTo(models.gym, {
            foreignKey: {allowNull:false},
            onDelete: "cascade",
            onUpdate: "cascade"
        })
      };
    return Membership
}
