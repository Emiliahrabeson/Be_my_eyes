//entrer destination

import { useTheme } from "@react-navigation/native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDestination } from "../contexts/destinationContext";

export default function Input() {
  const [destinationInput, setDestinationInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { setDestination, setDistance, setDestinationCoords } =
    useDestination();

  //calcul de distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
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

  // validation input
  const handleValidate = async () => {
    if (destinationInput.trim() === "") {
      Alert.alert("Erreur", "Veuillez entrer une destination");
      return;
    }

    setLoading(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Erreur", "Permission refusée");
      setLoading(false);
      return;
    }

    const localisation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High, //plus precis
    });

    const addr_dest_Input = await Location.geocodeAsync(destinationInput); //maka lat/long anle destinationInput

    if (addr_dest_Input.length === 0) {
      Alert.alert(
        "Erreur",
        "Destination introuvable. Essayez d'être plus précis."
      );
      setLoading(false);
      return;
    }

    const destination_address = addr_dest_Input[0];

    const dist = calculateDistance(
      localisation.coords.latitude,
      localisation.coords.longitude,
      destination_address.latitude,
      destination_address.longitude
    );

    setDestination(destinationInput);
    setDistance(dist);
    setDestinationCoords({
      latitude: destination_address.latitude,
      longitude: destination_address.longitude,
    });

    Speech.speak(`Vous êtes à ${dist} kilomètres de ${destinationInput}`, {
      language: "fr-FR",
    });

    if (dist <= 0.4) {
      Speech.speak("Vous êtes arrivé !", { language: "fr-FR" });
    }

    setLoading(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Entrez votre destination :</Text>

      <TextInput
        value={destinationInput}
        onChangeText={setDestinationInput}
        placeholder="Ex: Antananarivo, Madagascar"
        placeholderTextColor={colors.placeholder || "#999"}
        style={styles.input}
        editable={!loading}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary || "#007AFF"} />
      ) : (
        <Button title="Valider" onPress={handleValidate} />
      )}
    </View>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    input: {
      borderWidth: 1,
      width: "80%",
      padding: 10,
      borderRadius: 5,
      marginBottom: 20,
      borderColor: colors.border || "#ccc",
      backgroundColor: colors.card || "#fff",
      color: colors.text,
    },
    text: {
      fontSize: 18,
      marginBottom: 20,
      color: colors.text,
    },
  });
