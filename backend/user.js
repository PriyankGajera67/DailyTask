
// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const UserSchema = new Schema(
  {
    id: Number,
    firstName:String,
    lastName: String,
    dob:Date,
    gender:String,
    emailAddress:String,
    phoneNumber:String,
    password:String
  },
  { timestamps: true }
);
// export the new Schema so we could modify it using Node.js

module.exports = mongoose.model("User", UserSchema);