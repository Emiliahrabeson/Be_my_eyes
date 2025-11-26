// avec ligne verte => chemin des piétons vers la destination

import { useEffect, useState } from "react";

export const useWalking = (currentLocation, destinationCoords) => {
  const [routesCoords, setRoutesCoords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentLocation || !destinationCoords) {
      setRoutesCoords([]);
      setError(null);
      setIsLoading(false);
      return;
    }
    if (
      !destinationCoords ||
      !destinationCoords.latitude ||
      !destinationCoords.longitude
    ) {
      setRouteCoords([]);
      setError(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    const start_longitude = currentLocation.coords.longitude;
    const start_latitude = currentLocation.coords.latitude;
    const end_longitude = destinationCoords.longitude;
    const end_latitude = destinationCoords.latitude;

    const url = `https://router.project-osrm.org/route/v1/walking/${start_longitude},${start_latitude};${end_longitude},${end_latitude}?overview=full&geometries=geojson&alternatives=true&steps=true&annotations=true&continue_straight=false`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes[0]) {
          const coordonnees = data.routes[0].geometry.coordinates;
          // FORCER LE DÉBUT EXACT SUR TA POSITION
          coordonnees[0] = [start_longitude, start_latitude];

          // FORCER LA FIN EXACTE SUR LE POINT ROUGE
          coordonnees[coordonnees.length - 1] = [end_longitude, end_latitude];
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
        console.log("Erreur OpenStreetMap :", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentLocation, destinationCoords]);

  return { routesCoords, isLoading, error };
};
