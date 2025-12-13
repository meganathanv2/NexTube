const Channel = require("../models/Channel");
const User = require("../models/User");

const createChannel = async (req, res) => {
  const { name, description, avatar } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Channel name is required" });
  }

  try {
    const existing = await Channel.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You already created a channel" });
    }

    const channel = await Channel.create({
      name,
      description,
      avatar,
      owner: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, { channel: channel._id });

    return res.status(201).json({ channel });
  } catch (error) {
    return res.status(500).json({ message: "Could not create channel" });
  }
};

const updateChannel = async (req, res) => {
  const { id } = req.params;
  const { name, description, avatar } = req.body;

  try {
    const channel = await Channel.findById(id);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update" });
    }

    if (name) channel.name = name;
    if (description) channel.description = description;
    if (avatar) channel.avatar = avatar;

    await channel.save();
    return res.json({ channel });
  } catch (error) {
    return res.status(500).json({ message: "Could not update channel" });
  }
};

const getMyChannel = async (req, res) => {
  const channel = await Channel.findOne({ owner: req.user._id });
  if (!channel) {
    return res.status(404).json({ message: "Channel not found" });
  }
  return res.json({ channel });
};

const getChannelById = async (req, res) => {
  const channel = await Channel.findById(req.params.id).populate("owner", "username avatar");
  if (!channel) {
    return res.status(404).json({ message: "Channel not found" });
  }
  return res.json({ channel });
};

module.exports = { createChannel, updateChannel, getMyChannel, getChannelById };

