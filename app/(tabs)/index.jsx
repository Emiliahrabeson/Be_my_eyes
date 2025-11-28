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
import mqtt from "mqtt/dist/mqtt";


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
//Mioty5
  const [ultrason1, setUltrason1] = useState(null);
  const [ultrason2, setUltrason2] = useState(null);

  const [mqttStatus, setMqttStatus] = useState("Connexion au broker ...");
	//Connexion MQTT
  useEffect(() => {

    console.log("Tentative de connexion MQTT...");
    const client = mqtt.connect("ws://192.168.1.171:9001");

    client.on("connect", () => {
      console.log("Connecte au broker Mosquitto ...!");
      setMqttStatus("✅ Connecté au broker Mosquitto !");
      client.subscribe("maison/Capteurs", (err) => {
        if (err) console.log("Erreur d'abonnement: ", err);
	else  console.log("Abonné a maison/Capteurs");
      });
    });
    client.on("error", (err) => {
      console.log("Erreur MQTT", err);
      //console.log("Details MQTT:", JSON.stringify(err));
      setMqttStatus("❌ Erreur de connexion au broker");
    });
    client.on("reconnect", () => {
      console.log("### RECONNEXION MQTT ###");
    });


    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Reçu MQTT :", data);
        if ("temperature" in data) setTemperature(data.temperature);
        if ("humidite" in data) setHumidity(data.humidite);
        if ("ultrason1" in data) setUltrason1(data.ultrason1);
        if ("ultrason2" in data) setUltrason2(data.ultrason2);
	//setTemperature(data.temperature);
        //setHumidity(data.humidite);
      } catch (error) {
        console.error("Erreur parsing MQTT :", error);
      }
    });

    

    
    client.on("close", () => {
	    console.log("MQTT deconnecte !");
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
        


        <Text style={{ marginTop: 10 }}>
	  📏 Distance Ultrason 1 : {ultrason1 ?? "--"} cm
	</Text>
        <Text>📏 Distance Ultrason 2 : {ultrason2 ?? "--"} cm</Text>
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

