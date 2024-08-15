const multer = require("multer");
const uniqid = require("uniqid");
const path = require("path");

const TYPE_IMAGE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
  "image/webm": "webm",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/images/setting");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + uniqid() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (TYPE_IMAGE[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only image files are allowed."), false);
  }
};

const upl_setting = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upl_setting;