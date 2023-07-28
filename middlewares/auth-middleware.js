const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.js');
//const env = require('dotenv');
// env.config();

var checkUserAuth = async (req, res, next) => {
  let token
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]
      //console.log("Token", token);
      //console.log("Authorization", authorization)

      // Verify Token
      const { userID } = jwt.verify(token,JWT_SECRET_KEY)
      console.log(userID)

      // Get User from Token
      req.user = await UserModel.findById(userID).select('-password')
      console.log(req.user,"111111111111111111111111111111111111")

      next()
    } catch (error) {
      console.log(error)
      res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
    }
  }
  if (!token) {
    res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
  }
}
  module.exports = checkUserAuth;