import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router"; //nav
import { useEffect } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import getSocket from "../../api/speech-websocket.js";
import "../../api/speech.api.js"; //websocket speech
import ControlButtons from "../../components/ControlButton"; //boutton active/desactive
import LocationDisplay from "../../components/LocationDisplay"; //juste un affichage de la localisation actuelle ee
import MapCard from "../../components/useMap"; //affichage de la carte
import { useLocation } from "../../hooks/useLocation"; //maka position actuelle pour le boutton activer
import { useDestination } from "../contexts/destinationContext";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const {
    location,
    address,
    gpsActive,
    activateGPS,
    deactivateGPS,
    autoSuggestEnabled,
    toggleAutoSuggest,
  } = useLocation();

  const { destinationCoords } = useDestination();
  // const { currentDistance, announceNow } = useGuide(
  //   destination,
  //   destinationCoords
  // );
  useEffect(() => {
    // Get the singleton socket instance
    const socket = getSocket();

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      socket.off("custom_response");
    };
  }, []);

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

          {/*suggestions  */}
          {gpsActive && (
            <View style={styles.suggestionControl}>
              <View style={styles.suggestionInfo}>
                <Text style={styles.suggestionLabel}>
                  🔔 Suggestions automatiques
                </Text>
                <Text style={styles.suggestionSubtext}>
                  {autoSuggestEnabled ? "Actives" : "Désactivées"}
                </Text>
              </View>
              <Switch
                value={autoSuggestEnabled}
                onValueChange={toggleAutoSuggest}
                trackColor={{ false: "#767577", true: "#4CAF50" }}
                thumbColor={autoSuggestEnabled ? "#fff" : "#f4f3f4"}
              />
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

    // Styles pour le switch
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
