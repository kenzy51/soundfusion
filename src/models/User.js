import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  instagram: {
    type: String,
    trim: true,
    default: null, 
  },
  musicianType: {
    type: String,
    enum: [
      "Pianist",
      "Guitarist/Bass",
      "Songwriter",
      "Drummer",
      "Vocalist",
      "Producer",
      "No skills",
      "Violinist",
      "Wind instruments",
      "Other",
    ],
    required: true,
  },
  goal: {
    type: String,
    required: true,
    trim: true,
  },
  preferredMusicGenre: {
    type: String,
    trim: true,
    default: null, 
  },
  password: {
    type: String,
    required: true,
  },
  tracks: {
    type: [trackSchema], 
    default: [],
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
