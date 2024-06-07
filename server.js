// server.js
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });

let uidCounter = 0;

wss.on("connection", function connection(ws) {
  let uid = ++uidCounter;

  console.log(`Client UID ${uid} connected`);

  ws.send(`Welcome! Your UID is ${uid}`);

  wss.clients.forEach(function each(client) {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(`User UID: ${uid} joined`);
    }
  });

  ws.on("message", function incoming(message) {
    const messageString = message.toString("utf-8");

    console.log(`Received message from UID ${uid}:`, messageString);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`UID ${uid}: ${messageString}`);
      }
    });
  });

  ws.on("close", function close() {
    console.log(`UID ${uid} disconnected`);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`User UID: ${uid} disconnected`);
      }
    });
  });
});
