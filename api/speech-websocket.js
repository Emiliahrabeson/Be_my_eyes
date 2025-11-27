import * as Speech from "expo-speech";
import { io } from "socket.io-client";
import { updateMessage } from "./speech.api";

let socket; // Declare a variable to hold the socket instance

// Function to get or create the Socket.IO client
const getSocket = () => {
  if (!socket) {
    // Initialize the socket only if it hasn't been initialized yet
    socket = io("https://bbe-my-eyes.onrender.com");

    // Event listener for when the connection is established
    socket.on("connect", () => {
      console.log("Socket.IO connection established.");
    });

    // Event listener for incoming messages
    socket.on("incoming_message", async (data) => {
      try {
        const message = JSON.parse(data);
        Speech.speak(message.text, {
          language: "fr-FR",
          pitch: 1.0,
          rate: 1.0,
        });
        updateMessage(message.id);
      } catch (error) {
        console.error("Error parsing message:", error.message);
      }
    });

    // Event listenr for queued messages
    socket.on("unread_messages", (data) => {
      try {
        const message = JSON.parse(data);
        Speech.speak(`Tu as ${message.length} nouveau message`, {
          language: "fr-FR",
          pitch: 1.0,
          rate: 1.0,
        });
        for (let i = 0; i < message.length; i++) {
          Speech.speak(`Message numéro ${i + 1}, ` + message[i].text, {
            language: "fr-FR",
            pitch: 1.0,
            rate: 1.0,
          });
          updateMessage(message[i].id);
        }
      } catch (error) {
        console.error("Error parsing queued message:", error.message);
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
  }
  return socket;
};

// Export the function to get the socket instance
export default getSocket;
