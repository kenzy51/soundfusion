// src/pages/api/users/uploadTrack.js
import multer from 'multer';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// Initialize AWS S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// Set up multer storage and file filter
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.mp3') {
      return cb(new Error('Only MP3 files are allowed'));
    }
    cb(null, true);
  },
});

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to allow multer to process the request
  },
};
const handler = async (req, res) => {
  const uploadMiddleware = upload.single("track");

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      await dbConnect();

      const { userId, title, genre } = req.body; // Extract fields properly
      if (!userId || !title || !genre) {
        return res
          .status(400)
          .json({ error: "User ID, title, and genre are required" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No track file uploaded" });
      }

      const fileName = `${Date.now()}_${req.file.originalname}`;
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: `tracks/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(uploadParams));

      const trackUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/tracks/${fileName}`;

      const trackDetails = {
        title,
        genre,
        duration: 0,
        releaseDate: new Date(),
        trackUrl,
      };

      user.tracks.push(trackDetails);
      await user.save();

      res.status(200).json({
        message: "Track uploaded successfully",
        track: trackDetails,
      });
    } catch (error) {
      console.error("Error uploading track:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
};

export default handler;
