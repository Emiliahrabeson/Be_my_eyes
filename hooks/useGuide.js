// Arrivé ou non,il vous reste ...km jusqu'à ...
// mise à jour tous les

// import * as Location from "expo-location";
// import * as Speech from "expo-speech";
// import { useEffect, useRef, useState } from "react";
// import { Vibration } from "react-native";

// export function useGuide(destination, destinationCoords) {
//   const [distance_courant, setDistance_courant] = useState(null);
//   const intervalRef = useRef(null); //timer
//   const derniere_annonceRef = useRef(0); //quand (dernier_annonce)

//   //calcul de distance
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371;
//     //fonction de Haversine
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;

//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;

//     return distance.toFixed(2);
//   };

//   const checkAnnonce = async () => {
//     if (!destinationCoords) return;

//     const localisation = await Location.getCurrentPositionAsync({
//       accuracy: Location.Accuracy.High, //plus precis
//     });

//     const dist = calculateDistance(
//       localisation.coords.latitude,
//       localisation.coords.longitude,
//       destinationCoords.latitude,
//       destinationCoords.longitude
//     );

//     setDistance_courant(dist);

//     const now = Date.now();
//     console.log(now);

//     const temps_since_dernier = now - derniere_annonceRef.current;

//     if (temps_since_dernier >= 300000) {
//       if (dist <= 0.05) {
//         Speech.speak("Vous êtes arrivé", { language: "fr-FR" });
//         Vibration.vibrate([0, 500, 200, 500, 200, 500]); // Vibre fort 3 fois
//         stopGuide();
//       } else if (dist <= 0.1) {
//         Speech.speak(`Il vous reste ${dist} kilomètres`, {
//           language: "fr-FR",
//         });
//         Vibration.vibrate([0, 200, 100, 200, 100, 200]); // Vibre 3 fois
//       } else if (dist <= 0.5) {
//         Speech.speak(`Il vous reste 500 mètres`, { language: "fr-FR" });
//         Vibration.vibrate([0, 200, 100, 200]); // Vibre 2 fois
//       } else {
//         Speech.speak(
//           `Il vous reste ${dist} kilomètres jusqu'à ${destination}`,
//           { language: "fr-FR" }
//         );
//       }
//     }
//     derniere_annonceRef.current = now;
//   };

//   const startGuide = () => {
//     if (intervalRef.current) return;

//     checkAnnonce();

//     intervalRef.current = setInterval(() => {
//       checkAnnonce();
//     }, 30000);
//   };

//   const stopGuide = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current); // Arrêter le timer
//       intervalRef.current = null;
//     }
//   };

//   // Quand le composant est détruit, arrêter le guidage
//   useEffect(() => {
//     return () => stopGuide();
//   }, []);

//   useEffect(() => {
//     if (destination && destinationCoords) {
//       startGuide();
//     } else {
//       stopGuide();
//     }
//   }, [destination, destinationCoords]);

//   return {
//     distance_courant,
//     startGuide,
//     stopGuide,
//     announceNow: checkAnnonce,
//   };
// }

//µ**********

import * as Location from "expo-location";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import { Vibration } from "react-native";

export function useGuide(destination, destinationCoords) {
  const [distance_courant, setDistance_courant] = useState(null);
  const [route, setRoute] = useState(null);
  const [steps, setSteps] = useState([]); // Instructions de navigation
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [nextWaypoint, setNextWaypoint] = useState(null);
  const [heading, setHeading] = useState(0); // Direction actuelle
  const intervalRef = useRef(null);
  const derniere_annonceRef = useRef(0);
  const derniere_directionRef = useRef(null);

  // Récupérer l'itinéraire depuis OSRM (OpenStreetMap)
  const fetchRoute = async (startLat, startLon, endLat, endLon) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/walking/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson&steps=true&annotations=true`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const route = data.routes[0];

        // Extraire les coordonnées
        const coordinates = route.geometry.coordinates;
        const routePoints = coordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));

        // Extraire les instructions de navigation (steps)
        const navigationSteps = route.legs[0].steps.map((step) => {
          // Traduire les instructions OSRM en français
          let instruction = "";
          const maneuver = step.maneuver;

          switch (maneuver.type) {
            case "depart":
              instruction = "Départ";
              break;
            case "turn":
              if (maneuver.modifier === "left") {
                instruction = "Tournez à gauche";
              } else if (maneuver.modifier === "right") {
                instruction = "Tournez à droite";
              } else if (maneuver.modifier === "slight left") {
                instruction = "Tournez légèrement à gauche";
              } else if (maneuver.modifier === "slight right") {
                instruction = "Tournez légèrement à droite";
              } else if (maneuver.modifier === "sharp left") {
                instruction = "Tournez fortement à gauche";
              } else if (maneuver.modifier === "sharp right") {
                instruction = "Tournez fortement à droite";
              } else {
                instruction = "Continuez";
              }
              break;
            case "continue":
              instruction = "Continuez tout droit";
              break;
            case "arrive":
              instruction = "Vous êtes arrivé à destination";
              break;
            case "roundabout":
              instruction = "Prenez le rond-point";
              break;
            default:
              instruction = "Continuez";
          }

          // Ajouter le nom de la rue si disponible
          if (step.name && step.name !== "") {
            instruction += ` sur ${step.name}`;
          }

          return {
            instruction,
            distance: step.distance, // en mètres
            location: {
              latitude: step.maneuver.location[1],
              longitude: step.maneuver.location[0],
            },
          };
        });

        setRoute(routePoints);
        setSteps(navigationSteps);
        setCurrentStepIndex(0);

        if (routePoints.length > 1) {
          setNextWaypoint(routePoints[1]);
        }

        console.log("✅ Itinéraire chargé:", navigationSteps.length, "étapes");
        return routePoints;
      }
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération de l'itinéraire:",
        error
      );
      return null;
    }
  };

  // Calcul de distance (Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calcul de l'azimut (bearing)
  const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
    const x =
      Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
      Math.sin((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.cos(dLon);

    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360;
    return bearing;
  };

  // Trouver le prochain waypoint sur l'itinéraire
  const findNextWaypoint = (currentLat, currentLon, routePoints) => {
    let minDist = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < routePoints.length; i++) {
      const dist = calculateDistance(
        currentLat,
        currentLon,
        routePoints[i].latitude,
        routePoints[i].longitude
      );
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    }

    // Chercher un point 50m devant pour avoir une direction claire
    let targetIndex = closestIndex;
    for (let i = closestIndex + 1; i < routePoints.length; i++) {
      const distToPoint = calculateDistance(
        currentLat,
        currentLon,
        routePoints[i].latitude,
        routePoints[i].longitude
      );
      if (distToPoint >= 0.05) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex < routePoints.length) {
      return routePoints[targetIndex];
    }
    return routePoints[routePoints.length - 1];
  };

  // Vérifier si l'utilisateur a atteint l'étape actuelle
  const checkStepCompletion = (currentLat, currentLon) => {
    if (!steps[currentStepIndex]) return;

    const distToStep = calculateDistance(
      currentLat,
      currentLon,
      steps[currentStepIndex].location.latitude,
      steps[currentStepIndex].location.longitude
    );

    // Si on est à moins de 20m de l'étape, annoncer la suivante
    if (distToStep < 0.02 && currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      const nextStep = steps[currentStepIndex + 1];

      console.log("📍 Nouvelle étape:", nextStep.instruction);
      Speech.speak(nextStep.instruction, { language: "fr-FR" });
      Vibration.vibrate(200);
    }
  };

  const checkAnnonce = async () => {
    if (!destinationCoords) return;

    const localisation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    // Si pas d'itinéraire, en récupérer un
    if (!route) {
      await fetchRoute(
        localisation.coords.latitude,
        localisation.coords.longitude,
        destinationCoords.latitude,
        destinationCoords.longitude
      );
      return;
    }

    const next = findNextWaypoint(
      localisation.coords.latitude,
      localisation.coords.longitude,
      route
    );
    setNextWaypoint(next);

    // Vérifier si une étape est complétée
    checkStepCompletion(
      localisation.coords.latitude,
      localisation.coords.longitude
    );

    const dist = calculateDistance(
      localisation.coords.latitude,
      localisation.coords.longitude,
      destinationCoords.latitude,
      destinationCoords.longitude
    );

    setDistance_courant(dist.toFixed(2));

    const now = Date.now();
    const temps_since_dernier = now - derniere_annonceRef.current;

    // Guidage en temps réel basé sur la distance
    if (dist <= 0.05) {
      // Arrivée
      Speech.speak("Vous êtes arrivé à destination", { language: "fr-FR" });
      Vibration.vibrate([0, 500, 200, 500, 200, 500]);
      stopGuide();
    } else if (dist <= 0.1) {
      // Très proche - guidage toutes les 15 secondes
      if (temps_since_dernier >= 15000) {
        const currentStep = steps[currentStepIndex];
        if (currentStep) {
          Speech.speak(
            `${Math.round(dist * 1000)} mètres. ${currentStep.instruction}`,
            { language: "fr-FR" }
          );
        }
        Vibration.vibrate([0, 200, 100, 200]);
        derniere_annonceRef.current = now;
      }
    } else if (dist <= 0.5) {
      // Proche - guidage toutes les 30 secondes
      if (temps_since_dernier >= 30000) {
        const currentStep = steps[currentStepIndex];
        if (currentStep) {
          Speech.speak(
            `${Math.round(dist * 1000)} mètres. ${currentStep.instruction}`,
            { language: "fr-FR" }
          );
        }
        Vibration.vibrate([0, 200, 100, 200]);
        derniere_annonceRef.current = now;
      }
    } else {
      // Loin - guidage toutes les 2 minutes
      if (temps_since_dernier >= 120000) {
        Speech.speak(
          `Il vous reste ${dist.toFixed(1)} kilomètres jusqu'à ${destination}`,
          { language: "fr-FR" }
        );
        derniere_annonceRef.current = now;
      }
    }
  };

  const startGuide = () => {
    if (intervalRef.current) return;

    checkAnnonce();

    // Vérifier toutes les 5 secondes
    intervalRef.current = setInterval(() => {
      checkAnnonce();
    }, 5000);
  };

  const stopGuide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRoute(null);
    setNextWaypoint(null);
    setSteps([]);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    return () => stopGuide();
  }, []);

  useEffect(() => {
    if (destination && destinationCoords) {
      startGuide();
    } else {
      stopGuide();
    }
  }, [destination, destinationCoords]);

  return {
    distance_courant,
    route,
    steps,
    currentStepIndex,
    nextWaypoint,
    startGuide,
    stopGuide,
    announceNow: checkAnnonce,
  };
}
