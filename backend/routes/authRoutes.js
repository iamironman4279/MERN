const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename to avoid conflict
  },
});

const upload = multer({ storage: storage });

// POST /register - Create User
router.post("/register", upload.single("image"), async (req, res) => {
  const { username, name, email, mobile, designation, gender, course, password } = req.body;
  const image = req.file?.path; // Get the uploaded image file path

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user document
    const user = new User({
      username,
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      password: hashedPassword,
      image, // Store the image path
    });

    // Save the user in the database
    await user.save();
    res.status(201).send("User registered successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
});

// GET /users - Get all users (Admin view)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching users");
  }
});

// GET /user/:id - Get a single user by ID
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Fetch user by ID
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching user");
  }
});

// PUT /user/:id - Update user details
router.put("/user/:id", upload.single("image"), async (req, res) => {
  const { username, name, email, mobile, designation, gender, course, password } = req.body;
  const image = req.file?.path; // Get the uploaded image file path

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update the user fields
    user.username = username || user.username;
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.designation = designation || user.designation;
    user.gender = gender || user.gender;
    user.course = course || user.course;
    user.password = password ? await bcrypt.hash(password, 10) : user.password; // Only hash if password is provided
    user.image = image || user.image; // Only update image if a new one is provided

    await user.save();
    res.status(200).send("User updated successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
});

// DELETE /user/:id - Delete user by ID
router.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User deleted successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
});

module.exports = router;
