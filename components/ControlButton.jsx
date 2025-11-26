import React from "react";
import { Button, StyleSheet, View } from "react-native";

export default function ControlButtons({ pressActive, pressDesactive }) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <Button
          title="Activer GPS"
          onPress={() => {
            try {
              pressActive?.(); // Vérifie que la fonction existe
            } catch (err) {
              console.error("Erreur activation GPS:", err);
            }
          }}
          color="#4CAF50"
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Désactiver GPS"
          onPress={() => {
            try {
              pressDesactive?.();
            } catch (err) {
              console.error("Erreur désactivation GPS:", err);
            }
          }}
          color="#F44336"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    zIndex: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
    zIndex: 10,
  },
});
