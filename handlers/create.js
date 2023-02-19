import { Game, rooms } from "../lib/games.js";
// import { db } from "../lib/mongo.js";

export async function create(req, res) {
  // const Games = db.collection("games");
  const { _id, key } = req.user;
  const { players, visible } = req.body;

  const totalPlayer = parseInt(players);
  if (rooms.has(key)) return res.status(400).json({ error: "Room already exists." });

  // await Games.insertOne({
  //   room: key,
  //   creator: _id,
  //   totalPlayer,
  //   visible,
  //   // players: [],
  //   // winner: some player
  // });

  // when game will have its own id will need to pass it to the game constructor for async db updates

  // TODO add new game to db for info
  const game = new Game(key, totalPlayer, Boolean(visible));
  rooms.set(key, game);

  res.status(200).json({ data: key });
}
