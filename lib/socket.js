import { WebSocketServer } from "ws";
import { findUser } from "./users.js";
import { rooms } from "./games.js";

const wss = new WebSocketServer({ noServer: true, path: "/api/join", clientTracking: false });

wss.on("connection", (socket, request) => {
  console.log(request.user);
  console.log(request.game);

  if (!rooms.has(request.game)) return socket.close(1011, "Game Not Found");

  const game = rooms.get(request.game);

  if (game.isFull()) return socket.close(1011, "Game Is Full");

  game.addPlayer(request.user, socket);
});

export async function handleUpgrade(request, socket, head) {
  // get user out of the request and pass down to emit connection
  try {
    const {
      url,
      headers: { host, origin, cookie }
    } = request;

    // TODO if origin header check should be same origin

    const game = new URL(url, `http://${host}/`)?.searchParams?.get("g") ?? "";

    const auth =
      cookie
        ?.split(";")
        ?.map((cs) => cs.split("=").map((c) => decodeURIComponent(c.trim())))
        ?.reduce((a, [n, v]) => (n === "auth" ? v : a), "") ?? "";

    const user = await findUser(auth);

    if (user === null) throw new Error("Join Game Request User Forbidden or Not Found");

    wss.handleUpgrade(request, socket, head, (client, request) => {
      request.user = user;
      request.game = game;
      wss.emit("connection", client, request);
    });
  } catch (error) {
    console.log(error);
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.end();
  }
}
