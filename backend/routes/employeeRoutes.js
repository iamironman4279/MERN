const express = require("express");
const multer = require("multer");
const Employee = require("../models/Employee");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Create an employee
router.post("/create", upload.single("image"), async (req, res) => {
  const { name, email, mobile, designation, gender, course } = req.body;
  const image = req.file?.path;
  try {
    const employee = new Employee({ name, email, mobile, designation, gender, course, image });
    await employee.save();
    res.status(201).send("Employee created successfully.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Fetch all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update an employee
router.put("/:id", async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete an employee
router.delete("/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.send("Employee deleted successfully.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
