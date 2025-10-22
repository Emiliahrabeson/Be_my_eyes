import { Button, View } from "react-native";

export default function ControlButton({ pressActive, pressDesactive }) {
  return (
    <View>
      <Button
        title="Activer"
        onPress={() => {
          pressActive();
        }}
      />
      <View style={{ marginBottom: 20 }} />
      <Button title="Désactiver" onPress={pressDesactive} />
    </View>
  );
}
