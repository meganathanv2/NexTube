const express = require("express");
const {
  createChannel,
  updateChannel,
  getMyChannel,
  getChannelById,
} = require("../controllers/channelController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createChannel);
router.put("/:id", protect, updateChannel);
router.get("/me", protect, getMyChannel);
router.get("/:id", getChannelById);

module.exports = router;

