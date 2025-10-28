import { createContext, useContext, useState } from "react";

const DestinationContext = createContext();

export function DestinationProvider({ children }) {
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState(null);

  return (
    <DestinationContext.Provider
      value={{ destination, setDestination, distance, setDistance }}
    >
      {children}
    </DestinationContext.Provider>
  );
}

export function useDestination() {
  return useContext(DestinationContext);
}
