const express = require('express');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/upload');
const User = require("../models/User")
const router = express.Router();
const { auth } = require("../middleware/authenticator")

const JWT_SECRET = process.env.JWT_SECRET || "holySecret123"
const TOKEN_LIFETIME =  process.env.TOKEN_LIFETIME || 1000*60*15 // 15 minutes

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const users = await User.find()
  res.json(users);
});


// POST /users => signup a user
router.post('/', async (req, res, next) => {

  if(!req.body.nick) {
    return next("No 'nick' given, buddy. Don't always rush things. THINK before you act!")
  }

  // create new user
  let userNew = new User(req.body)
  userNew = await userNew.save()

  res.json(userNew)
})


// POST /users/login => route to login a user
router.post('/login', async (req, res, next) => {

  let { email, password } = req.body

  let userFound = await User.find(user => user.email == email && user.password == password)

  if(!userFound) {
    return next("User with that credentials not found")
  }
  
  let token = jwt.sign({ _id: userFound._id, email: userFound.email }, JWT_SECRET, { expiresIn: TOKEN_LIFETIME })

  res
    .cookie("token", token, { maxAge: TOKEN_LIFETIME })
    .json(userFound) // send user and omit password field
})



router.get('/me', auth, (req, res, next) => {
  console.log("Authenticated User: ", req.user)
  res.json(req.user)
})  

module.exports = router;
