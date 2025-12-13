const express = require("express");
const {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  logout,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.post("/logout", protect, logout);

module.exports = router;

