// Import required modules
const { v4: uuidv4 } = require("uuid"); // Used for generating unique filenames
const multer = require("multer");
const path = require("path");

// Configure storage options for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set destination directory for uploaded files
    cb(null, "./public/images/groupDps");
  },
  filename: function (req, file, cb) {
    // Generate unique filename using UUID v4 and keep original file extension
    const uniqueFileName = uuidv4();
    cb(null, uniqueFileName + path.extname(file.originalname));
  },
});

// Define file filter function to only allow image files
function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    // Accept only files with MIME type starting with 'image/'
    cb(null, true);
  } else {
    // Reject files with other MIME types
    cb(new Error("Only image files are allowed"));
  }
}

// Configure multer middleware with storage and file filter
const upload = multer({ storage, fileFilter });

// Export configured multer middleware for file upload handling
module.exports = upload;
