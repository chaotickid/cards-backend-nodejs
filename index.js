const WebSocketServer = require("ws").Server;
const server = require("http").createServer();


const wss = new WebSocketServer({ server: server });
wss.on("connection", (ws, req) => {
  console.log(`Connection request from: ${req.connection.remoteAddress}`);
  ws.on("message", (data) => {
    console.log("data: " + data);
    const json = JSON.parse(data);
    const request = json.request;
    const message = json.message;
    const channel = json.channel;
    console.log(request, message, channel, channels);
    switch (request) {
      case "JOIN_LOBBY":
        joinLobby(ws, channel);
        publishMessage({ message, channel }, channel);
        break;
      case "MESSAGE":
        publishMessage({ message, channel }, channel);
        break;
    }
  });
  ws.on("close", () => {
    console.log("Stopping client connection.");
  });
});

server.listen(8080, () => {
  console.log("Server listening on http://localhost:8080");
});

var channels = {};

function createLobby(ws, channel) {
  channels[channel] = [ws];
}

function publishMessage(message, channel) {
  channels[channel].forEach((sub) => {
    sub.send(
      JSON.stringify({
        message,
      })
    );
  });
}

function joinLobby(ws, channel) {
  channels[channel].push(ws);
}
