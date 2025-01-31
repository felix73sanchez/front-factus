import { z } from "zod"

const withholdingTaxSchema = z.object({
  code: z.string().min(1, "Codigo es requerido"),
  withholding_tax_rate: z.string().min(1, "El porcentaje de retencion es requerido"),
})

const itemSchema = z.object({
  code_reference: z.string().min(1, "Codigo de referencia es requerido"),
  name: z.string().min(1, "Nombre es requerido"),
  quantity: z.number().min(1, "Cantidad no puede ser menor a 1"),
  discount: z.number().min(0, "el descuento no puede ser negativo"),
  discount_rate: z.number().min(0, "el descuento no puede ser negativo"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  tax_rate: z.string().min(1, "Impuesto es requerido"),
  unit_measure_id: z.number(),
  standard_code_id: z.number(),
  is_excluded: z.number(),
  tribute_id: z.number(),
  withholding_taxes: z.array(withholdingTaxSchema),
})

export const customerSchema = z.object({
  identification: z.string().min(1, "Identificacion es requerida"),
  dv: z.string().optional(),
  company: z.string().optional(),
  trade_name: z.string().optional(),
  names: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email("Direccion incorrecta").optional(),
  phone: z.string().optional(),
  legal_organization_id: z.string(),
  tribute_id: z.string(),
  identification_document_id: z.string(),
  municipality_id: z.string().optional(),
})

export const invoiceFormSchema = z.object({
  numbering_range_id: z.number(),
  reference_code: z.string().min(1, "Codigo de referencia es requerido"),
  observation: z.string(),
  payment_form: z.string().optional(),
  payment_due_date: z.string().optional(),
  payment_method_code: z.string().optional(),
  billing_period: z
    .object({
      start_date: z.string().optional(),
    })
    .optional(),
  customer: customerSchema,
  items: z
    .array(
      itemSchema.extend({
        withholding_taxes: z.array(withholdingTaxSchema).optional(),
      }),
    )
    .min(1, "El detalle de la factura no puede estar vacio"),
})

