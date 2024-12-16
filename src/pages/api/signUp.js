import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcrypt";

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new musician
 *     description: Registers a new musician with name, email, musician type, goal, and password.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               musicianType:
 *                 type: string
 *                 enum: [Pianist, Guitarist, Songwriter, Drummer, Vocalist, Producer]
 *                 example: Pianist
 *               goal:
 *                 type: string
 *                 example: Create inspiring music
 *               password:
 *                 type: string
 *                 example: securepassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 63c45e65f6d2e5c1a9b62abc
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     musicianType:
 *                       type: string
 *                       example: Pianist
 *                     goal:
 *                       type: string
 *                       example: Create inspiring music
 *       400:
 *         description: Bad Request
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  const { name, email, musicianType, goal, password, preferredMusicGenre, instagram, tracks } = req.body;

  if (!name || !email || !musicianType || !goal || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      musicianType,
      goal,
      preferredMusicGenre,
      instagram,
      tracks,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        musicianType: newUser.musicianType,
        goal: newUser.goal,
        tracks:newUser.tracks,
      },
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Server error" });
  }
}
