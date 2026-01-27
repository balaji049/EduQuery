const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|txt|docx/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());

    if (ext) cb(null, true);
    else cb(new Error("Only PDF, DOCX, TXT allowed"));
  },
});

module.exports = upload;
