const mongoose = require("mongoose");

// Create a User Schema
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    course: { type: [String], required: true }, // Array of selected courses
    password: { type: String, required: true },
    image: { type: String }, // Image file path will be saved here
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

// Create the User model based on the schema
module.exports = mongoose.model("User", UserSchema);
