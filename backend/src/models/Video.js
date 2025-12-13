const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 2000 },
    url: { type: String, required: true },
    thumbnail: { type: String },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);

