import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

/**
 * @swagger
 * /user/addTrack:
 *   post:
 *     summary: Add a new track to the user
 *     description: Adds a new track to the logged-in user.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: string
 *               duration:
 *                 type: number
 *               releaseDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Track added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  const { title, genre, duration, releaseDate } = req.body;
  const userId = req.userId; // Assuming you have user authentication and userId from token

  if (!title || !genre || !duration || !releaseDate) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Find the user and add a new track to their tracks array
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newTrack = { title, genre, duration, releaseDate: new Date(releaseDate) };

    user.tracks.push(newTrack); // Push the new track into the tracks array
    await user.save(); // Save the updated user

    return res.status(200).json({ message: "Track added successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
