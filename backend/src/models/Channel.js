const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 500 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Channel", channelSchema);

