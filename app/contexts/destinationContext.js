//partager des données entre toutes les pages

import { createContext, useContext, useState } from "react";

const DestinationContext = createContext();

export function DestinationProvider({ children }) {
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState(null);

  const [destinationCoords, setDestinationCoords] = useState(null); // Coordonnées GPS de la destination

  return (
    <DestinationContext.Provider
      value={{
        destination,
        setDestination,
        distance,
        setDistance,
        destinationCoords,
        setDestinationCoords,
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
}

export function useDestination() {
  return useContext(DestinationContext);
}
