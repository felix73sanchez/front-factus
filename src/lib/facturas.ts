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


let cachedFacturas: Factura[] | null = null;

export async function getFacturas(forceReload: boolean = false): Promise<Factura[]> {
  
  if (!forceReload && cachedFacturas) {
    return cachedFacturas;
  }

  const url = `${API_FSX}v1/facturas`;

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

    const data = await response.json();
    cachedFacturas = data; 

    return data;
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    throw error;
  }
}