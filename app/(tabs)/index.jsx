//Mioty
import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";//Mioty3
import ActivityTracker from "../../components/ActivityTracker";

import { useRouter } from "expo-router"; //nav
import ControlButtons from "../../components/ControlButton"; //boutton active/desactive
import LocationDisplay from "../../components/LocationDisplay"; //affichage localisation actuelle
import { useGuide } from "../../hooks/useGuide";
import { useLocation } from "../../hooks/useLocation"; //position actuelle
import { useDestination } from "./destinationContext"; //boite

//Mioty2 
import mqtt from "mqtt";


export default function HomeScreen() {
  const router = useRouter();
  const { location, address, gpsActive, activateGPS, deactivateGPS } =
    useLocation();

  const { destination, distance, destinationCoords } = useDestination();
  const { currentDistance, announceNow } = useGuide(
    destination,
    destinationCoords
  );

  //Mioty2
  // Etats pour Mqtt
  const [ultrason1, setUltrason1] = useState(null);
  const [ultrason2, setUltrason2] = useState(null);
  const [mqttStatus, setMqttStatus] = useState("Connexion au broker ...");

  //Connexion MQTT
  useEffect(() => {
    console.log("Tentative de connexion MQTT...");
    const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

    client.on("connect", () => {
      console.log("Connecté au broker ...!");
      setMqttStatus("✅ Connecté au broker MQTT !");
      client.subscribe("maison/Ultrasons", (err) => {
        if (err) console.log("Erreur d'abonnement: ", err);
        else console.log("Abonné au topic maison/Ultrasons");
      });
    });

    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Reçu MQTT :", data);
        setUltrason1(data.ultrason1);
        setUltrason2(data.ultrason2);
      } catch (error) {
        console.error("Erreur parsing MQTT :", error);
      }
    });

    client.on("error", (err) => {
      console.log("Erreur MQTT", err);
      console.log("Details MQTT:", JSON.stringify(err));
      setMqttStatus("❌ Erreur de connexion au broker");
    });

    client.on("close", () => {
      console.log("Connexion MQTT fermée!");
    });

    return () => client.end();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 15,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Titre principal */}
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>🏠 Accueil</Text>

      {/* Bouton de destination */}
      <Button
        title="entrer une destination"
        onPress={() => router.push("/(tabs)/Input")}
        color="#1976d2"
      />

      {/* Section destination */}
      <View style={{ marginBottom: 20 }} />
      {destination && currentDistance && (
        <View
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: "#e3f2fd",
            borderRadius: 10,
            width: "90%",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Destination: {destination}
          </Text>

          <Text style={{ fontSize: 18, color: "#1976d2", marginVertical: 10 }}>
            Distance: {currentDistance} km
          </Text>

          {/* Bouton pour annoncer la distance tout de suite */}
          <Button title="🔊 Annoncer distance maintenant" onPress={announceNow} />
        </View>
      )}

      {/* Control GPS */}
      <View style={{ marginTop: 30, width: "100%", alignItems: "center" }}>
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

      {/* Données environnementales (ici ultrasons) */}
      <View
        style={{
          marginTop: 30,
          backgroundColor: "#f1f8e9",
          padding: 15,
          borderRadius: 10,
          width: "100%",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>
          🌿 Données des ultrasons
        </Text>
        <Text style={{ color: "#555" }}>{mqttStatus}</Text>
        <Text style={{ marginTop: 10 }}>
          📏 Distance Ultrasons 1 : {ultrason1 ?? "--"} cm
        </Text>
        <Text>📏 Distance Ultrasons 2 : {ultrason2 ?? "--"} cm</Text>
      </View>

      <View style={{ marginTop: 30, width: "100%" }}>
        <ActivityTracker />
      </View>
    </ScrollView>
  );
}

