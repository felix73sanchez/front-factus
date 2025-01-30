"use server";

import type { InvoiceFormData } from "./types";
import { getToken } from "./auth";

export async function submitInvoiceToFactus(invoiceData: InvoiceFormData): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  
  const FACTUS_API_URL =  `${process.env.API_FACTUS}v1/bills/validate`;
  const BEARER_TOKEN = await getToken();

  try {
    // Enviar la factura a Factus
    const response = await fetch(FACTUS_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Error en la API de Factus: ${response.status} - ${error?.message || "Error desconocido"}`
      );
    }

    const factusResponse = await response.json();
    //console.log("Factura enviada correctamente:", factusResponse);

    // Extraer los datos relevantes de la respuesta de Factus
    const dataToPersist = {
      status: factusResponse.status,
      customerName: factusResponse.data.customer.names,
      customerIdentification: factusResponse.data.customer.identification,
      customerEmail: factusResponse.data.customer.email,
      billId: factusResponse.data.bill.id,
      billNumber: factusResponse.data.bill.number,
      referenceCode: factusResponse.data.bill.reference_code,
      createdAt: factusResponse.data.bill.created_at,
      qrImage: factusResponse.data.bill.public_url,
    };

    // Enviar los datos relevantes a tu backend
    const YOUR_BACKEND_URL = "http://localhost:1221/v1/facturas/guardar"; // Reemplaza con la URL de tu backend
    const username = "admin"; // Reemplaza con tu usuario
    const password = "admin123"; // Reemplaza con tu contraseña

    const persistResponse = await fetch(YOUR_BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Asegúrate de incluir este encabezado
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      },
      body: JSON.stringify(dataToPersist),
    });

    // Verificar si la respuesta del backend es exitosa
    if (!persistResponse.ok) {
      const errorResponse = await persistResponse.json(); // Obtener la respuesta de error del backend
      throw new Error(
        `Error al persistir los datos en el backend: ${persistResponse.status} - ${errorResponse?.message || "Error desconocido"}`
      );
    }

    //console.log("Datos persistidos correctamente en el backend");

    return {
      success: true,
      data: factusResponse,
    };
  } catch (error: any) {
    console.error("Error enviando la factura:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}