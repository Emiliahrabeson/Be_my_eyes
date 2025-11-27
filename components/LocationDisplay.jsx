import { Text, View } from "react-native";

export default function LocationDisplay({ address, gpsActive, textColor }) {
  if (!gpsActive) {
    return <Text>GPS inactif</Text>;
  }

  return (
    <View style={{ marginTop: 20, alignItems: "center" }}>
      {address && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ color: textColor || "#000" }}>
            Adresse : {address.formattedAddress}
          </Text>
        </View>
      )}
    </View>
  );
}
