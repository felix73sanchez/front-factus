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

export async function getFacturas(): Promise<Factura[]> {
  const url = `${API_FSX}v1/facturas`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${USER}:${PASS}`).toString("base64")}`,
      },
      cache: "no-store",
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
