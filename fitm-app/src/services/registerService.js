const db = require("../models");

const User = db.user;
const UserType = db.user_type;
const Country = db.country;
const Manager = db.manager;
const Gym = db.gym;
const Employee = db.employee;
const Image = db.image;
const FitnessInstructor = db.fitness_instructor;
const Op = db.Sequelize.Op;
const Client = db.client;

const findOrCreateUserTypes = async (t = null) => {
  const { rows } = await UserType.findAndCountAll();
  console.log(rows);
  if (rows.length === 0) {
    await UserType.bulkCreate(
      [
        {
          name: "Admin",
        },
        {
          name: "Manager",
        },
        {
          name: "Fitness instructor",
        },
        {
          name: "Client",
        },
      ],
      {
        transaction: t,
      }
    );
  }
};

const findOrCreatePfp = async () => {
  return await Image.findOrCreate({
    where: {
      name: {
        [Op.startsWith]: "default",
      },
    },
    defaults: {
      type: "image/png",
      name: "default-profile-pic.png",
      path: "resources/images/default-profile-pic.png",
    },
  });
};

const createUser = async (
  name,
  username,
  password,
  email,
  userTypeId,
  t = null,
  isFinalized = true
) => {
  await findOrCreateUserTypes(t); // if user types do not exists, create them
  let [defaultProfilePicture, isNewlyCreated] = await findOrCreatePfp();
  return await User.create(
    {
      name: name,
      username: username,
      password: password,
      email: email,
      imageId: defaultProfilePicture.id,
      userTypeId: userTypeId,
      isFinalized: isFinalized,
    },
    {
      transaction: t,
    }
  );
};

const registerManager = async (
  name,
  username,
  password,
  email,
  phone,
  salary
) => {
  const t = await db.sequelize.transaction().catch((err) => {
    throw {
      status: 500,
      message: `TRANSACTION ERROR: ${err}`,
    };
  });
  try {
    const newUser = await createUser(
      name,
      username,
      password,
      email,
      2,
      t,
      false
    );
    const newManager = await Manager.create(
      { userId: newUser.id, salary: salary, phone: phone },
      {
        transaction: t,
      }
    );

    await t.commit();
    return {
      newUser,
      newManager,
    };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const createAddress = async (country, city, address, t) => {
  let newCountry = await Country.create(
    {
      name: country,
    },
    {
      transaction: t,
    }
  );

  let newCity = await newCountry.createCity(
    {
      name: city,
    },
    {
      transaction: t,
    }
  );

  return await newCity.createAddress(
    {
      name: address,
    },
    {
      transaction: t,
    }
  );
};

const calcBMR = (weight, height, age, gender) => {
  if (gender === 1) {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
};

const calcCalories = (
  weight,
  height,
  age,
  gender,
  activityLevel,
  fitnessGoal
) => {
  let calories = null;
  switch (activityLevel) {
    case 1:
      calories = calcBMR(weight, height, age, gender);
      break;
    case 2:
      calories = calcBMR(weight, height, age, gender) * 1.375;
      break;
    case 3:
      calories = calcBMR(weight, height, age, gender) * 1.55;
      break;
    default:
      calories = calcBMR(weight, height, age, gender) * 1.725;
      break;
  }

  switch (fitnessGoal) {
    case 1:
      calories += 250;
      break;
    case 2:
      calories -= 250;
      break;
    default:
      break;
  }
  return calories;
};

const registerClient = async (
  name,
  username,
  password,
  email,
  age,
  height,
  weight,
  sex,
  fitnessGoal,
  fitnessLevel,
  activityLevel,
  country,
  city,
  address,
  phone
) => {
  const t = await db.sequelize.transaction().catch((err) => {
    throw {
      status: 500,
      message: `TRANSACTION ERROR: ${err}`,
    };
  });
  try {
    const newUser = await createUser(name, username, password, email, 4, t);

    const clientAddress = await createAddress(country, city, address, t);
    const calories = calcCalories(
      weight,
      height,
      age,
      sex,
      activityLevel,
      fitnessGoal
    );

    const client = await Client.create(
      {
        age: age,
        height: height,
        weight: weight,
        sex: sex,
        phone: phone,
        fitness_goal: fitnessGoal,
        fitness_level: fitnessLevel,
        activity_level: activityLevel,
        calories: calories,
        addressId: clientAddress.id,
        userId: newUser.id,
      },
      {
        transaction: t,
      }
    );

    await t.commit();
    return client;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const registerGym = async (
  gymName,
  monthlyCost,
  size,
  openAt,
  closedAt,
  phone,
  country,
  city,
  address,
  managerId,
  description,
  filesArray
) => {
  const t = await db.sequelize.transaction().catch((err) => {
    throw {
      status: 500,
      message: `TRANSACTION ERROR: ${err}`,
    };
  });
  try {
    const manager = await Manager.findOne(
      {
        where: {
          id: managerId,
        },
      },
      {
        transaction: t,
      }
    );
    const gymAddress = await createAddress(country, city, address, t);
    const gym = await manager.createGym(
      {
        name: gymName,
        monthly_cost: monthlyCost,
        size: size,
        open_at: openAt,
        closed_at: closedAt,
        phone: phone,
        addressId: gymAddress.id,
        description: description,
      },
      {
        transaction: t,
      }
    );

    if (filesArray === undefined) {
      throw {
        status: 400,
        message: "File must be selected!",
      };
    }
    for (const img of filesArray) {
      await Image.create(
        {
          type: img.mimetype,
          name: img.originalname,
          path: `resources/uploads/${img.filename}`,
          gymId: gym.id,
        },
        {
          transaction: t,
        }
      );
    }
    await t.commit();
    return gym;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const createEmployee = async (
  name,
  position,
  shift_start,
  shift_end,
  salary,
  phone,
  gymId,
  managerId,
  t = null,
  fitnessInstructorId = null
) => {
  return await Employee.create(
    {
      name,
      position,
      shift_start,
      shift_end,
      salary,
      phone,
      gymId,
      fitnessInstructorId,
      managerId,
    },
    {
      transaction: t,
    }
  );
};

const registerInstuctor = async (
  username,
  password,
  email,
  name,
  salary,
  shift_start,
  shift_end,
  phone,
  gymId
) => {
  const t = await db.sequelize.transaction().catch((err) => {
    throw {
      status: 500,
      message: `TRANSACTION ERROR: ${err}`,
    };
  });
  try {
    const gym = await Gym.findOne({
      attributes: ["id", "managerId"],
      where: {
        id: gymId,
      },
    });
    console.log("Manager Id:", gym);
    const newUser = await createUser(
      name,
      username,
      password,
      email,
      3,
      t,
      false
    );
    const instructor = await FitnessInstructor.create(
      {
        userId: newUser.id,
      },
      { transaction: t }
    );
    const newEmployee = await createEmployee(
      name,
      "fitness instructor",
      shift_start,
      shift_end,
      salary,
      phone,
      gymId,
      gym.managerId,
      t,
      instructor.id
    );
    await t.commit();
    return newEmployee;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const registerEmployee = async (
  name,
  salary,
  position,
  shift_start,
  shift_end,
  phone,
  gymId
) => {
  const t = await db.sequelize.transaction().catch((err) => {
    throw {
      status: 500,
      message: `TRANSACTION ERROR: ${err}`,
    };
  });
  try {
    const gym = await Gym.findOne({
      attributes: ["id", "managerId"],
      where: {
        id: gymId,
      },
    });
    const newEmployee = await createEmployee(
      name,
      position,
      shift_start,
      shift_end,
      salary,
      phone,
      gymId,
      gym.managerId,
      t
    );
    await t.commit();
    return newEmployee;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
module.exports = {
  createUser,
  registerManager,
  registerClient,
  registerGym,
  registerInstuctor,
  registerEmployee,
};
