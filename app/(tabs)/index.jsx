import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import getSocket from "../../api/speech-websocket.js";
import "../../api/speech.api.js";
import ActivityTracker from "../../components/ActivityTracker";
import ControlButtons from "../../components/ControlButton";
import LocationDisplay from "../../components/LocationDisplay";
import MapCard from "../../components/useMap";
import { useLocation } from "../../hooks/useLocation";
import { useDestination } from "../contexts/destinationContext";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { location, address, gpsActive, activateGPS, deactivateGPS } =
    useLocation();

  const { destinationCoords } = useDestination();
  const [ultrason1, setUltrason1] = useState(null);
  const [ultrason2, setUltrason2] = useState(null);
  const [mqttStatus, setMqttStatus] = useState("Connexion au broker ...");

  useEffect(() => {
    const socket = getSocket();
    return () => {
      socket.off("custom_response");
    };
  }, []);

  // Connexion MQTT
  useEffect(() => {
    console.log("Tentative de connexion MQTT...");
    const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

    client.on("connect", () => {
      console.log("Connecté au broker ...!");
      setMqttStatus("✅ Connecté au broker MQTT !");
      client.subscribe("maison/Ultrasons", (err) => {
        if (err) console.log("Erreur d'abonnement: ", err);
        else console.log("Abonné au topic maison/Ultrasons");
      });
    });

    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Reçu MQTT :", data);
        setUltrason1(data.ultrason1);
        setUltrason2(data.ultrason2);
      } catch (error) {
        console.error("Erreur parsing MQTT :", error);
      }
    });

    client.on("error", (err) => {
      console.log("Erreur MQTT", err);
      console.log("Details MQTT:", JSON.stringify(err));
      setMqttStatus("❌ Erreur de connexion au broker");
    });

    client.on("close", () => {
      console.log("Connexion MQTT fermée!");
    });

    return () => client.end();
  }, []);

  useEffect(() => {
    const SEUIL_DISTANCE = 100;

    if (ultrason1 !== null && ultrason1 <= SEUIL_DISTANCE) {
      console.log("⚠️ Obstacle détecté à droite:", ultrason1, "cm");
      Vibration.vibrate(500);
    }

    if (ultrason2 !== null && ultrason2 <= SEUIL_DISTANCE) {
      console.log("⚠️ Obstacle détecté à gauche:", ultrason2, "cm");
      Vibration.vibrate([0, 500, 200, 500]);
    }
  }, [ultrason1, ultrason2]);

  return (
    <SafeAreaView style={{ flex: 2 }}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Navigation </Text>
            <Text style={styles.headerSubtitle}>
              {gpsActive ? "GPS Activé" : "GPS Désactivé"}
            </Text>
          </View>

          {/* Carte */}
          {gpsActive && location && (
            <View style={styles.mapContainer}>
              <MapCard
                location={location}
                destinationCoords={destinationCoords}
              />
            </View>
          )}

          {/* Bouton destination */}
          {gpsActive && (
            <View style={styles.buttonContainer}>
              <View style={styles.destinationButton}>
                <Button
                  title="📍 Entrer une destination"
                  onPress={() => router.push("/(tabs)/Input")}
                  color="#2196F3"
                />
              </View>
            </View>
          )}

          <View style={styles.controlSection}>
            <Text style={styles.sectionTitle}>Contrôle GPS</Text>
            <ControlButtons
              pressActive={activateGPS}
              pressDesactive={deactivateGPS}
            />
          </View>

          <View style={styles.locationSection}>
            <LocationDisplay
              address={address}
              gpsActive={gpsActive}
              textColor={colors.text}
            />
          </View>

          <View style={{ marginTop: 30, width: "100%" }}>
            <ActivityTracker />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 30,
    },
    header: {
      paddingTop: 20,
      paddingBottom: 15,
      alignItems: "center",
      backgroundColor: colors.primary || "#2196F3",
      marginHorizontal: -16,
      marginBottom: 20,
      paddingHorizontal: 16,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: "bold",
      color: "white",
      marginBottom: 5,
    },
    headerSubtitle: {
      fontSize: 14,
      color: "white",
      fontWeight: "500",
    },
    suggestionControl: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.card || "white",
      padding: 15,
      borderRadius: 12,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    suggestionInfo: {
      flex: 1,
    },
    suggestionLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    suggestionSubtext: {
      fontSize: 12,
      color: colors.text,
    },
    mapContainer: {
      marginBottom: 20,
      marginRight: -40,
      borderRadius: 15,
      shadowRadius: 4,
    },
    buttonContainer: {
      marginBottom: 20,
    },
    destinationButton: {
      borderRadius: 10,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    destinationCard: {
      backgroundColor: colors.card,
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: "#2196F3",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    controlSection: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
      marginLeft: 4,
    },
    locationSection: {
      marginBottom: 10,
    },
  });
