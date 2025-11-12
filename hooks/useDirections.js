import polyline from "@mapbox/polyline";
import { useEffect, useState } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyDZ00jNRl - wXcs7o38gy_2Ypfr4AwfPS68"; // Remplacez par votre clé

export const useDirections = (origin, destination) => {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!origin || !destination) {
      setRouteCoordinates([]);
      return;
    }

    const fetchDirections = async () => {
      setLoading(true);
      setError(null);

      try {
        const originStr = `${origin.latitude},${origin.longitude}`;
        const destinationStr = `${destination.latitude},${destination.longitude}`;

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK" && data.routes.length > 0) {
          const points = polyline.decode(
            data.routes[0].overview_polyline.points
          );
          const coords = points.map((point) => ({
            latitude: point[0],
            longitude: point[1],
          }));
          setRouteCoordinates(coords);
        } else {
          setError("Impossible de trouver un itinéraire");
          setRouteCoordinates([]);
        }
      } catch (err) {
        setError("Erreur lors de la récupération de l'itinéraire");
        console.error(err);
        setRouteCoordinates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDirections();
  }, [origin, destination]);

  return { routeCoordinates, loading, error };
};
