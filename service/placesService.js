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
  return Math.round(R * c * 1000);
};

const searchNearbyPlaces = async (
  latitude,
  longitude,
  placeType = "supermarket",
  radius = 1000
) => {
  try {
    //  la requête Overpass API
    const query = `
        [out:json][timeout:15];
        (
          node["shop"="${placeType}"](around:${radius},${latitude},${longitude});
          way["shop"="${placeType}"](around:${radius},${latitude},${longitude});
          node["amenity"="${placeType}"](around:${radius},${latitude},${longitude});
          way["amenity"="${placeType}"](around:${radius},${latitude},${longitude});
        );
        out body;
      `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await response.json();

    // Transformer les données
    const places = data.elements
      .filter(
        (element) =>
          element.lat && element.lon && element.tags && element.tags.name
      )
      .map((element) => ({
        id: element.id,
        name: element.tags.name,
        latitude: element.lat,
        longitude: element.lon,
        type: placeType,
        distance: calculateDistance(
          latitude,
          longitude,
          element.lat,
          element.lon
        ),
      }))
      .sort((a, b) => a.distance - b.distance); // Trier par distance

    return places;
  } catch (error) {
    console.error("Erreur recherche lieux:", error);
    return [];
  }
};

export { calculateDistance, searchNearbyPlaces };
