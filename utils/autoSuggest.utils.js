import { LOCATION_CONFIG } from "../constants/location.constants";
import { autoSuggestNearbyPlaces } from "../service/autoSuggestService";

/**
 * Vérifie si une suggestion automatique doit être déclenchée
 * @param {boolean} autoSuggestEnabled
 * @param {number} speed
 * @param {number} lastSuggestionTime
 * @returns {boolean}
 */
export const shouldTriggerAutoSuggest = (
  autoSuggestEnabled,
  speed,
  lastSuggestionTime
) => {
  if (!autoSuggestEnabled || speed <= 0) {
    return false;
  }

  const now = Date.now();
  return now - lastSuggestionTime > LOCATION_CONFIG.AUTO_SUGGEST_COOLDOWN;
};

/**
 * Déclenche une suggestion automatique après un délai
 * @param {number} latitude
 * @param {number} longitude
 * @param {Function} onComplete - Callback appelé après suggestion
 */
export const triggerAutoSuggest = (latitude, longitude, onComplete) => {
  setTimeout(() => {
    autoSuggestNearbyPlaces(latitude, longitude);
    if (onComplete) {
      onComplete(Date.now());
    }
  }, LOCATION_CONFIG.AUTO_SUGGEST_DELAY);
};
