const db = require("../models");
const Membership = db.membership;

const createMembership = async (gym, clientId, membership_type) => {
  try {
    let startDate = new Date();
    let endDate = new Date();
    let membershipFee = gym.monthly_cost;
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
    return membership;
  } catch (err) {
    throw err;
  }
};

const verifyValidity = async (clientId) => {
  try {
    const validMembership = await Membership.findOne({
      where: { clientId: clientId, status: "active" },
    });
    return validMembership;
  } catch (err) {
    throw err;
  }
};

const verifyEndDate = (membership) => {
  return membership.end_date.getTime() < new Date().getTime();
};

const setToExpired = async (membership) => {
  membership.status = "expired";
  await membership.save().catch(() => {
    throw new Error("Something went wrong with Membership update!");
  });
  return;
};

module.exports = {
  createMembership,
  verifyValidity,
  verifyEndDate,
  setToExpired,
};
