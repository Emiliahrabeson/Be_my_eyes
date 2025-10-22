import { Text, View } from "react-native";
import { useLocation } from "../../hooks/useLocation";
import { useVoice } from "../../hooks/useVoice";
import ControlButtons from "./components/ControlButton";
import LocationDisplay from "./components/LocationDisplay";

export default function HomeScreen() {
  const { location, address, gpsActive, activateGPS, deactivateGPS } =
    useLocation();

  const { spokenText, destination, handleVoiceCommand } = useVoice();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <ControlButtons
        pressActive={activateGPS}
        pressDesactive={deactivateGPS}
      />

      <LocationDisplay
        location={location}
        address={address}
        gpsActive={gpsActive}
      />

      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text>Vous avez dit : {spokenText}</Text>
        <Text>Destination : {destination}</Text>
      </View>
    </View>
  );
}
