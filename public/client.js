const socket = io();

const chatMessages = document.getElementById("chat-messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    appendMessage(message, "sent");
    socket.emit("chat message", message);
    messageInput.value = "";
  }
});

socket.on("chat message", (message) => {
  appendMessage(message, "received");
});

function appendMessage(message, type) {
  const messageParts = message.split(":");
  const username = messageParts[0].trim();
  const content = messageParts.slice(1).join(":").trim();

  const messageElement = document.createElement("div");
  messageElement.textContent = content;
  messageElement.classList.add("message", type);

  // Create a span element to highlight the username
  const usernameSpan = document.createElement("span");
  usernameSpan.textContent = username;
  usernameSpan.classList.add("username");

  if (type === "sent") {
    messageElement.classList.add("sent");
  } else {
    messageElement.classList.add("received");
  }

  // Append the username span and message content to the message element
  messageElement.appendChild(usernameSpan);

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
