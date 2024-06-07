// server.js
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });

let uidCounter = 0;

wss.on("connection", function connection(ws) {
  let uid = ++uidCounter;
  ws.uid = uid;

  console.log(`Client UID ${uid} connected`);

  ws.send(`Welcome! Your UID is ${uid}`);

  wss.clients.forEach(function each(client) {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(`User UID: ${uid} joined`);
    }
  });

  ws.on("message", function incoming(message) {
    const messageString = message.toString("utf-8");
    let parsedMessage;

    try {
      parsedMessage = JSON.parse(messageString);
    } catch (e) {
      // If parsing fails, treat it as a public message
      parsedMessage = { message: messageString };
    }

    const { recipientUID, message: actualMessage } = parsedMessage;

    console.log(`Received message from UID ${uid}:`, actualMessage);

    if (recipientUID) {
      // Send the message to the specified recipient only
      wss.clients.forEach(function each(client) {
        if (
          client.uid === parseInt(recipientUID) &&
          client.readyState === WebSocket.OPEN
        ) {
          client.send(`UID ${uid} (private): ${actualMessage}`);
        }
      });
    } else {
      // Broadcast the message to all clients except the sender
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(`UID ${uid}: ${actualMessage}`);
        }
      });
    }
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
