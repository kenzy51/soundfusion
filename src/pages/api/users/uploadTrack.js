import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import multer from "multer";
import path from "path";
import fs from "fs";

// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Save in the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".mp3") {
      return cb(new Error("Only MP3 files are allowed"));
    }
    cb(null, true);
  },
}).single("track"); // Handle single file upload with field name "track"

export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { userId } = req.body; // userId should be passed from the front end
      const trackPath = `/uploads/${req.file.filename}`; // path where the file is saved

      try {
        // Find the user by userId and update their tracks array
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        user.tracks.push({ title: req.file.originalname, genre: "Unknown", duration: 0, releaseDate: new Date(), trackUrl: trackPath });
        await user.save();

        return res.status(200).json({ message: "Track uploaded successfully", track: { title: req.file.originalname, trackUrl: trackPath } });
      } catch (error) {
        return res.status(500).json({ error: "Server error" });
      }
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
