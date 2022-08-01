const regularExpressions = {
  fullName: {
    regex: /^[A-Z][a-zA-Z]{2,}(?: [A-Z][a-zA-Z]*){0,2}$/,
    msg: "Your name isn't in correct format!",
  },
  name: {
    regex: /^[A-Z][a-zA-Z]{2,}$/,
    msg: "Your name isn't in correct format!",
  },
  gymName: {
    regex: /^[A-Za-z\s,._+()*'&-]{2,}$/,
    msg: "Gym name is not in correct format!",
  },
  username: {
    regex: /^[A-Za-z]+(?:[ _-]*[A-Za-z0-9]+)$/,
    msg: "Username must start with letter and can have only '-, _' as special characters!",
  },
  password: {
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?_&])[A-Za-z\d@$!%*?_&]*/,
    msg: "Must have at least one uppercase, one lowercase, number and a special character!",
  },
  age: {
    regex: /^(1[6-9]|[2-9]\d)$/,
    msg: "Your age must be between 16 and 99!",
  },
  phone: {
    regex: /^\d{10}$/,
    msg: "Invalid phone number!",
  },
  sleep_time: {
    regex: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
    msg: "Enter hours, minutes, seconds",
  },
  hours_mins_secs: {
    regex: /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/,
    msg: "Entered time is not in a correct format!",
  },
  salary: {
    regex: /^\d{3,4}(?:\.\d{0,2})?$/,
    msg: "Salary is not valid(should be between 3 and 6 digit length)",
  },
};

module.exports = regularExpressions;
