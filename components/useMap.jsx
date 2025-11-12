import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapCard = ({ location, destinationCoords }) => {
  console.log("DEST COORDS DANS MAP :", destinationCoords);
  // si pas de location
  const Antananarivo = {
    latitude: -18.8792,
    longitude: 47.5079,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const region = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : Antananarivo;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
      >
        {destinationCoords && (
          <Marker
            coordinate={{
              latitude: destinationCoords.latitude,
              longitude: destinationCoords.longitude,
            }}
            title="Destination"
            pinColor="red"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default MapCard;
