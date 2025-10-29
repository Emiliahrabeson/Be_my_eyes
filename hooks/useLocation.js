import * as Location from "expo-location";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [gpsActive, setGpsActive] = useState(false);

  useEffect(() => {
    if (gpsActive) {
      const interval = setInterval(() => {
        //active tous les 10mins
        pressActive();
      }, 600000);
      return () => clearInterval(interval);
    }
  }, [gpsActive]);

  const pressActive = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync(); //demande permission

    if (status !== "granted") {
      Alert.alert("Permission refusée");
      return;
    }

    const localisation = await Location.getCurrentPositionAsync({
      //recup position
      accuracy: Location.Accuracy.Highest,
    });

    console.log("Position :", localisation);
    setLocation(localisation);

    //mamadika long/lat ho adresse
    const addr = await Location.reverseGeocodeAsync({
      latitude: localisation.coords.latitude,
      longitude: localisation.coords.longitude,
    });

    setAddress(addr[0]);
    console.log(" Adresse:", addr[0]);

    setTimeout(
      () =>
        Speech.speak(`vous etes à ${addr[0].formattedAddress}`, {
          //formattedAdress le adresse plus precis
          language: "mg-MG",
        }),
      3000
    );

    setGpsActive(true);
    Alert.alert("GPS activé !");
  };

  const pressDesactive = () => {
    setLocation(null);
    setAddress(null);
    setGpsActive(false);
    Alert.alert("GPS désactivé !");
  };

  return {
    location,
    address,
    gpsActive,
    activateGPS: pressActive,
    deactivateGPS: pressDesactive,
  };
};
