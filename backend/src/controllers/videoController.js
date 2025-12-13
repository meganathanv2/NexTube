const Video = require("../models/Video");
const Channel = require("../models/Channel");

const uploadVideo = async (req, res) => {
  const { title, description, channelId, tags, thumbnail } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const channel = await Channel.findById(channelId || req.user.channel);
  if (!channel) {
    return res.status(400).json({ message: "Channel is required" });
  }

  if (channel.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to upload to this channel" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Video file is required" });
  }

  try {
    const video = await Video.create({
      title,
      description,
      channel: channel._id,
      url: req.file.path,
      thumbnail,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    });
    return res.status(201).json({ video });
  } catch (error) {
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

const toggleLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const video = await Video.findById(id);
  if (!video) return res.status(404).json({ message: "Video not found" });

  const liked = video.likes.includes(userId);
  if (liked) {
    video.likes.pull(userId);
  } else {
    video.likes.push(userId);
    video.dislikes.pull(userId);
  }
  await video.save();
  return res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
};

const toggleDislike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const video = await Video.findById(id);
  if (!video) return res.status(404).json({ message: "Video not found" });

  const disliked = video.dislikes.includes(userId);
  if (disliked) {
    video.dislikes.pull(userId);
  } else {
    video.dislikes.push(userId);
    video.likes.pull(userId);
  }
  await video.save();
  return res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
};

const incrementViews = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!video) return res.status(404).json({ message: "Video not found" });
  return res.json({ views: video.views });
};

const getTrending = async (_req, res) => {
  const videos = await Video.find()
    .sort({ views: -1, createdAt: -1 })
    .limit(20)
    .populate("channel", "name avatar");
  return res.json({ videos });
};

const searchVideos = async (req, res) => {
  const { q } = req.query;
  const query = q
    ? {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { tags: { $in: [new RegExp(q, "i")] } },
        ],
      }
    : {};
  const videos = await Video.find(query)
    .sort({ createdAt: -1 })
    .limit(30)
    .populate("channel", "name avatar");
  return res.json({ videos });
};

const getVideo = async (req, res) => {
  const video = await Video.findById(req.params.id).populate("channel", "name avatar");
  if (!video) return res.status(404).json({ message: "Video not found" });
  return res.json({ video });
};

const getChannelVideos = async (req, res) => {
  const { channelId } = req.params;
  const videos = await Video.find({ channel: channelId })
    .sort({ createdAt: -1 })
    .populate("channel", "name avatar");
  return res.json({ videos });
};

module.exports = {
  uploadVideo,
  toggleLike,
  toggleDislike,
  incrementViews,
  getTrending,
  searchVideos,
  getVideo,
  getChannelVideos,
};

