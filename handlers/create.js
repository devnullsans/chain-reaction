import { rooms, Game } from "../lib/games";

export async function create(req, res) {
  const { key } = req.user;
  const { players, visible } = req.body;

  if (rooms.has(key)) return res.status(400).json({ error: "Room already exists." });
  const totalPlayer = parseInt(players);

  // add new game to db for info
  const game = new Game(key, totalPlayer, Boolean(visible));
  rooms.set(key, game);

  res.status(200).json({ data: key });
}
