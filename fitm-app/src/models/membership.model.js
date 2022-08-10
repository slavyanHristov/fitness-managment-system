module.exports = (sequelizeConn, DataTypes) => {
  const Membership = sequelizeConn.define(
    "membership",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "cancelled", "expired"),
        defaultValue: "active",
      },
      fee: {
        type: DataTypes.FLOAT(6),
        allowNull: false,
        validate: {
          isDecimal: true,
        },
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  Membership.createMembership = async (gym, clientId, membership_type) => {
    let startDate = new Date();
    let endDate = new Date();
    let membershipFee = gym.monthly_cost;
    //TODO: I dont need to pass the whole client object here, just req.clientId is enough
    switch (membership_type) {
      case 1:
        membershipFee *= 0.1;
        endDate.setSeconds(endDate.getSeconds() + 30 * 60);
        // endDate.setHours(endDate.getHours() + 24);
        break;
      case 2:
        // endDate.setMonth(endDate.getMonth() + 1);
        endDate.setSeconds(endDate.getSeconds() + 250);
        break;
      case 3:
        membershipFee *= 11;
        // endDate.setFullYear(endDate.getFullYear() + 1);
        endDate.setSeconds(endDate.getSeconds() + 260);

        break;
      default:
        throw new Error("Non existent membership type!");
    }
    const [membership, created] = await Membership.findOrCreate({
      where: {
        clientId: clientId,
      },
      defaults: {
        start_date: startDate,
        end_date: endDate,
        status: 1,
        fee: membershipFee,
        clientId: clientId,
        gymId: gym.id,
        membershipTypeId: membership_type,
      },
    });
    if (!created) {
      membership.start_date = startDate;
      membership.end_date = endDate;
      membership.status = 1;
      membership.fee = membershipFee;
      membership.gymId = gym.id;
      membership.membershipTypeId = membership_type;
      await membership.save();
    }

    // const membership = await Membership.create({
    //   start_date: startDate,
    //   end_date: endDate,
    //   status: 1,
    //   fee: membershipFee,
    //   clientId: clientId,
    //   gymId: gym.id,
    //   membershipTypeId: membership_type,
    // });
    return membership;
  };

  Membership.renewMembership = async (gym, clientId, membership_type) => {
    let startDate = new Date();
    let endDate = new Date();
    let membershipFee = gym.monthly_cost;
    //TODO: I dont need to pass the whole client object here, just req.clientId is enough
    switch (membership_type) {
      case 1:
        membershipFee *= 0.1;
        endDate.setSeconds(endDate.getSeconds() + 120);
        // endDate.setHours(endDate.getHours() + 24);
        break;
      case 2:
        // endDate.setMonth(endDate.getMonth() + 1);
        endDate.setSeconds(endDate.getSeconds() + 130);
        break;
      case 3:
        membershipFee *= 11;
        // endDate.setFullYear(endDate.getFullYear() + 1);
        endDate.setSeconds(endDate.getSeconds() + 140);

        break;
      default:
        throw new Error("Non existent membership type!");
    }
    const membership = await Membership.findOne({
      where: {
        clientId: clientId,
      },
    });
    membership.start_date = startDate;
    membership.end_date = endDate;
    membership.status = 1;
    membership.gymId = gym.id;
    membership.fee = membershipFee;
    membership.membershipTypeId = membership_type;
    await membership.save();

    return membership;
  };

  Membership.verifyValidity = async (clientId) => {
    const validMembership = await Membership.findOne({
      where: {
        //TODO: Again I don't need to pass whole client object, just req.clientId is enough probably
        clientId: clientId,
        status: "active",
      },
    });

    return validMembership;
  };

  Membership.verifyEndDate = (membership) => {
    return membership.end_date.getTime() < new Date().getTime();
  };

  Membership.setToExpired = async (membership) => {
    membership.status = "expired";
    await membership.save().catch(() => {
      throw new Error("Something went wrong with Membership update!");
    });
    return;
  };

  Membership.associate = (models) => {
    Membership.belongsTo(models.client, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Membership.belongsTo(models.membership_type, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Membership.belongsTo(models.gym, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return Membership;
};
