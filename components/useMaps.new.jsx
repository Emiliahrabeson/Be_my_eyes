// affichage de la carte
// point bleu => localisation actuelle
// pointe rouge => destination
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { useWalking } from "../hooks/useWalking";

const MapCard = ({ location, destinationCoords }) => {
  const mapRef = useRef(null);
  const { routesCoords, isLoading, error } = useWalking(
    location,
    destinationCoords
  );
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);

  // LOGS DE DEBUG
  useEffect(() => {
    console.log("=== DEBUG MAP OSM ===");
    console.log(
      "Location:",
      location
        ? `✅ (${location.coords.latitude}, ${location.coords.longitude})`
        : "❌"
    );
    console.log(
      "DestinationCoords:",
      destinationCoords
        ? `✅ (${destinationCoords.latitude}, ${destinationCoords.longitude})`
        : "❌"
    );
    console.log("RouteCoords:", routesCoords.length, "points");
    console.log("IsLoading:", isLoading);
    console.log("Error:", error);
    console.log("Map Ready:", mapReady);
    console.log("Map Error:", mapError);
    console.log("====================");
  }, [
    location,
    destinationCoords,
    routesCoords,
    isLoading,
    error,
    mapReady,
    mapError,
  ]);

  const Antananarivo = {
    latitude: -18.8792,
    longitude: 47.5079,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const region = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : Antananarivo;

  // Zoom automatique sur l'itinéraire
  useEffect(() => {
    if (routesCoords.length > 0 && mapRef.current && mapReady) {
      console.log("🔍 Zoom automatique sur itinéraire");
      setTimeout(() => {
        mapRef.current.fitToCoordinates(routesCoords, {
          edgePadding: { top: 100, left: 100, bottom: 100, right: 100 },
          animated: true,
        });
      }, 500);
    }
  }, [routesCoords, mapReady]);

  // Si pas de location, afficher un message
  if (!location) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholderContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.placeholderText}>
            🛰️ En attente de la localisation GPS...
          </Text>
          <Text style={styles.placeholderSubtext}>
            Activez le GPS dans les paramètres
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Indicateur de chargement initial */}
      {!mapReady && (
        <View style={styles.mapLoadingOverlay}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingBigText}>Chargement de la carte...</Text>
        </View>
      )}

      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT} // Utilise le provider par défaut (OSM sur Android si pas de Google Play Services)
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        showsScale={true}
        loadingEnabled={true}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
        onMapReady={() => {
          console.log("✅ Carte chargée et prête");
          setMapReady(true);
        }}
        onError={(e) => {
          const errorMsg = e.nativeEvent?.message || JSON.stringify(e);
          console.error("❌ Erreur MapView:", errorMsg);
          setMapError(errorMsg);
        }}
        onLayout={() => {
          console.log("📐 MapView layout OK");
        }}
      >
        {/* Marker position actuelle (bleu) */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Vous êtes ici"
            description={`${location.coords.latitude.toFixed(
              6
            )}, ${location.coords.longitude.toFixed(6)}`}
            pinColor="blue"
          />
        )}

        {/* Marker destination (rouge) */}
        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            title="Destination"
            description={`${destinationCoords.latitude.toFixed(
              6
            )}, ${destinationCoords.longitude.toFixed(6)}`}
            pinColor="red"
          />
        )}

        {/* Ligne de l'itinéraire (vert) */}
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

      {/* Overlay : calcul de l'itinéraire */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#00FF00" />
          <Text style={styles.loadingText}>Calcul du chemin piéton...</Text>
        </View>
      )}

      {/* Overlay : erreur */}
      {(error || mapError) && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>⚠️ {error || mapError}</Text>
          {mapError && (
            <Text style={styles.errorSubtext}>
              Vérifiez votre connexion internet
            </Text>
          )}
        </View>
      )}

      {/* Barre de debug en bas */}
      <View style={styles.debugBar}>
        <Text style={styles.debugText}>
          📍 GPS: {location ? "✅" : "❌"} | 🗺️ Carte: {mapReady ? "✅" : "⏳"}{" "}
          | 🛤️ Points: {routesCoords.length}
        </Text>
      </View>
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
    backgroundColor: "#E8E8E8",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  placeholderText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  placeholderSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  mapLoadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingBigText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#2196F3",
  },
  loadingOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "#00FF00",
    fontWeight: "bold",
    fontSize: 14,
  },
  errorOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(244, 67, 54, 0.9)",
    padding: 15,
    borderRadius: 8,
  },
  errorText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 5,
  },
  errorSubtext: {
    color: "white",
    textAlign: "center",
    fontSize: 12,
  },
  debugBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  debugText: {
    color: "white",
    fontSize: 11,
    textAlign: "center",
    fontFamily: "monospace",
  },
});

export default MapCard;
