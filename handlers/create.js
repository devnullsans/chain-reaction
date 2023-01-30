import { rooms } from "../lib/games";

export async function create(req, res) {
  const { key } = req.user;

  if (rooms.has(key)) return res.status(400).json({ error: "Room already exists." });

  // add new game to db for info

  res.status(200).json({ data: "Farewell" });
}
