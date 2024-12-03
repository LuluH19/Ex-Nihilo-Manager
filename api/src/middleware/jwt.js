const jwt = require("jsonwebtoken")
const { jwt_secret } = require("../constant/config.const")

const generateToken = (user) => {
    return jwt.sign({role: user.role, id: user._id, email:user.email}, jwt_secret, {expiresIn:"2h"})
}
const verifyToken = (token) => {
    return jwt.verify(token, jwt_secret)
}

module.exports = {
    generateToken,
    verifyToken
}