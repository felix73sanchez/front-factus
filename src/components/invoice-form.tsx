"use client"

import { useState } from "react"
import { Plus, Trash2, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { submitInvoiceToFactus } from "@/lib/actions"
import type { InvoiceFormData, Item, WithholdingTax, ServerResponse } from "@/lib/types"
import { ResponseDisplay } from "./response-display"

const ORGANIZATION_TYPES = [
  { id: "1", name: "Persona Jurídica" },
  { id: "2", name: "Persona Natural" },
] as const

const TRIBUTE_TYPES = [
  { id: "18", name: "IVA" },
  { id: "21", name: "No aplica *" },
] as const

const PAYMENT_METHOD_CODES = [
  { id: "10", name: "Efectivo" },
  { id: "42", name: "Consignación" },
  { id: "20", name: "Cheque" },
  { id: "47", name: "Transferencia" },
  { id: "71", name: "Bonos" },
  { id: "72", name: "Vales" },
  { id: "1", name: "Medio de pago no definido" },
  { id: "49", name: "Tarjeta Débito" },
  { id: "48", name: "Tarjeta Crédito" },
  { id: "ZZZ", name: "Otro*" },
] as const

const today = new Date().toISOString().split("T")[0];
const todayMore30 = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

const emptyItem: Item = {
  code_reference: "",
  name: "",
  quantity: 1,
  discount: 0,
  discount_rate: 0,
  price: 0,
  tax_rate: "0",
  unit_measure_id: 70,
  standard_code_id: 1,
  is_excluded: 0,
  tribute_id: 1,
  withholding_taxes: [],
}

const emptyWithholdingTax: WithholdingTax = {
  code: "",
  withholding_tax_rate: "",
}

export function InvoiceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverResponse, setServerResponse] = useState<ServerResponse | null>(null)
  const [formData, setFormData] = useState<InvoiceFormData>({
    numbering_range_id: 8,
    reference_code: "",
    observation: "",
    payment_form: "1",
    payment_due_date: "",
    payment_method_code: "",
    billing_period: {
      start_date: today,
      end_date: todayMore30,
    },
    customer: {
      identification: "",
      dv: "",
      company: "",
      trade_name: "",
      names: "",
      address: "",
      email: "",
      phone: "",
      legal_organization_id: "",
      tribute_id: "",
      identification_document_id: "2",
      municipality_id: "",
    },
    items: [{ ...emptyItem }],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const result = await submitInvoiceToFactus(formData);
      const response: ServerResponse = {
        success: result.success,
        data: formData,
        timestamp: new Date().toISOString(),
      };
      setServerResponse(response);
  
      if (result.success) {
        toast.success("Invoice submitted successfully");
  
        
        setFormData({
          numbering_range_id: 8,
          reference_code: "",
          observation: "",
          payment_form: "1",
          payment_due_date: "",
          payment_method_code: "",
          billing_period: {
            start_date: today,
            end_date: todayMore30,
          },
          customer: {
            identification: "",
            dv: "",
            company: "",
            trade_name: "",
            names: "",
            address: "",
            email: "",
            phone: "",
            legal_organization_id: "",
            tribute_id: "",
            identification_document_id: "2",
            municipality_id: "",
          },
          items: [{ ...emptyItem }],
        });
      } else {
        response.error = result.error;
        toast.error(result.error || "Failed to submit invoice");
      }
    } catch (error) {
      const errorResponse: ServerResponse = {
        success: false,
        error: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      };
      setServerResponse(errorResponse);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCustomer = (field: keyof typeof formData.customer, value: string) => {
    setFormData((prev) => ({
      ...prev,
      customer: { ...prev.customer, [field]: value },
    }))
  }

  const updateItem = (index: number, field: keyof Item, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...emptyItem }],
    }))
  }

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const addWithholdingTax = (itemIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === itemIndex
          ? {
            ...item,
            withholding_taxes: [...(item.withholding_taxes || []), { ...emptyWithholdingTax }],
          }
          : item,
      ),
    }))
  }

  const removeWithholdingTax = (itemIndex: number, taxIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === itemIndex
          ? {
            ...item,
            withholding_taxes: (item.withholding_taxes ?? []).filter((_, j) => j !== taxIndex),
          }
          : item,
      ),
    }))
  }

  const updateWithholdingTax = (itemIndex: number, taxIndex: number, field: keyof WithholdingTax, value: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === itemIndex
          ? {
            ...item,
            withholding_taxes: (item.withholding_taxes ?? []).map((tax, j) =>
              j === taxIndex ? { ...tax, [field]: value } : tax,
            ),
          }
          : item,
      ),
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
       {/* Botón para volver al inicio */}
       <div className="fixed top-4 left-4">
        <a href="/"> {/* Cambia "/" por la ruta de inicio de tu aplicación */}
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> {/* Ícono de flecha hacia la izquierda */}
            Volver al inicio
          </Button>
        </a>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Crear factura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference_code">Codigo de referencia:</Label>
                <Input
                  id="reference_code"
                  value={formData.reference_code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reference_code: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_method_code">Metodo de pago:</Label>
                <select
                  id="payment_method_code"
                  className="flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                  value={formData.payment_method_code}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, payment_method_code: e.target.value }))
                  }
                >
                  <option value="">Selecciona el metodo de pago</option>
                  {PAYMENT_METHOD_CODES.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observation">Descripción</Label>
              <Textarea
                id="observation"
                value={formData.observation}
                onChange={(e) => setFormData((prev) => ({ ...prev, observation: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informacion del cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_names">Nombre:</Label>
                <Input
                  id="customer_names"
                  value={formData.customer.names || ""}
                  onChange={(e) => updateCustomer("names", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">Correo electronico:</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer.email || ""}
                  onChange={(e) => updateCustomer("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_identification">Identificación:</Label>
                <Input
                  id="customer_identification"
                  value={formData.customer.identification || ""}
                  onChange={(e) => updateCustomer("identification", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_phone">Teléfono:</Label>
                <Input
                  id="customer_phone"
                  value={formData.customer.phone || ""}
                  onChange={(e) => updateCustomer("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_address">Dirección:</Label>
                <Input
                  id="customer_address"
                  value={formData.customer.address || ""}
                  onChange={(e) => updateCustomer("address", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_legal_organization">Tipo de organización:</Label>
                <select
                  id="customer_legal_organization"
                  className="flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                  value={formData.customer.legal_organization_id}
                  onChange={(e) => updateCustomer("legal_organization_id", e.target.value)}
                >
                  <option value="">Selecciona organicación</option>
                  {ORGANIZATION_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_tribute">Tributo:</Label>
                <select
                  id="customer_tribute"
                  className="flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                  value={formData.customer.tribute_id}
                  onChange={(e) => updateCustomer("tribute_id", e.target.value)}
                >
                  <option value="">Seleciona tributo</option>
                  {TRIBUTE_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Elementos</CardTitle>
            <Button type="button" onClick={addItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar elemento
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.items.map((item, itemIndex) => (
              <div key={itemIndex} className="space-y-4 p-4 border border-neutral-200 rounded-lg relative dark:border-neutral-800">
                {formData.items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => removeItem(itemIndex)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Codigo de referencia:</Label>
                    <Input
                      value={item.code_reference}
                      onChange={(e) => updateItem(itemIndex, "code_reference", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre:</Label>
                    <Input value={item.name} onChange={(e) => updateItem(itemIndex, "name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cantidad:</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(itemIndex, "quantity", Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Precio:</Label>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(itemIndex, "price", Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descuento:</Label>
                    <Input
                      type="number"
                      value={item.discount_rate}
                      onChange={(e) => {
                        const rate = Number(e.target.value)
                        updateItem(itemIndex, "discount_rate", rate)
                        updateItem(itemIndex, "discount", (rate / 100) * item.price)
                      }}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tasa de impuesto (%):</Label>
                    <Input value={item.tax_rate} onChange={(e) => updateItem(itemIndex, "tax_rate", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Withholding Taxes</h4>
                    <Button type="button" onClick={() => addWithholdingTax(itemIndex)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar impuesto
                    </Button>
                  </div>
                  {(item.withholding_taxes ?? []).map((tax, taxIndex) => (
                    <div key={taxIndex} className="flex gap-4 items-end">
                      <div className="space-y-2 flex-1">
                        <Label>Codigo</Label>
                        <Input
                          value={tax.code}
                          onChange={(e) => updateWithholdingTax(itemIndex, taxIndex, "code", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label>Tasa (%)</Label>
                        <Input
                          value={tax.withholding_tax_rate}
                          onChange={(e) =>
                            updateWithholdingTax(itemIndex, taxIndex, "withholding_tax_rate", e.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWithholdingTax(itemIndex, taxIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <CardFooter className="flex justify-center">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar factura"}
            </Button>
          </CardFooter>
      </form>

      {/* Response Display */}
      {serverResponse && <ResponseDisplay response={serverResponse} />}
    </div>
  )
}

