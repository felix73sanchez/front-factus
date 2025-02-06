'use client';
import { getFacturas } from '@/lib/facturas';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Factura {
  billId: string;
  billNumber: string;
  customerName: string;
  referenceCode: string;
  qrImage: string;
}

const VerFacturas = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFacturas();
        setFacturas(data || []);
      } catch {
        setError("Falló al obtener las facturas");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData(); 
  
    const interval = setInterval(fetchData, 5 * 60 * 1000);
  
    return () => clearInterval(interval); 
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Cargando facturas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl font-semibold">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative pt-16">
      {/* Botón para volver al inicio */}
      <div className="absolute top-4 left-4 z-30 sm:fixed">
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>
      </div>

      {/* Título */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800">
        Facturas Generadas
      </h1>


      {/* Contenedor de la tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-300 sticky top-0">
            <tr>
              <th className="py-3 px-4 text-center sm:px-6">ID</th>
              <th className="py-3 px-4 text-center sm:px-6">Número de Factura</th>
              <th className="py-3 px-4 text-center sm:px-6">Cliente</th>
              <th className="py-3 px-4 text-center sm:px-6">Código de Referencia</th>
              <th className="py-3 px-4 text-center sm:px-6">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura, index) => (
              <tr
                key={factura.billId}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100`}
              >
                <td className="py-3 px-4 text-center sm:px-6 font-medium text-gray-700">
                  {factura.billId}
                </td>
                <td className="py-3 px-4 text-center sm:px-6">{factura.billNumber}</td>
                <td className="py-3 px-4 text-center sm:px-6">{factura.customerName}</td>
                <td className="py-3 px-4 text-center sm:px-6">{factura.referenceCode}</td>
                <td className="py-3 px-4 text-center sm:px-6">
                  <a
                    href={factura.qrImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 hover:underline"
                  >
                    Ver Factura
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerFacturas;