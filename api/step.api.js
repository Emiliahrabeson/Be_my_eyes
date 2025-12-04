import { API_CONFIG } from "../constants/location.constants";

export const sendStepToServer = async (stepData) => {
  try {
    console.log(stepData);
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE_STEP}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stepData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'envoi de la localisation:", error);
    throw error;
  }
};
