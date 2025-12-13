const express = require("express");
const upload = require("../middleware/upload");
const {
  uploadVideo,
  toggleLike,
  toggleDislike,
  incrementViews,
  getTrending,
  searchVideos,
  getVideo,
  getChannelVideos,
} = require("../controllers/videoController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/trending", getTrending);
router.get("/search", searchVideos);
router.get("/channel/:channelId", getChannelVideos);
router.get("/:id", getVideo);
router.post("/", protect, upload.single("video"), uploadVideo);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/dislike", protect, toggleDislike);
router.post("/:id/view", incrementViews);

module.exports = router;

