"use server";

const url = `${process.env.API_FSX}v1/auth/token`;


let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

export async function getToken(): Promise<string> {
  
  if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
   
    return cachedToken;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.USER}:${process.env.PASS}`).toString("base64")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();

    cachedToken = data;
    tokenExpiration = Date.now() + 60 * 60 * 1000; 

    console.log("Token obtenido desde el backend y guardado en caché");
    return data;
  } catch (error) {
    console.error("Error al obtener el token:", error);
    throw error;
  }
}