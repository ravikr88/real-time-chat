// client.js
const WebSocket = require("ws");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ws = new WebSocket("ws://localhost:3000");

ws.on("open", function open() {
  console.log("Connected to server");
});

ws.on("message", function incoming(message) {
  // Convert the received message to a string before logging
  const messageString = message.toString("utf-8");
  console.log("Received message:", messageString);
});

ws.on("close", function close() {
  console.log("Connection closed");
});

rl.on("line", (input) => {
  // Check if the input contains a recipientUID for targeted messaging
  if (input.startsWith("/msg")) {
    const [command, recipientUID, ...messageParts] = input.split(" ");
    const message = messageParts.join(" "); // Rejoin the message parts

    // Send the message along with recipient's UID to the server
    const messageWithRecipient = JSON.stringify({ recipientUID, message });
    ws.send(messageWithRecipient);
  } else {
    // For public messaging, send the message without specifying a recipientUID
    ws.send(JSON.stringify({ message: input }));
  }
});
