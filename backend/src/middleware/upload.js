const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { cloudinaryStorage, hasCloudinaryConfig } = require("../config/cloudinary");

const uploadDir = process.env.UPLOAD_FOLDER || "uploads";

if (!hasCloudinaryConfig) {
  const absolutePath = path.join(process.cwd(), uploadDir);
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
  }
}

const diskStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const storage = hasCloudinaryConfig ? cloudinaryStorage : diskStorage;

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

module.exports = upload;

