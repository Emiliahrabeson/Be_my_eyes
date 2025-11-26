// services/location.service.js

import * as Location from "expo-location";
import * as Speech from "expo-speech";
import { sendLocationToServer } from "../api/location.api";
import { LOCATION_CONFIG, MESSAGES } from "../constants/location.constants";

/**
 * Demande la permission de localisation
 * @returns {Promise<boolean>} True si permission accordée
 */
export const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
};

/**
 * Récupère la position actuelle
 * @returns {Promise<Object>} Position actuelle
 */
export const getCurrentLocation = async () => {
  return await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
};

/**
 * Récupère l'adresse à partir des coordonnées
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>} Adresse
 */
export const getAddressFromCoords = async (latitude, longitude) => {
  const addresses = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });
  return addresses[0];
};

/**
 * Annonce l'adresse vocalement
 * @param {string} formattedAddress
 */
export const announceAddress = (formattedAddress) => {
  setTimeout(() => {
    Speech.speak(MESSAGES.LOCATION_ANNOUNCEMENT(formattedAddress), {
      language: "fr-FR",
    });
  }, LOCATION_CONFIG.SPEECH_DELAY);
};

/**
 * Envoie les données de localisation
 * @param {Object} coords - Coordonnées
 * @param {Object} address - Adresse
 */
export const submitLocationData = async (coords, address) => {
  try {
    await sendLocationToServer({
      long: coords.longitude,
      lat: coords.latitude,
      addr: address,
    });
  } catch (error) {
    console.error("Erreur lors de la soumission:", error);
  }
};
