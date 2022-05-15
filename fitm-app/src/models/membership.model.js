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
        },
        fee: {
            type: DataTypes.FLOAT(6),
            allowNull: false,
            validate: {
                isDecimal: true
            }
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    })

    Membership.createMembership = async (gym, client, membership_type) => {
        let startDate = new Date()
        let endDate = new Date()
        let membershipFee = gym.monthly_cost

        switch (membership_type) {
            case 1:
                membershipFee *= 0.1
                endDate.setHours(endDate.getHours() + 24)
                break;
            case 2:
                endDate.setMonth(endDate.getMonth() + 1)
                break;
            case 3:
                membershipFee *= 11
                endDate.setFullYear(endDate.getFullYear() + 1)
                break;
            default:
                throw new Error('Non existent membership type!')
        }

        const membership = await Membership.create({
            start_date: startDate,
            end_date: endDate,
            status: 1,
            fee: membershipFee,
            clientId: client.id,
            gymId: gym.id,
            membershipTypeId: membership_type
        })
        return membership
    }

    Membership.verifyValidity = async (client) => {
        const validMembership = await Membership.findOne({
            where: {
                clientId: client.id,
                status: "active"

            }
        })

        return validMembership
    }

    Membership.verifyEndDate = (membership) => {
        return membership.end_date.getTime() < new Date().getTime()
    }

    Membership.associate = (models) => {
        Membership.belongsTo(models.client, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Membership.belongsTo(models.membership_type, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        Membership.belongsTo(models.gym, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
    };
    return Membership
}