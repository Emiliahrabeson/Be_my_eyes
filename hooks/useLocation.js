import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Vibration } from "react-native";
import {
  LOCATION_CONFIG,
  MESSAGES,
  VIBRATION_PATTERN,
} from "../constants/location.constants";
import {
  announceAddress,
  getAddressFromCoords,
  getCurrentLocation,
  requestLocationPermission,
  submitLocationData,
} from "../service/location.service";
export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [gpsActive, setGpsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  return {
    location,
    address,
    gpsActive,
    isLoading,
    activateGPS,
    deactivateGPS,
  };
};
