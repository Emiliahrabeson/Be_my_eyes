import * as Speech from "expo-speech";
import { io } from "socket.io-client";
import { updateMessage } from "./speech.api";

let socket; // Declare a variable to hold the socket instance

// Function to get or create the Socket.IO client
const getSocket = () => {
  if (!socket) {
    // Initialize the socket only if it hasn't been initialized yet
    socket = io("ws://192.168.1.172:3000");

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

    //update camera
    socket.on("update_camera", (data) => {
      try {
        // console.log("📷 Données caméra reçues :", data);

        // // Parse si c'est une string, sinon utilise directement
        // const parsedData = typeof data === "string" ? JSON.parse(data) : data;

        // // Le backend envoie un tableau, on prend le premier élément
        // const cameraData = Array.isArray(parsedData)
        //   ? parsedData[0]
        //   : parsedData;

        // console.log("📷 Données parsées :", cameraData);

        // Vérifier si c'est un obstacle (pas "update_camera")
        // if (cameraData.obstacle) {
        //   const directionFR =
        //     {
        //       avant: "devant",
        //       arriere: "derrière",
        //       gauche: "à gauche",
        //       droite: "à droite",
        //     }[cameraData.direction] || cameraData.direction;

        //   const phrase = `Attention, obstacle ${directionFR} à ${cameraData.distance} mètres.`;

        //   console.log("🔊 Annonce :", phrase);

        //   Speech.speak(phrase, {
        //     language: "fr-FR",
        //     pitch: 1.2, // Pitch plus élevé pour urgence
        //     rate: 0.9, // Rate légèrement ralenti pour clarté
        //   });
        // }
        setTimeout(() => {
          const parsedData = JSON.parse(data);
          Speech.speak(parsedData.message, {
            language: "fr-FR",
            pitch: 1.0,
            rate: 1.0,
          });
        }, 15 * 1000);
      } catch (error) {
        console.error("❌ Erreur traitement caméra:", error.message, error);
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
