const db = require("../models")
const User = db.user
const Country = db.country
const Manager = db.manager
const Employee = db.employee

// -------------- Create User --------------

const createUser = async (username, password, email, userTypeId, t = null) => {
  return await User.create({
    username: username,
    password: password,
    email: email,
    userTypeId: userTypeId
  }, {
    transaction: t
  })
}

// -------------- Create Admin --------------

exports.createAdmin = async (req, res) => {
  const {
    username,
    password,
    email
  } = req.body;

  if (!username || !password || !email) {
    return res.status(401).json({
      success: false,
      message: "Empty fields!"
    })
  }
  try {
    let newAdmin = await createUser(username, password, email, 1)
    return res.send(newAdmin);
  } catch (error) {
    res.status(400).send(`Error occured: ${error.message}`);
  }
};

// -------------- Create Manager --------------

exports.registerManager = async (req, res) => {
  const {
    username,
    password,
    email,
    name
  } = req.body;

  if (!username || !password || !email || !name) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!"
    })
  }

  const t = await db.sequelize.transaction();
  try {
    let newUser = await createUser(username, password, email, 2, t)
    await newUser.createManager({
      name
    }, {
      transaction: t
    });
    await t.commit();
    return res.send(newUser);
  } catch (error) {
    await t.rollback();
    return res.status(400).send(`Error occured: ${error.message}`);
  }
};

// -------------- Create Address --------------


const createAddress = async (country, city, address, t) => {
  let newCountry = await Country.create({
    name: country,
  }, {
    transaction: t
  });

  let newCity = await newCountry.createCity({
    name: city,
  }, {
    transaction: t
  });

  return await newCity.createAddress({
    name: address,
  }, {
    transaction: t
  });
};

// -------------- Create Client --------------

exports.registerClient = async (req, res) => {
  const {
    username,
    password,
    email,
    name,
    age,
    height,
    weight,
    fitnessLevel,
    country,
    city,
    address,
    phone,
    sleep_time,
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
    !fitnessLevel ||
    !country ||
    !city ||
    !address
  ) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!"
    })
  }

  const t = await db.sequelize.transaction();
  try {
    let newUser = await createUser(username, password, email, 4, t)

    clientAddress = await createAddress(country, city, address, t);

    await newUser.createClient({
      name,
      age,
      height,
      weight,
      clientFitnessLevelId: fitnessLevel,
      addressId: clientAddress.id,
    }, {
      transaction: t
    });

    t.commit();
    return res.send(newUser);
  } catch (error) {
    await t.rollback();
    return res.status(400).send(`Error occured: ${error.message}`);
  }
};

// -------------- Create Gym --------------


exports.createGym = async (req, res) => {
  const {
    name,
    openAt,
    closedAt,
    monthly_cost,
    country,
    city,
    address,
    managerId
  } = req.body

  if (!name || !openAt || !closedAt || !monthly_cost || !country || !city || !address) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!"
    })
  }
  const t = await db.sequelize.transaction()
  try {
    const manager = await Manager.findOne({
      where: {
        id: managerId
      }
    }, {
      transaction: t
    })
    const gymAddress = await createAddress(country, city, address, t)
    const gym = await manager.createGym({
      name,
      open_at: openAt,
      closed_at: closedAt,
      monthly_cost: monthly_cost,
      addressId: gymAddress.id
    }, {
      transaction: t
    })

    t.commit();
    return res.json({
      success: true,
      message: "Successfully created a gym!",
      gym
    })
  } catch (err) {
    await t.rollback()
    return res.status(400).send(`Error occured: ${err.message}`);
  }

}

// -------------- Create Employee --------------

const createEmployee = async (firstName, lastName, position, salary, phone, addressId, gymId, managerId, t) => {
  return await Employee.create({
    firstName,
    lastName,
    position,
    salary,
    phone,
    addressId,
    gymId,
    managerId
  }, {
    transaction: t
  })
}

// -------------- Create Fitness Instructor --------------


exports.registerInstuctor = async (req, res) => {
  const {
    username,
    password,
    email,
    firstName,
    lastName,
    salary,
    phone,
    country,
    city,
    address,
    gymId,
    managerId
  } = req.body

  const t = await db.sequelize.transaction()
  try {
    const employeeAddress = await createAddress(country, city, address, t)
    const newEmployee = await createEmployee(firstName, lastName, "fitness instructor", salary, phone, employeeAddress.id, gymId, managerId, t)
    const newUser = await createUser(username, password, email, 3, t)
    const instructor = await newUser.createFitness_instructor({
      employeeId: newEmployee.id
    }, {
      transaction: t
    })
    t.commit()
    return res.json({
      success: true,
      message: "Successfully created instructor!",
      fitness_instructor: instructor
    })
  } catch (err) {
    t.rollback()
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }
};