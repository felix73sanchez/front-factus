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

    
    const YOUR_BACKEND_URL = `${process.env.API_FSX}v1/facturas/guardar`;

    const persistResponse = await fetch(YOUR_BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
        Authorization: `Basic ${Buffer.from(`${process.env.USER}:${process.env.PASS}`).toString("base64")}`,
      },
      body: JSON.stringify(dataToPersist),
    });

    if (!persistResponse.ok) {
      const errorResponse = await persistResponse.json(); // Obtener la respuesta de error del backend
      throw new Error(
        `Error al persistir los datos en el backend: ${persistResponse.status} - ${errorResponse?.message || "Error desconocido"}`
      );
    }
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