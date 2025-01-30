"use server";

interface Factura {
  billId: string;
  billNumber: string;
  customerName: string;
  referenceCode: string;
  qrImage: string;
}

const API_FSX = process.env.API_FSX || "http://localhost:1221/";
const USER = process.env.USER || "admin";
const PASS = process.env.PASS || "admin123";

export async function getFacturas(): Promise<Factura[]> {
  const url = `${API_FSX}v1/facturas`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${USER}:${PASS}`).toString("base64")}`,
      },
      cache: "no-store", // Evita el almacenamiento en caché para obtener siempre los datos más recientes
    });

    if (!response.ok) {
      throw new Error("Error al obtener las facturas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    throw error;
  }
}
