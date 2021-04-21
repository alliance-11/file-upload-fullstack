const express = require('express');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/upload');
const User = require("../models/User")
const router = express.Router();
const { auth } = require("../middleware/authenticator")
const cloudinary = require("cloudinary").v2;
const DataUriParser = require("datauri/parser")
const dataUriParser = new DataUriParser()
const path = require("path")

const JWT_SECRET = process.env.JWT_SECRET || "holySecret123"
const TOKEN_LIFETIME =  process.env.TOKEN_LIFETIME || 1000*60*15 // 15 minutes

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const users = await User.find()
  res.json(users);
});

// MIDDLEWARE - what do they do?

// express.json() => parses incoming JSON data into req.body
// cookieParser() => parses incoming cookies into req.cookies
// multer() => parses incoming FILE data into req.file (or req.files for multiple files)



// POST /users => signup a user
  // upload.single("avatar") => will look for a file inside the sent data entry "avatar"
  // upload.array("avatar") => will look for an array of files inside key "avatar"
router.post('/', upload.single("avatar"), async (req, res, next) => {

  if(!req.body.nick) {
    return next("No 'nick' given, buddy. Don't always rush things. THINK before you act!")
  }
  console.log( req.file ) // => here multer will store the parsed image result
  // req.file.buffer => here the binary file data is lying around... 

  let fileExtension = path.extname(req.file.originalname) // gimme the extension of that file pleaaase!

  // convert buffer (=binary file) to base64 encoded dataURI
  const dataUri = dataUriParser.format(fileExtension, req.file.buffer)

  // UPLOAD / forward the received file to cloudinary
  // dataUri => dataUri://image/png:base64:YHATWWKRzczzhnrnszaja
  const uploadResult = await cloudinary.uploader.upload( dataUri.content )

  // create new user
  const fileURLOnCloudinary = uploadResult.secure_url
  const userNew = await User.create({...req.body, avatar_url:  fileURLOnCloudinary })

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
