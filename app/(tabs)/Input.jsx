import * as Location from "expo-location";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDestination } from "./destinationContext";

export default function Input() {
  const [destinationInput, setDestinationInput] = useState("");
  const [loading, setLoading] = useState(false);
  const monAddresse = [
    {
      maison: "Antsahamarina Ambohitrimanjaka Antananarivo Madagascar",
    },
    {
      Misa: "Université d'Antananarivo Ankatso Antananarivo Madagascar",
    },
    {
      cité: "CUR Ankatso II Antananarivo Madagascar",
    },
  ];

  const { setDestination, setDistance } = useDestination();
  const router = useRouter();

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

    const currentPosition = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const geocodedDestination = await Location.geocodeAsync(destinationInput);

    if (geocodedDestination.length === 0) {
      Alert.alert(
        "Erreur",
        "Destination introuvable. Essayez d'être plus précis."
      );
      setLoading(false);
      return;
    }

    const destCoords = geocodedDestination[0];

    const dist = calculateDistance(
      currentPosition.coords.latitude,
      currentPosition.coords.longitude,
      destCoords.latitude,
      destCoords.longitude
    );

    setDestination(destinationInput);
    setDistance(dist);

    Speech.speak(`Vous êtes à ${dist} kilomètres de ${destinationInput}`, {
      language: "fr-FR",
    });

    Alert.alert(
      "Distance calculée",
      `Il vous reste ${dist} km jusqu'à ${destinationInput}`,
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );

    setLoading(false);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Entrez votre destination :
      </Text>

      <TextInput
        value={destinationInput}
        onChangeText={setDestinationInput}
        placeholder="Ex: Antananarivo, Madagascar"
        style={{
          borderWidth: 1,
          width: "80%",
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
          borderColor: "#ccc",
        }}
        editable={!loading}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="Valider" onPress={handleValidate} />
      )}
    </View>
  );
}
