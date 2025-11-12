import { Magnetometer } from "expo-sensors";
import { useEffect, useState } from "react";

export function useCompass() {
  const [heading, setHeading] = useState(0); // Direction actuelle en degrés (0-360)
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Activer la boussole
    const subscribe = () => {
      setSubscription(
        Magnetometer.addListener((data) => {
          // Calculer l'angle à partir des données magnétiques
          let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
          // Normaliser l'angle entre 0 et 360
          angle = angle < 0 ? angle + 360 : angle;
          setHeading(Math.round(angle));
        })
      );
    };

    subscribe();
    Magnetometer.setUpdateInterval(1000); // Mise à jour toutes les secondes

    return () => {
      subscription && subscription.remove();
      setSubscription(null);
    };
  }, []);

  return heading;
}
