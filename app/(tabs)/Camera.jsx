import { useTheme } from "@react-navigation/native";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function camera() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text style={styles.cameraTitle}>Camera</Text>
        <View style={styles.container}>
          <Text>Ceci est la page de la caméra</Text>
        </View>

        <Button title="Haut"></Button>
        <Button title="Droite"></Button>
        <Button title="Bas"></Button>
        <Button title="Gauche"></Button>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    cameraTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: colors.text,
    },
  });
