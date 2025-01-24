"use server";

const url = "http://localhost:1221/auth/token";
const username = "admin"; // Reemplaza con tu usuario
const password = "admin123"; // Reemplaza con tu contraseña

// Variables en memoria para almacenar el token y su tiempo de expiración
let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

export async function getToken(): Promise<string> {
  // Verifica si el token en caché es válido
  if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
    console.log("Token obtenido desde caché");
    return cachedToken;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }

    const data = await response.text(); // Obtiene la respuesta del servidor

    // Guarda el token en caché y establece el tiempo de expiración (1 hora)
    cachedToken = data;
    tokenExpiration = Date.now() + 60 * 60 * 1000; // 1 hora en milisegundos

    console.log("Token obtenido desde el backend y guardado en caché");
    return data;
  } catch (error) {
    console.error("Error al obtener el token:", error);
    throw error; // Propaga el error para que pueda ser manejado por el llamador
  }
}