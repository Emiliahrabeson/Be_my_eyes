import { useRouter } from "expo-router";
import { Button, View } from "react-native";
import ControlButtons from "../../components/ControlButton";
import LocationDisplay from "../../components/LocationDisplay";
import { useLocation } from "../../hooks/useLocation";

export default function HomeScreen() {
  const router = useRouter();
  const { location, address, gpsActive, activateGPS, deactivateGPS } =
    useLocation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Button title="Passer" onPress={() => router.push("/(tabs)/Input")} />

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
