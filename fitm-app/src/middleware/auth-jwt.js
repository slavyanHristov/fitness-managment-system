const jwt = require("jsonwebtoken");
const { Op } = require('sequelize')
const { JWT_SECRET } = require("../../config/config");
const db = require("../models");
const User = db.user;

const {TokenExpiredError} = jwt

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized! Access Token has expired!"
    })
  }
  return res.status(401).json({
    success: false,
    message: "Unauthorized!"
  })
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).json({
      success: false,
      message: "No token has been provided!"
    })
    
    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
      if (err) {
        return catchError(err, res)
      }
      req.username = decodedUser.username; 

      next();
  });

};

isAdmin = async (req, res, next) => {
    const admin = await User.findOne({
        where: {
            [Op.and]: [
                {username: req.username},
                {userTypeId: 1}
            ]
        }
    })
    if(!admin) {
        return res.status(403).json({
          success: false,
          message: "Admin Unauthorized!"
        })
    }else {
        console.log(admin);
        return next()
    }
};
// isModerator = (req, res, next) => {
//   User.findByPk(req.userId).then(user => {
//     user.getRoles().then(roles => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === "moderator") {
//           next();
//           return;
//         }
//       }
//       res.status(403).send({
//         message: "Require Moderator Role!"
//       });
//     });
//   });
// };
// isModeratorOrAdmin = (req, res, next) => {
//   User.findByPk(req.userId).then(user => {
//     user.getRoles().then(roles => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === "moderator") {
//           next();
//           return;
//         }
//         if (roles[i].name === "admin") {
//           next();
//           return;
//         }
//       }
//       res.status(403).send({
//         message: "Require Moderator or Admin Role!"
//       });
//     });
//   });
// };
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};
module.exports = authJwt;