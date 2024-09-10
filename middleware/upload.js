const path = require("path");
const multer = require("multer");

const uploadDir = path.join(process.cwd(), "tmp");



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 100);
    cb(null, "avatar" + uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload.single("avatar");
