"use server";

interface Factura {
  billId: string;
  billNumber: string;
  customerName: string;
  referenceCode: string;
  qrImage: string;
}

const API_FSX = process.env.API_FSX;
const USER = process.env.USER;
const PASS = process.env.PASS;

export async function getFacturas(retries = 3, delay = 2000): Promise<Factura[]> {
  const url = `${API_FSX}v1/facturas`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(`${USER}:${PASS}`).toString("base64")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las facturas");
      }

      return await response.json();
    } catch (error) {
      console.error(`Intento ${attempt + 1} fallido:`, error);
      if (attempt < retries - 1) {
        await new Promise((res) => setTimeout(res, delay)); // Espera antes de reintentar
      } else {
        throw error;
      }
    }
  }
  throw new Error("Error al obtener las facturas después de múltiples intentos");
}
