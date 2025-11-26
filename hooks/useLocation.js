import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Vibration } from "react-native";
import {
  LOCATION_CONFIG,
  MESSAGES,
  VIBRATION_PATTERN,
} from "../constants/location.constants";
import { clearAnnouncedPlaces } from "../service/autoSuggestService";
import {
  announceAddress,
  getAddressFromCoords,
  getCurrentLocation,
  requestLocationPermission,
  submitLocationData,
} from "../service/location.service";
import {
  shouldTriggerAutoSuggest,
  triggerAutoSuggest,
} from "../utils/autoSuggest.utils";

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [gpsActive, setGpsActive] = useState(false);
  const [autoSuggestEnabled, setAutoSuggestEnabled] = useState(true);
  const [lastSuggestionTime, setLastSuggestionTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Utiliser useRef pour éviter les dépendances dans useEffect
  const autoSuggestEnabledRef = useRef(autoSuggestEnabled);
  const lastSuggestionTimeRef = useRef(lastSuggestionTime);

  useEffect(() => {
    autoSuggestEnabledRef.current = autoSuggestEnabled;
  }, [autoSuggestEnabled]);

  useEffect(() => {
    lastSuggestionTimeRef.current = lastSuggestionTime;
  }, [lastSuggestionTime]);

  // Log pour debug
  useEffect(() => {
    if (address) {
      console.log("Address :", address);
    }
  }, [address]);

  /**
   * Récupère et traite la localisation
   */
  const getLocation = useCallback(async () => {
    try {
      setIsLoading(true);

      // Vérification des permissions
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(MESSAGES.PERMISSION_DENIED);
        return false;
      }

      // Récupération de la position
      const localisation = await getCurrentLocation();
      setLocation(localisation);

      // Récupération de l'adresse
      const addr = await getAddressFromCoords(
        localisation.coords.latitude,
        localisation.coords.longitude
      );
      setAddress(addr);

      // Annonce vocale
      announceAddress(addr.formattedAddress);

      // Gestion de l'auto-suggestion
      if (
        shouldTriggerAutoSuggest(
          autoSuggestEnabledRef.current,
          localisation.coords.speed,
          lastSuggestionTimeRef.current
        )
      ) {
        triggerAutoSuggest(
          localisation.coords.latitude,
          localisation.coords.longitude,
          setLastSuggestionTime
        );
      }

      // Envoi des données au serveur
      await submitLocationData(localisation.coords, addr);

      return true;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la localisation:",
        error
      );
      Alert.alert("Erreur", "Impossible de récupérer la localisation");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mise à jour périodique de la localisation
   */
  useEffect(() => {
    if (!gpsActive) return;

    const interval = setInterval(() => {
      getLocation();
    }, LOCATION_CONFIG.UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [gpsActive, getLocation]);

  /**
   * Active le GPS
   */
  const activateGPS = useCallback(async () => {
    if (gpsActive) return;

    const success = await getLocation();

    if (success) {
      Vibration.vibrate(VIBRATION_PATTERN);
      setGpsActive(true);
      Alert.alert(MESSAGES.GPS_ACTIVATED);
    }
  }, [gpsActive, getLocation]);

  /**
   * Désactive le GPS
   */
  const deactivateGPS = useCallback(() => {
    setLocation(null);
    setAddress(null);
    clearAnnouncedPlaces();
    setGpsActive(false);
    Alert.alert(MESSAGES.GPS_DEACTIVATED);
  }, []);

  /**
   * Active/désactive l'auto-suggestion
   */
  const toggleAutoSuggest = useCallback((value) => {
    setAutoSuggestEnabled(value);
    if (!value) {
      clearAnnouncedPlaces();
    }
  }, []);

  return {
    location,
    address,
    gpsActive,
    autoSuggestEnabled,
    isLoading,
    activateGPS,
    deactivateGPS,
    toggleAutoSuggest,
  };
};
