import { API_CONFIG } from "../constants/location.constants";

/**
 * Envoie les données de localisation au serveur
 * @param {Object} locationData - Données de localisation
 * @param {number} locationData.long - Longitude
 * @param {number} locationData.lat - Latitude
 * @param {Object} locationData.addr - Adresse complète
 * @returns {Promise<Object>} Réponse du serveur
 */
export const sendLocationToServer = async (locationData) => {
  try {
    console.log(locationData);
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOCATION}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'envoi de la localisation:", error);
    throw error;
  }
};
