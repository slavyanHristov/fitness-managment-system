const {
    hashOperations,
    regularExpressions
} = require('../utils')

module.exports = (sequelizeConn, DataTypes) => {
    const User = sequelizeConn.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: {
                args: true,
                msg: 'User already exists!'
            },
            validate: {
                is: {
                    args: regularExpressions.username.regex,
                    msg: regularExpressions.username.msg
                },
                minLength(value) {
                    const minCharLength = 4;
                    if (value.length < minCharLength) {
                        throw new Error(`Username is too short! Minimum ${minCharLength} characters required.`)
                    }
                },
                maxLength(value) {
                    const maxCharLength = 20
                    if (value.length > maxCharLength) {
                        throw new Error(`Username is too long! Maximum length of ${maxCharLength} characters exceeded.`)
                    }
                }
            }
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: {
                args: true,
                msg: 'User already exists!'
            },
            validate: {
                isEmail: {
                    msg: 'Not a valid email!'
                }
            }
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                is: {
                    args: regularExpressions.password.regex,
                    msg: regularExpressions.password.msg
                },
                minLength(value) {
                    const minCharLength = 8
                    if (value.length < minCharLength) {
                        throw new Error(`Password is too short! Minimum ${minCharLength} characters required.`)
                    }
                },
                maxLength(value) {
                    const maxCharLength = 100
                    if (value.length >= maxCharLength) {
                        throw new Error(`Password is too long! Maximum length of ${maxCharLength} characters exceeded.`)
                    }
                }
            }
        }
    }, {
        freezeTableName: true,

    })

    User.beforeCreate(async (user, options) => {
        const hashedPassword = await hashOperations.hashSecret(user.password)
        user.password = hashedPassword;
    });

    User.beforeUpdate(async (user, options) => {
        if (user.password) {
            const hashedPassword = await hashOperations.hashSecret(user.password)
            user.password = hashedPassword;
        }
    })

    User.associate = (models) => {
        User.hasOne(models.refreshToken, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })

        User.hasOne(models.reset_password_token, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })

        User.hasMany(models.manager, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade",

        })
        User.hasMany(models.client, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade",

        })
        User.hasMany(models.notification, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        User.hasMany(models.fitness_instructor, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade",

        })
        User.hasMany(models.notification_recipient, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
        User.belongsTo(models.user_type, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        })
    };
    return User
}