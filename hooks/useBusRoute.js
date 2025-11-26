import { useEffect, useState } from "react";

// export const useBusRoute = (currentLocation, destinationCoords) => {
//   const [busRoute, setBusRoute] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!currentLocation || !destinationCoords) {
//       setBusRoute([]);
//       setError(null);
//       setIsLoading(false);
//       return;
//     }
//     setIsLoading(true);
//     setError(null);

//     const start_longitude = currentLocation.coords.longitude;
//     const start_latitude = currentLocation.coords.latitude;
//     const end_longitude = destinationCoords.longitude;
//     const end_latitude = destinationCoords.latitude;

//     const url = `https://router.project-osrm.org/route/v1/walking/${start_longitude},${start_latitude};${end_longitude},${end_latitude}?overview=full&geometries=geojson&alternatives=true&steps=true&annotations=true&continue_straight=false`;
//     fetch(url)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.routes && data.routes[0]) {
//           const coordonnees = data.routes[0].geometry.coordinates;

//           coordonnees[0] = [start_longitude, start_latitude];
//           coordonnees[coordonnees.length - 1] = [end_longitude, end_latitude];

//           const formatted = coordonnees.map(([long, lat]) => ({
//             latitude: lat,
//             longitude: long,
//           }));
//           setBusRoute(formatted);
//         } else {
//           setError("aucun chemin de bus trouvé");
//         }
//       })
//       .catch((err) => {
//         setError("Problème réseau");
//         console.log("Erreur OpenStreetMap :", err);
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, [currentLocation, destinationCoords]);

//   return { busRoute, isLoading, error };
// };

export const useBusRoute = (location, destinationCoords) => {
  const [busRoute, setBusRoute] = useState([]);
  const [enChargement, setEnChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    console.log(" useBusRoute appelé");
    console.log("location:", location ? "OK" : "null");
    console.log(" destinationCoords:", destinationCoords);

    // Vérifications de base
    if (!location || !destinationCoords) {
      console.log(" Pas de location ou destination");
      setBusRoute([]);
      return;
    }

    const fetchBusRoute = async () => {
      try {
        setEnChargement(true);
        setErreur(null);
        console.log("🚌 Début du fetch...");

        const startLon = location.coords.longitude;
        const startLat = location.coords.latitude;
        const endLon = destinationCoords.longitude;
        const endLat = destinationCoords.latitude;

        const url = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`;

        console.log("🚌 URL OSRM:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        console.log("🚌 Response OSRM:", data);

        if (!data.routes || data.routes.length === 0) {
          throw new Error("Aucun trajet trouvé");
        }

        const coordinates = data.routes[0].geometry.coordinates.map(
          (coord) => ({
            latitude: coord[1],
            longitude: coord[0],
          })
        );

        console.log(" Nombre de points extraits:", coordinates.length);
        console.log(" Premier point:", coordinates[0]);
        console.log(" Dernier point:", coordinates[coordinates.length - 1]);

        if (coordinates.length === 0) {
          throw new Error("Aucune coordonnée extraite");
        }

        const routeWithEndpoints = [
          { latitude: startLat, longitude: startLon },
          ...coordinates,
          { latitude: endLat, longitude: endLon },
        ];

        console.log(" Total avec endpoints:", routeWithEndpoints.length);

        setBusRoute(routeWithEndpoints);
        setEnChargement(false);
        console.log("Trajet chargé avec succès!");
      } catch (error) {
        console.error("Erreur:", error);
        setErreur(error.message);
        setEnChargement(false);
        setBusRoute([]);
      }
    };

    fetchBusRoute();
  }, [location, destinationCoords]);

  return { busRoute, enChargement, erreur };
};
// tester la ligne bleu chemin des bus
//npm install react-native
