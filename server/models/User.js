const mongoose = require("mongoose")
const { Schema, model } = mongoose

const UserSchema = new Schema({
  email: { type: String, required: true},
  password: { type: String, required: true},
  nick: { type: String, required: true},
  avatar_url: String // http://url-to-my-crazy-avatar.com
},
// SCHEMA Options
{
  versionKey: false,
  toJSON: {
    // keep password field out of all API responses (=> on all res.send() calls)
    transform: (doc, returnDoc) => {
        delete returnDoc.password
    }
  }
})

const User = model("User", UserSchema)
module.exports = User