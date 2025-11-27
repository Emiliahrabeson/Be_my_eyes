import * as Speech from "expo-speech";
import { io } from "socket.io-client";

// Create a Socket.IO client
const socket = io("https://bbe-my-eyes.onrender.com");

// Event listener for when the connection is established
socket.on("connect", () => {
  console.log("Socket.IO connection established.");
});

// Event listener for incoming messages
socket.on("incoming_message", (data) => {
  try {
    console.log("Raw incoming data:", data);
    // Check if the message body is of type object and contains text
    Speech.speak(data, {
      language: "fr-FR",
      pitch: 1.0,
      rate: 1.0,
    });
  } catch (error) {
    console.error("Error parsing message:", error.message);
  }
});

// Event listener for errors
socket.on("connect_error", (error) => {
  console.error("Socket.IO connection error:", error.message);
});

// Event listener for when the connection is closed
socket.on("disconnect", () => {
  console.log("Socket.IO connection closed.");
});
