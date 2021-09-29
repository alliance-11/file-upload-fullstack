const express = require('express');
const router = express.Router();
const User = require("../models/User")
const cloudinary = require("cloudinary").v2;

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const users = await User.find()
  res.json(users);
});


// POST /users => signup a user with or without an avatar!
router.post('/', async (req, res, next) => {

  console.log(req.body)

  if(!req.body.nick) {
    return next("No 'nick' given, buddy. Don't always rush things. THINK before you act!")
  }

  // extract file base64 string from body...
  // why? we do not wanna store encoded file in database
  // => we wanna store the URL to it so we can easily deliver and render in frontend later...
  const { avatar, ...userData } = req.body

  console.log( userData )
  console.log( avatar && avatar.substring(0, 20) )

  // UPLOAD / forward the received file to cloudinary
    // dataUri => dataUri://image/png:base64:YHATWWKRzczzhnrnszaja
  if(avatar) {
    let uploadResult = await cloudinary.uploader.upload( avatar )
    const fileUrl = uploadResult.secure_url
    userData.avatar_url = fileUrl
  }

  const userNew = await User.create( userData )

  res.json(userNew)
})

// => please test me now in Insomnia :)

module.exports = router;
