const multer = require("multer");
const path = require("path");

// Set up Multer storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the 'uploads/' folder exists, where the files will be saved
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using timestamp and original file name
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Accept only image files (optional validation)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true); // Accept the file
  } else {
    return cb(new Error("Only image files (jpeg, jpg, png, gif) are allowed!"), false);
  }
};

// Define multer upload configuration with storage, fileFilter, and size limit
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;
