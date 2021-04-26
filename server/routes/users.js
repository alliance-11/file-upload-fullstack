const express = require('express');
const router = express.Router();
const User = require("../models/User")
const cloudinary = require("cloudinary").v2;

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
router.post('/', async (req, res, next) => {

  console.log(req.body)

  if(!req.body.nick) {
    return next("No 'nick' given, buddy. Don't always rush things. THINK before you act!")
  }

  // extract file base64 string from body...
  const { avatar, ...userData } = req.body

  console.log( userData )
  console.log( avatar && avatar.substring(0, 20) )

  // create new user in DB
  let userNew
  
  // UPLOAD / forward the received file to cloudinary
    // dataUri => dataUri://image/png:base64:YHATWWKRzczzhnrnszaja
  if(avatar) {
    let uploadResult = await cloudinary.uploader.upload( avatar )
    const fileURLOnCloudinary = uploadResult.secure_url
    userNew = await User.create({...userData, avatar_url:  fileURLOnCloudinary })
  }
  else {
    userNew = await User.create(userData)
  }

  res.json(userNew)
})

module.exports = router;
