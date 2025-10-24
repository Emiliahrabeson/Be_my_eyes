import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function Input() {
  const [destination, setDestination] = useState("");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Entrer votre destination : </Text>
      <TextInput
        value={destination}
        onChangeText={setDestination}
        placeholder="Votre destination"
        style={{
          borderWidth: 1,
          width: 200,
          padding: 8,
          borderRadius: 5,
          marginBottom: 10,
        }}
      />
      <Button title="valider" onPress={() => alert("hello")} />
    </View>
  );
}
