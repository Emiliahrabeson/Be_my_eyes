import { Text, View } from "react-native";

export default function LocationDisplay({ location, address, gpsActive }) {
  if (!gpsActive) {
    return <Text>GPS inactif</Text>;
  }

  return (
    <View style={{ marginTop: 20, alignItems: "center" }}>
      <Text>Latitude: {location.coords.latitude}</Text>
      <Text>Longitude: {location.coords.longitude}</Text>

      {address && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text>Adresse : {address.formattedAddress}</Text>
        </View>
      )}
    </View>
  );
}
