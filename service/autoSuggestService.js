import * as Speech from "expo-speech";
import { calculateDistance } from "./placesService";

const SUGGESTION_CATEGORIES = [
  { type: "supermarket", label: "supermarché", radius: 500, amenity: false },
  { type: "pharmacy", label: "pharmacie", radius: 500, amenity: true },
  { type: "restaurant", label: "restaurant", radius: 400, amenity: true },
  { type: "hotel", label: "hôtel", radius: 500, amenity: true },
  { type: "bank", label: "banque", radius: 500, amenity: true },
  { type: "atm", label: "distributeur", radius: 300, amenity: true },
  { type: "hospital", label: "hôpital", radius: 1000, amenity: true },
];

// Historique des suggestions pour éviter les répétitions
let announcedPlaces = [];

const clearAnnouncedPlaces = () => {
  announcedPlaces = [];
};

// Vérifier si un lieu a déjà été annoncé récemment
const wasRecentlyAnnounced = (placeId) => {
  const now = Date.now();
  announcedPlaces = announcedPlaces.filter(
    (item) => now - item.timestamp < 600000 // 10 minutes
  );
  return announcedPlaces.some((item) => item.id === placeId);
};

// Marquer un lieu comme annoncé
const markAsAnnounced = (placeId) => {
  announcedPlaces.push({
    id: placeId,
    timestamp: Date.now(),
  });
};

const autoSuggestNearbyPlaces = async (latitude, longitude) => {
  try {
    const allSuggestions = [];

    // Rechercher chaque catégorie
    for (const category of SUGGESTION_CATEGORIES) {
      const tag = category.amenity ? "amenity" : "shop";

      const query = `
        [out:json][timeout:10];
        (
          node["${tag}"="${category.type}"](around:${category.radius},${latitude},${longitude});
          way["${tag}"="${category.type}"](around:${category.radius},${latitude},${longitude});
        );
        out body 1;
      `;

      try {
        const response = await fetch(
          "https://overpass-api.de/api/interpreter",
          {
            method: "POST",
            body: query,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );

        const data = await response.json();

        if (data.elements && data.elements.length > 0) {
          const element = data.elements[0];

          if (element.lat && element.lon && element.tags && element.tags.name) {
            const place = {
              id: element.id,
              name: element.tags.name,
              type: category.label,
              latitude: element.lat,
              longitude: element.lon,
              distance: calculateDistance(
                latitude,
                longitude,
                element.lat,
                element.lon
              ),
            };

            if (!wasRecentlyAnnounced(place.id)) {
              allSuggestions.push(place);
            }
          }
        }
      } catch (error) {
        console.log(`Erreur recherche ${category.label}:`, error);
      }
    }

    // Annoncer les 3 lieux les plus proches
    if (allSuggestions.length > 0) {
      const topSuggestions = allSuggestions
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

      announceSuggestions(topSuggestions);
    }
  } catch (error) {
    console.error("Erreur suggestion automatique:", error);
  }
};

// Annoncer les suggestions vocalement
const announceSuggestions = (suggestions) => {
  if (suggestions.length === 0) return;

  let message = "À proximité : ";

  suggestions.forEach((place, index) => {
    message += `${place.name}, ${place.type} à ${place.distance} mètres`;
    if (index < suggestions.length - 1) {
      message += ". ";
    }
    markAsAnnounced(place.id);
  });

  Speech.speak(message, {
    language: "fr",
    pitch: 1.0,
    rate: 0.85,
  });
};

export { autoSuggestNearbyPlaces, clearAnnouncedPlaces };
