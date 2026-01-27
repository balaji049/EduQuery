const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  uploadResource,
  getResources,
  deleteResource,
} = require("../controllers/resourceController");

// Public
router.get("/", getResources);

// Admin only
router.post("/upload", auth, admin, upload.single("file"), uploadResource);
router.delete("/:id", auth, admin, deleteResource);

module.exports = router;
