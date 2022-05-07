const {passwordHash, regularExpressions} = require('../utils')

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
                len: {
                    args: [4, 32],
                    msg: "Username length is not in required range!"
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
                len: {
                    args: [6,100],
                    msg: "Password is not in the required range!"
                }
            }
        }
    }, {
        freezeTableName: true
    })

    // User.isManager = async (username, userTypeId) => {
    //     return await User.findOne({
    //         where: {
    //             [Op.and]: [
    //                 {username: username},
    //                 {userTypeId: userTypeId}
    //             ]
    //         }
    //     })
    // }

    User.beforeCreate(async (user, options) => {
        const hashedPassword = await passwordHash.hashPassword(user.password)
        user.password = hashedPassword;
      });

    User.associate = (models) => {
        User.hasOne(models.refreshToken, {
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
