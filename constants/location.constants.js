export const LOCATION_CONFIG = {
  UPDATE_INTERVAL: 200000, // 200 secondes
  AUTO_SUGGEST_COOLDOWN: 180000, // 3 minutes
  SPEECH_DELAY: 3000,
  AUTO_SUGGEST_DELAY: 5000,
};

export const VIBRATION_PATTERN = [0, 500, 200, 500, 200, 500];

export const MESSAGES = {
  PERMISSION_DENIED: "Permission refusée",
  GPS_ACTIVATED: "GPS activé !",
  GPS_DEACTIVATED: "GPS désactivé !",
  LOCATION_ANNOUNCEMENT: (address) => `vous êtes à ${address}`,
};

export const API_CONFIG = {
  BASE_URL: "https://bbe-my-eyes.onrender.com",
  ENDPOINTS: {
    CREATE_LOCATION: "/api/v1/locations",
  },
};
