const multer = require("multer");
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    return cb(null, true);
  } else {
    req.file_error = "Only image file types are allowed!";
    return cb(null, false);
  }
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-fitM-${file.originalname}`); // unique file names
  },
});

const uploadFile = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = uploadFile;
