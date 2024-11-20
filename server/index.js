const express = require("express");
const connectDb = require("./config/conn");
const expressWS = require("express-ws");
const cors = require("cors");
const { configDotenv } = require("dotenv");

const app = express();
expressWS(app);

configDotenv();
connectDb();

app.use(cors());

let userMap = []; // To store all connections

// Function to send a message to all users with the same ID
const sendCode = (id, code) => {
  userMap.forEach((user) => {
    if (user.userId === id) { // Match the common `id`
      if (user.socket.readyState === user.socket.OPEN) {
        try {
          console.log(`Sending code to user with ID: ${id}`);
          user.socket.send(code);
        } catch (error) {
          console.error(`Error sending code to user with ID: ${id}:`, error);
        }
      } else {
        console.warn(`Unable to send code to user with ID: ${id}, socket not open`);
      }
    }
  });
};

app.ws("/emit", (ws, req) => {
  console.log("A WebSocket connection has been established.");
 
  const pingInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.ping(); // Keep the connection alive
    }
  }, 30000);

  ws.on("message", (msg) => {
    try {
      const parsedMsg = JSON.parse(msg);
      const { id, code } = parsedMsg;

      if (!id || typeof code !== "string") {
        console.warn("Invalid message format received:", parsedMsg);
        return;
      }
      
      // Add the user connection to the userMap
      userMap.push({ userId: id, socket: ws });
      console.log(`User with ID: ${id} connected. Total connections: ${userMap.length}`);

      // Send code to all users with the same ID
      sendCode(id, code);
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(pingInterval);

    // Remove all instances of the disconnected WebSocket
    const initialLength = userMap.length;
    userMap = userMap.filter((user) => user.socket !== ws);
    console.log(`Removed ${initialLength - userMap.length} connections. Total connections: ${userMap.length}`);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

app.listen(8080, () => {
  console.log("Server is running on ws://localhost:8080");
});
