import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  console.log("Received method:", req.method);

  await dbConnect();

  if (req.method === "GET") {
    try {
      const users = await User.find({
        musicianType: { $exists: true, $ne: null },
      });

      res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
