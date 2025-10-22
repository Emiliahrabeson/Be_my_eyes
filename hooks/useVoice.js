// hooks/useVoice.js
import * as Speech from "expo-speech";
import { useState } from "react";

export const useVoice = () => {
  // Texte reconnu ou tapé par l'utilisateur
  const [spokenText, setSpokenText] = useState("");
  // Adresse / destination correspondante
  const [destination, setDestination] = useState("");

  // Dictionnaire des destinations
  const destinations = {
    misa: "3XM...Ankatso",
    université: "UNIV-ANTANANARIVO",
    hopital: "HJRA",
  };

  // Fonction pour traiter le texte (à appeler quand tu as le mot)
  const handleVoiceCommand = (text) => {
    const key = text.toLowerCase().trim();
    setSpokenText(key);

    if (destinations[key]) {
      const adresse = destinations[key];
      setDestination(adresse);
      Speech.speak(`Votre destination est ${adresse}`, { language: "fr-FR" });
    } else {
      Speech.speak("Je n'ai pas trouvé cette destination.", {
        language: "fr-FR",
      });
      setDestination("inconnue");
    }
  };

  return { spokenText, destination, handleVoiceCommand };
};
