import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useWalking } from "../hooks/useWalking";

const MapCard = ({ location, destinationCoords }) => {
  const mapRef = useRef(null);
  const { routesCoords, isLoading, error } = useWalking(
    location,
    destinationCoords
  );

  console.log("DEST COORDS DANS MAP :", destinationCoords);
  console.log("useMap → location:", location ? "OK" : "null");
  console.log("useMap → destinationCoords:", destinationCoords);
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

  //zoom automatique
  useEffect(() => {
    if (routesCoords.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(routesCoords, {
        edgePadding: { top: 150, left: 100, bottom: 150, right: 100 },
        animated: true,
      });
    }
  }, [routesCoords]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        loadingEnabled={true}
      >
        {/* point rouge de la destination  */}
        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            title="Destination"
            pinColor="red"
            anchor={{ x: 0.5, y: 0.5 }}
          />
        )}

        {/* Chemin pieton vert  */}
        {routesCoords.length > 0 && (
          <>
            {/* Contour blanc */}
            <Polyline
              coordinates={routesCoords}
              strokeColor="#FFFFFF"
              strokeWidth={10}
              lineCap="round"
              lineJoin="round"
              zIndex={1}
            />
            {/* Ligne verte */}
            <Polyline
              coordinates={routesCoords}
              strokeColor="#00FF00"
              strokeWidth={7}
              lineCap="round"
              lineJoin="round"
              zIndex={2}
            />
          </>
        )}
      </MapView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Calcul du chemin piéton...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 350,
    borderRadius: 15,
    overflow: "hidden",
    marginVertical: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 8,
  },
  loadingText: {
    color: "#00FF00",
    fontWeight: "bold",
    textAlign: "center",
  },
  errorOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255,0,0,0.8)",
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MapCard;
