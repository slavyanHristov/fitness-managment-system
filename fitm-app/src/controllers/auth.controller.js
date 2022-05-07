const db = require('../models')
const { passwordHash } = require('../utils')
const {JWT_SECRET, JWT_EXPIRATION} = require('../../config/config')
const User = db.user
const RefreshToken = db.refreshToken
const jwt = require('jsonwebtoken')

exports.authenticateUser = async (req, res) => {
    const {username, password} = req.body

    if(!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Empty fields!"
        })
    }

    const user = await User.findOne({
        where: {
            username
        }
    })
    if(!user) {
        return res.status(400).json({
            success: false,
            message: "Username or password doesn't match!"
        })
    }
    try {
        if (await passwordHash.comparePassword(password, user.password)){
            const token = jwt.sign({username: user.username}, JWT_SECRET, {expiresIn: JWT_EXPIRATION})
            let refreshToken = await RefreshToken.createToken(user)
            return res.json({
                success: true,
                message: "User has been authenicated!",
                username: user.username,
                accessToken: token,
                refreshToken: refreshToken
            })
        } else {
            return res.status(401).json({
              success: false,
              message: "Username or password doesn't match!"
            })
        }
    } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message
        })
    }
}


exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
    if (requestToken == null) {
      return res.status(403).json({
        success: false,
        message: "Refresh Token is required!"
       })
    }
    try {
      let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } })
      console.log(refreshToken)
      if (!refreshToken) {
        res.status(403).json({
          success: false,
          message: "Refresh token is not in database!"
        })
        return;
      }
      if (RefreshToken.verifyExpiration(refreshToken)) {
        RefreshToken.destroy({ where: { id: refreshToken.id } })
        
        return res.status(403).json({
          success: false,
          message: "Refresh token has expired. Please make a new signin request",
        })
      }
      const user = await refreshToken.getUser()
      let newAccessToken = jwt.sign({ username: user.username }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });
      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }
  }