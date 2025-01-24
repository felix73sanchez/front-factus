import { z } from "zod"

const withholdingTaxSchema = z.object({
  code: z.string().min(1, "Code is required"),
  withholding_tax_rate: z.string().min(1, "Rate is required"),
})

const itemSchema = z.object({
  code_reference: z.string().min(1, "Code reference is required"),
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  discount: z.number().min(0, "Discount cannot be negative"),
  discount_rate: z.number().min(0, "Discount rate cannot be negative"),
  price: z.number().min(0, "Price cannot be negative"),
  tax_rate: z.string().min(1, "Tax rate is required"),
  unit_measure_id: z.number(),
  standard_code_id: z.number(),
  is_excluded: z.number(),
  tribute_id: z.number(),
  withholding_taxes: z.array(withholdingTaxSchema),
})

export const customerSchema = z.object({
  identification: z.string().min(1, "Identification is required"),
  dv: z.string().optional(),
  company: z.string().optional(),
  trade_name: z.string().optional(),
  names: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  legal_organization_id: z.string(),
  tribute_id: z.string(),
  identification_document_id: z.string(),
  municipality_id: z.string().optional(),
})

export const invoiceFormSchema = z.object({
  numbering_range_id: z.number(),
  reference_code: z.string().min(1, "Reference code is required"),
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
    .min(1, "At least one item is required"),
})

