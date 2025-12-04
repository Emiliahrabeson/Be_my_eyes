import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { Pedometer } from "expo-sensors";
import {sendStepToServer} from "../api/step.api.js"

export default function ActivityTracker() {
  const [steps, setSteps] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [calories, setCalories] = useState(0);
  const [date, setDate] = useState(new Date().toDateString());

  // --- Compteur de pas ---
  useEffect(() => {
    let subscription;
    const subscribe = async () => {
      const available = await Pedometer.isAvailableAsync();
      console.log("Podomètre disponible ?", available);
      if (available) {
        subscription = Pedometer.watchStepCount(result => {
          setSteps(result.steps);
        });
      } else {
        console.log("Podomètre non disponible");
      }
    };
    subscribe();
    return () => subscription && subscription.remove();
  }, []);

  // --- Vitesse GPS ---
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission GPS refusée");
        return;
      }
      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (loc) => {
          const speedKmh = loc.coords.speed ? loc.coords.speed * 3.6 : 0;
          setSpeed(speedKmh.toFixed(2));
        }
      );
    })();
  }, []);

  // --- Calcul des calories ---
  useEffect(() => {
    const caloriesBrulees = steps * 0.04;
    setCalories(caloriesBrulees.toFixed(1));
  }, [steps]);

  // --- Réinitialisation quotidienne ---
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toDateString();
      if (today !== date) {
        setSteps(0);
        setCalories(0);
        setDate(today);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [date]);

  // --- Log des données (remplace l'envoi au serveur) ---
  useEffect(() => {
    console.log(' Données d\'activité:', { steps, calories, speed });
    sendStepToServer({ step : steps, calories, speed});
  }, [steps, speed, date]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Suivi d'activité</Text>
      <Text style={styles.text}>👣 Pas : {steps}</Text>
      <Text style={styles.text}>⚡ Vitesse : {speed} km/h</Text>
      <Text style={styles.text}>🔥 Calories : {calories} kcal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1976d2",
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
    color: "#333",
  },
});
