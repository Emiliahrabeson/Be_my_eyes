//boutton activation/desactivation

//Mioty
import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView} from "react-native";//Mioty3
import ActivityTracker from "../../components/ActivityTracker";

import { useRouter } from "expo-router"; //nav
//import { Button, View } from "react-native"; //nosoloiko an'io ambony io
import ControlButtons from "../../components/ControlButton"; //boutton active/desactive
import LocationDisplay from "../../components/LocationDisplay"; //juste un affichage de la localisation actuelle ee
import { useGuide } from "../../hooks/useGuide";
import { useLocation } from "../../hooks/useLocation"; //maka position actuelle pour le boutton activer
import { useDestination } from "./destinationContext"; //boite

//Mioty2 
import mqtt from "mqtt";


export default function HomeScreen() {
  const router = useRouter();
  const { location, address, gpsActive, activateGPS, deactivateGPS } =
    useLocation();

  const { destination, distance, destinationCoords } = useDestination(); //*************** distance tsy miasa
  const { currentDistance, announceNow } = useGuide(
    destination,
    destinationCoords
  );

//Mioty2
	//Etats pour Mqtt
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [mqttStatus, setMqttStatus] = useState("Connexion au broker ...");
	//Connexion MQTT
  useEffect(() => {
    const client = mqtt.connect("wss://broker.hivemq.com:8000/mqtt");

    client.on("connect", () => {
      setMqttStatus("✅ Connecté au broker MQTT !");
      client.subscribe("maison/Temperature", (err) => {
        if (!err) {
          console.log("Abonné au topic maison/Temperature");
        }
      });
    });

    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Reçu MQTT :", data);
        setTemperature(data.temperature);
        setHumidity(data.humidite);
      } catch (error) {
        console.error("Erreur parsing MQTT :", error);
      }
    });

    client.on("error", (err) => {
      console.log("Erreur MQTT :", err);
      setMqttStatus("❌ Erreur de connexion au broker");
    });
   return () => client.end();
  }, []);

  return (
    //Mioty3
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 15,
      }}
      showsVerticalScrollIndicator={false}
    >
    /*Titre principale*/
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>🏠 Accueil</Text>
    

      {/* <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      > */}
      
      /*Bouton de destination*/
      <Button
        title="entrer une destination"
        onPress={() => router.push("/(tabs)/Input")}
	      //Mioty3
	      color="#1976d2"
      />

      /*Section destination*/
      <View style={{ marginBottom: 20 }} />
      {destination && currentDistance && (
        <View
          style={{
	          marginTop: 20,
            padding: 15,
            backgroundColor: "#e3f2fd",
            borderRadius: 10,
            //marginBottom: 20,
            width: "90%",
          }}
        >
            {/* <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}> */}
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Destination: {destination}
          </Text>

          {/* <Text style={{ fontSize: 18, color: "#1976d2", marginBottom: 10 }}> */}
          <Text style={{ fontSize: 18, color: "#1976d2", marginVertical: 10 }}>  
            Distance: {currentDistance} km
          </Text>

          {/* Bouton pour annoncer la distance tout de suite */}
          <Button title="🔊 Annoncer distance maintenant" onPress={announceNow} />
        </View>
      )}

	    /*Control GPS*/
      {/* <View style={{ marginBottom: 20 }} /> */}
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
      
        {/* Mioty */}
        {/* <View style={{ marginTop: 30, width: "100%" }}>
          <ActivityTracker />
        </View> */}
      </View>

        ///Mioty2
	      //Mioty 3
	      //Donnees environnementales
      <View
        style={{
          marginTop: 30,
          backgroundColor: "#f1f8e9",
          padding: 15,
          borderRadius: 10,
          //alignItems: "center",
          width: "100%",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>
          🌿 Données environnementales
        </Text>
        {/* //<Text>{mqttStatus}</Text> */}
        <Text style={{ color: "#555" }}>{mqttStatus}</Text>
        <Text style={{ marginTop: 10 }}>
          🌡️ Température : {temperature ?? "--"} °C
        </Text>
        <Text>💧 Humidité : {humidity ?? "--"} %</Text>
      </View>

      <View style={{ marginTop: 30, width: "100%" }}>
        <ActivityTracker />
      </View>
	

    </ScrollView>
  );
}

//le tapoter 2x ...
//integration de données de Mioty
//intégration de données Ayan
//liaison avec l'app de Maharavo
//enregistrer un adresse
