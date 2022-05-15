module.exports = (sequelizeConn, DataTypes) => {
    const MembershipType = sequelizeConn.define("membership_type", {
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

    MembershipType.associate = (models) => {
        MembershipType.hasMany(models.membership, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
    };
    return MembershipType
}