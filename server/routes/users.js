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

  const { avatar, ...userData } = req.body

  console.log( "JSON Data:", userData )

  if(!req.body.nick) {
    return next("No 'nick' given, buddy. Don't always rush things. THINK before you act!")
  }

  let userNew

  // create USER in DB first (with temporary base64 avatar in database!)
  try {
    userNew = await User.create( { ...userData, avatar_url: avatar } )
    res.json( userNew )
  }
  catch(err) {
    return next( err )
  }

  // extract file base64 string from body...
  // why? we do not wanna store encoded file in database
  // => we wanna store the URL to it so we can easily deliver and render in frontend later...
  avatar && console.log( "Avatar String: ", avatar.substring(0, 40) )

  // UPLOAD / forward the received file to cloudinary
    // avatar => dataUri (=file in a string) => dataUri://image/png:base64:YHATWWKRzczzhnrnszaja
  if(avatar) {
    try {
      let uploadResult = await cloudinary.uploader.upload( avatar )
      const fileUrl = uploadResult.secure_url

      // update user in database -> replace base64 avatar with cloudinary URL!
      await User.findByIdAndUpdate( userNew._id, { avatar_url: fileUrl } )
      console.log("Uploaded avatar to cloudinary for: ", userNew.nick)
    }
    catch(err) {
      console.log(err)
    }
  }
  
})

// => please test me now in Insomnia :)

module.exports = router;
