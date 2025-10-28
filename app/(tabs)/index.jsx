import { useRouter } from "expo-router";
import { Button, View } from "react-native";
import ControlButtons from "../../components/ControlButton";
import LocationDisplay from "../../components/LocationDisplay";
import { useLocation } from "../../hooks/useLocation";
import { useDestination } from "./destinationContext";

export default function HomeScreen() {
  const router = useRouter();
  const { location, address, gpsActive, activateGPS, deactivateGPS } =
    useLocation();

  const { destination, distance } = useDestination();

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

      {/* {destination && distance && (
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
          <Text style={{ fontSize: 18, color: "#1976d2" }}>
            Distance: {distance} km
          </Text>
        </View>
      )} */}

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
