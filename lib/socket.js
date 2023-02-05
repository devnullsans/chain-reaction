import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true, path: "/api/join" });

wss.on("connection", (socket, request) => {
  console.log({ request, socket });
  socket.close();
});

export function handleUpgrade(request, socket, head) {
  // get user out of the request and pass down to emit connection
  console.log("server upgrade got it");
  wss.handleUpgrade(request, socket, head, (client, request) =>
    wss.emit("connection", client, request)
  );
}
