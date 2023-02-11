import { WebSocketServer } from "ws";
import { findUser } from "./users.js";

const wss = new WebSocketServer({ noServer: true, path: "/api/join" });

wss.on("connection", (socket, request) => {
  console.log(request.user);
  console.log(request.game);
  socket.close();
});

export async function handleUpgrade(request, socket, head) {
  // get user out of the request and pass down to emit connection
  try {
    const {
      url,
      headers: { host, origin, cookie }
    } = request;

    // TODO if origin header check should be same origin

    const game = new URL(url, `http://${host}/`).searchParams.get("g");

    const auth = cookie
      .split(";")
      .map((cs) => cs.split("=").map((c) => decodeURIComponent(c.trim())))
      .reduce((a, [n, v]) => (n === "auth" ? v : a), "");

    const user = await findUser(auth);

    wss.handleUpgrade(request, socket, head, (client, request) => {
      request.user = user;
      request.game = game;
      wss.emit("connection", client, request);
    });
  } catch (error) {
    console.log(error);
    socket.destroy();
  }
}
