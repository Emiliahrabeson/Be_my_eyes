//boutton activation/desactivation

import { useRouter } from "expo-router"; //nav
import { Button, View } from "react-native";
import ControlButtons from "../../components/ControlButton"; //boutton active/desactive
import LocationDisplay from "../../components/LocationDisplay"; //juste un affichage de la localisation actuelle ee
import { useGuide } from "../../hooks/useGuide";
import { useLocation } from "../../hooks/useLocation"; //maka position actuelle pour le boutton activer
import { useDestination } from "./destinationContext"; //boite

export default function HomeScreen() {
  const router = useRouter();
  const { location, address, gpsActive, activateGPS, deactivateGPS } =
    useLocation();

  const { destination, distance, destinationCoords } = useDestination();
  const { currentDistance, announceNow } = useGuide(
    destination,
    destinationCoords
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Button
        title="entrer une destination"
        onPress={() => router.push("/(tabs)/Input")}
      />

      <View style={{ marginBottom: 20 }} />
      {destination && currentDistance && (
        <View
          style={{
            padding: 15,
            backgroundColor: "#e3f2fd",
            borderRadius: 10,
            marginBottom: 20,
            width: "90%",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
            Destination: {destination}
          </Text>

          <Text style={{ fontSize: 18, color: "#1976d2", marginBottom: 10 }}>
            Distance: {currentDistance} km
          </Text>
        </View>
      )}
      <View style={{ marginBottom: 20 }} />
      <ControlButtons
        pressActive={activateGPS}
        pressDesactive={deactivateGPS}
      />
      <LocationDisplay
        location={location}
        address={address}
        gpsActive={gpsActive}
      />
    </View>
  );
}

//integration de données de Mioty
//intégration de données Ayan (obstacle,escalier)
//liaison avec l'app de Maharavo
//enregistrer un adresse
