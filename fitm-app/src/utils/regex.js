const regularExpressions = {
    name: {
        regex: /^[A-Z][a-zA-Z]{2,}(?: [A-Z][a-zA-Z]*){0,2}$/,
        msg: "Your name isn't in correct format!"
    },
    username: {
        regex: /^[A-Za-z]+(?:[ _-]*[A-Za-z0-9]+)*$/,
        msg: "Username is not in correct format!"
    },
    password: {
        regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?_&])[A-Za-z\d@$!%*?_&]{6,}/,
        msg: "Minimum 6 characters, at least one uppercase, lowercase, number and a special character"
    },
    age: {
        regex: /^(1[6-9]|[2-9]\d)$/,
        msg: "Your age must be between 16 and 99!"
    },
    phone: {
        regex: /^\d{10}$/,
        msg: "Invalid phone number!"
    },
    sleep_time: {
        regex: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
        msg: "Enter hours, minutes, seconds"
    }
}

module.exports = regularExpressions