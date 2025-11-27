export const updateMessage = (id) =>
  fetch(`https://bbe-my-eyes.onrender.com/api/v1/speech/${id}`, {
    method: "PATCH",
  }).catch((error) => {
    console.error(error);
    console.error(
      "There was a problem with the fetch operation:",
      error.message
    );
  });
