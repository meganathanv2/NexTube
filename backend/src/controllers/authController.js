const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

const getSafeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  channel: user.channel,
});

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({
      user: getSafeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      user: getSafeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken: incoming } = req.body;
  if (!incoming) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = await new Promise((resolve, reject) => {
      require("jsonwebtoken").verify(
        incoming,
        process.env.JWT_REFRESH_SECRET,
        (err, data) => (err ? reject(err) : resolve(data))
      );
    });

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== incoming) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save();

    return res.json({
      accessToken,
      refreshToken: newRefreshToken,
      user: getSafeUser(user),
    });
  } catch (error) {
    return res.status(401).json({ message: "Could not refresh token" });
  }
};

const getProfile = async (req, res) => {
  return res.json({ user: getSafeUser(req.user) });
};

const updateProfile = async (req, res) => {
  const { username, bio, avatar } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();
    return res.json({ user: getSafeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Profile update failed" });
  }
};

const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    return res.json({ message: "Logged out" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = { register, login, refreshToken, getProfile, updateProfile, logout };

