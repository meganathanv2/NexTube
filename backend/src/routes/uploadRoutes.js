const express = require("express");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  return res.json({ path: req.file.path, file: req.file });
});

module.exports = router;

