const db = require("../models");
const { getValidationErrors } = require("../utils");

const User = db.user;
const UserType = db.user_type;
const Country = db.country;
const Manager = db.manager;
const Gym = db.gym;
const Employee = db.employee;
const Image = db.image;
const FitnessInstructor = db.fitness_instructor;
const Op = db.Sequelize.Op;

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
// -------------- Create User --------------

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

// -------------- Create Admin --------------

exports.createAdmin = async (req, res) => {
  const { name, username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!",
    });
  }
  try {
    let newAdmin = await createUser(name, username, password, email, 1);
    console.log(newAdmin);
    return res.status(201).json({
      succes: true,
      message: "Successfully registered an admin!",
      newAdmin,
    });
  } catch (err) {
    if (err instanceof db.Sequelize.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Incorrect input!",
        errors: getValidationErrors(err.errors),
      });
    }
    return res.status(500).json({
      succes: false,
      message: err.message,
    });
  }
};

// -------------- Create Manager --------------

exports.registerManager = async (req, res) => {
  const { name, username, password, email, phone, salary } = req.body;

  if (!username || !password || !email || !name || !salary) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!",
    });
  }

  const t = await db.sequelize.transaction();
  try {
    let newUser = await createUser(
      name,
      username,
      password,
      email,
      2,
      t,
      false
    );
    let newManager = await Manager.create(
      { userId: newUser.id, salary: salary, phone: phone },
      {
        transaction: t,
      }
    );
    // let newManager = await newUser.createManager({
    //   transaction: t,
    // });
    await t.commit();
    return res.status(200).json({
      succes: true,
      message: "Successfully registered a manager!",
      newManager: {
        ...newManager.toJSON(),
        ...newUser.toJSON(),
      },
    });
  } catch (err) {
    await t.rollback();
    if (err instanceof db.Sequelize.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Incorrect input!",
        errors: getValidationErrors(err.errors),
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Create Address --------------

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

// -------------- Create Client --------------

exports.registerClient = async (req, res) => {
  const {
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
    phone,
    // Instructor,
    // meal_plan,
    // routine
  } = req.body;

  if (
    !username ||
    !password ||
    !email ||
    !name ||
    !age ||
    !height ||
    !weight ||
    !sex ||
    !activityLevel ||
    !fitnessGoal ||
    !fitnessLevel ||
    !country ||
    !city ||
    !address ||
    !phone
  ) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!",
    });
  }

  const t = await db.sequelize.transaction();
  try {
    let newUser = await createUser(name, username, password, email, 4, t);

    clientAddress = await createAddress(country, city, address, t);
    let calories = calcCalories(
      weight,
      height,
      age,
      sex,
      activityLevel,
      fitnessGoal
    );

    const client = await newUser.createClient(
      {
        age,
        height,
        weight,
        sex,
        phone,
        fitness_goal: fitnessGoal,
        fitnessLevel: fitnessLevel,
        activityLevel: activityLevel,
        calories: calories,
        addressId: clientAddress.id,
      },
      {
        transaction: t,
      }
    );
    console.log("fitnessGoal: ", fitnessGoal);
    console.log("activityLevel: ", activityLevel);
    console.log("sex: ", sex);
    await t.commit();
    return res.status(200).json({
      succes: true,
      message: "Successfully registered a client!",
      client: client,
    });
  } catch (err) {
    await t.rollback();
    if (err instanceof db.Sequelize.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Incorrect input!",
        errors: getValidationErrors(err.errors),
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Create Gym --------------

exports.createGym = async (req, res) => {
  const {
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
  } = req.body;

  if (
    !gymName ||
    !openAt ||
    !closedAt ||
    !monthlyCost ||
    !country ||
    !city ||
    !address
  ) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!",
    });
  }
  try {
    console.log(req.files);
    const t = await db.sequelize.transaction();
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
    if (req.files === undefined) {
      return res.status(400).json({
        succes: false,
        message: "File must be selected!",
      });
    }
    console.log(req.files);
    const images = req.files;
    for (const img of images) {
      const image = await Image.create(
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

      // if (image) {
      //   const gymImage = await GymImage.create(
      //     {
      //       gymId: gym.id,
      //       imageId: image.id,
      //     },
      //     {
      //       transaction: t,
      //     }
      //   );
      // }
    }
    await t.commit();
    return res.json({
      success: true,
      message: "Successfully created a gym!",
      gym,
    });
  } catch (err) {
    if (err instanceof db.Sequelize.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Incorrect input!",
        errors: getValidationErrors(err.errors),
      });
    }
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Create Employee --------------
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

// -------------- Create Fitness Instructor --------------

exports.registerInstuctor = async (req, res) => {
  const {
    username,
    password,
    email,
    name,
    salary,
    shift_start,
    shift_end,
    phone,
    gymId,
  } = req.body;

  const t = await db.sequelize.transaction();
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
    return res.json({
      success: true,
      message: "Successfully created instructor!",
      fitness_instructor: newEmployee,
    });
  } catch (err) {
    await t.rollback();
    if (err instanceof db.Sequelize.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Incorrect input!",
        errors: getValidationErrors(err.errors),
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.registerEmployee = async (req, res) => {
  const { name, salary, position, shift_start, shift_end, phone, gymId } =
    req.body;

  if (
    !name ||
    !salary ||
    !position ||
    !shift_start ||
    !shift_end ||
    !phone ||
    !gymId
  ) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!",
    });
  }

  const t = await db.sequelize.transaction();
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
    return res.json({
      success: true,
      message: "Successfully created an employee!",
      employee: newEmployee,
    });
  } catch (err) {
    await t.rollback();
    if (err instanceof db.Sequelize.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Incorrect input!",
        errors: getValidationErrors(err.errors),
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
