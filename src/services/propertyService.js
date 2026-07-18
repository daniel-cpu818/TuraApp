const API_URL = "https://turaapi.onrender.com";

export const getProperties = async (token) => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("STATUS:", response.status);

    if (!response.ok) {
      throw new Error("Error obteniendo propiedades");
    }

    const data = await response.json();

    console.log("DATA:", data);

    return data;

  } catch (error) {
    console.error("SERVICE ERROR:", error);
    return [];
  }
};