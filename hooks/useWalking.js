import { isLoading } from "expo-font";
import { useEffect, useState } from "react";

export const useWalking = (currentLocation, destinationCoords) => {
  const [routesCoords, setRoutesCoords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentLocation && !destinationCoords) {
      setRoutesCoords([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);

    const start_longitude = currentLocation.coords.longitude;
    const start_latitude = currentLocation.coords.latitude;
    const end_longitude = destinationCoords.longitude;
    const end_latitude = destinationCoords.latitude;

    const url = `http://router.project-osrm.org/route/v1/walking/${start_longitude},${start_latitude};${end_longitude},${end_latitude}?overview=full&geometries=geojson`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes[0]) {
          const coordonnees = data.routes[0].geometry.coordinates;
          const formatted = coordonnees.map(([long, lat]) => ({
            latitude: lat,
            longitude: long,
          }));
          setRoutesCoords(formatted);
        } else {
          setError("aucun chemin piéton trouvé");
        }
      })
      .catch((err) => {
        setError("Problème réseau");
        console.log("Erreur OSRM :", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentLocation, destinationCoords]);

  return { routesCoords, isLoading, error };
};
