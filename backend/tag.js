
// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const TagSchema = new Schema(
  {
    id: Number,
    tag: String
  },
  { timestamps: true }
);
// export the new Schema so we could modify it using Node.js

module.exports = mongoose.model("Tag", TagSchema);