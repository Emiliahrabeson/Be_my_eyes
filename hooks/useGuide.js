import * as Location from "expo-location";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import { Vibration } from "react-native";

export function useGuide(destination, destinationCoords) {
  const [distance_courant, setDistance_courant] = useState(null);
  const intervalRef = useRef(null); //timer
  const derniere_annonceRef = useRef(0); //quand (dernier_annonce)

  //calcul de distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    //fonction de Haversine
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(2);
  };

  const checkAnnonce = async () => {
    if (!destinationCoords) return;

    const localisation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High, //plus precis
    });

    const dist = calculateDistance(
      localisation.coords.latitude,
      localisation.coords.longitude,
      destinationCoords.latitude,
      destinationCoords.longitude
    );

    setDistance_courant(dist);

    const now = Date.now();
    console.log(now);

    const temps_since_dernier = now - derniere_annonceRef.current;

    if (temps_since_dernier >= 300000) {
      if (dist <= 0.05) {
        Speech.speak("Vous êtes arrivé", { language: "fr-FR" });
        Vibration.vibrate([0, 500, 200, 500, 200, 500]); // Vibre fort 3 fois
        stopGuide();
      } else if (dist <= 0.1) {
        Speech.speak(`Il vous reste ${dist} kilomètres`, {
          language: "fr-FR",
        });
        Vibration.vibrate([0, 200, 100, 200, 100, 200]); // Vibre 3 fois
      } else if (dist <= 0.5) {
        Speech.speak(`Il vous reste 500 mètres`, { language: "fr-FR" });
        Vibration.vibrate([0, 200, 100, 200]); // Vibre 2 fois
      } else {
        Speech.speak(
          `Il vous reste ${dist} kilomètres jusqu'à ${destination}`,
          { language: "fr-FR" }
        );
      }
    }
    derniere_annonceRef.current = now;
  };

  const startGuide = () => {
    if (intervalRef.current) return;

    checkAnnonce();

    intervalRef.current = setInterval(() => {
      checkAnnonce();
    }, 30000);
  };

  const stopGuide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Arrêter le timer
      intervalRef.current = null;
    }
  };

  // Quand le composant est détruit, arrêter le guidage
  useEffect(() => {
    return () => stopGuide();
  }, []);

  useEffect(() => {
    if (destination && destinationCoords) {
      startGuide();
    } else {
      stopGuide();
    }
  }, [destination, destinationCoords]);

  return {
    distance_courant,
    startGuide,
    stopGuide,
    announceNow: checkAnnonce,
  };
}
