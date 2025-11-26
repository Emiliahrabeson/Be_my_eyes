import { useRouter } from "expo-router"; //nav
import {
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import ControlButtons from "../../components/ControlButton"; //boutton active/desactive
import LocationDisplay from "../../components/LocationDisplay"; //juste un affichage de la localisation actuelle ee
import MapCard from "../../components/useMap"; //affichage de la carte
import { useGuide } from "../../hooks/useGuide"; //il vous reste...
import { useLocation } from "../../hooks/useLocation"; //maka position actuelle pour le boutton activer
import { useDestination } from "../contexts/destinationContext";

export default function HomeScreen() {
  const router = useRouter();
  const {
    location,
    address,
    gpsActive,
    activateGPS,
    deactivateGPS,
    autoSuggestEnabled,
    toggleAutoSuggest,
  } = useLocation();

  const { destination, distance, destinationCoords } = useDestination();
  const { currentDistance, announceNow } = useGuide(
    destination,
    destinationCoords
  );

  return (
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
        <View style={styles.buttonContainer}>
          <View style={styles.destinationButton}>
            <Button
              title="📍 Entrer une destination"
              onPress={() => router.push("/(tabs)/Input")}
              color="#2196F3"
            />
          </View>
        </View>

        {/*suggestions  */}
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

        {/* Informations destination */}
        {destination && currentDistance && (
          <View style={styles.destinationCard}>
            <View style={styles.destinationHeader}>
              <Text style={styles.destinationIcon}>🎯</Text>
              <View style={styles.destinationInfo}>
                <Text style={styles.destinationLabel}>Destination</Text>
                <Text style={styles.destinationName}>{destination}</Text>
              </View>
            </View>

            <View style={styles.distanceContainer}>
              <Text style={styles.distanceIcon}>📏</Text>
              <View>
                <Text style={styles.distanceLabel}>Distance restante</Text>
                <Text style={styles.distanceValue}>{currentDistance} km</Text>
              </View>
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
            location={location}
            address={address}
            gpsActive={gpsActive}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: "center",
    backgroundColor: "#2196F3",
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
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },

  // ✨ NOUVEAU : Styles pour le switch
  suggestionControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
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
    color: "#333",
    marginBottom: 4,
  },
  suggestionSubtext: {
    fontSize: 12,
    color: "#757575",
  },

  mapContainer: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
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
    backgroundColor: "white",
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
  destinationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  destinationIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationLabel: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  distanceLabel: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 4,
  },
  distanceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
  },
  announceButton: {
    marginTop: 15,
    borderRadius: 8,
    overflow: "hidden",
  },
  controlSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#424242",
    marginBottom: 12,
    marginLeft: 4,
  },
  locationSection: {
    marginBottom: 10,
  },
});
