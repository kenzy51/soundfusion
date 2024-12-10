import mongoose from 'mongoose';

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
    musicianType: {
        type: String,
        enum: ['Pianist', 'Guitarist', 'Songwriter', 'Drummer', 'Vocalist', 'Producer', 'No skills'],
        required: true,
    },
    goal: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
