"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface WithholdingTax {
  code: string
  withholding_tax_rate: string
}

interface Item {
  code_reference: string
  name: string
  quantity: number
  discount: number
  discount_rate: number
  price: number
  tax_rate: string
  unit_measure_id: number
  standard_code_id: number
  is_excluded: number
  tribute_id: number
  withholding_taxes: WithholdingTax[]
}

interface Customer {
  identification: string
  dv: string
  names: string
  address: string
  email: string
  phone: string
  legal_organization_id: string
  tribute_id: string
  identification_document_id: string
  municipality_id: string
}

interface InvoiceData {
  numbering_range_id: number
  reference_code: string
  observation: string
  payment_method_code: string
  customer: Customer
  items: Item[]
}

export function InvoiceDisplay({ data }: { data: InvoiceData }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculateSubtotal = (item: Item) => {
    return item.price * item.quantity - item.discount
  }

  const calculateTax = (item: Item) => {
    const subtotal = calculateSubtotal(item)
    return subtotal * (Number.parseFloat(item.tax_rate) / 100)
  }

  const calculateTotal = (item: Item) => {
    const subtotal = calculateSubtotal(item)
    const tax = calculateTax(item)
    return subtotal + tax
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice {data.reference_code}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Customer Information</h3>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Name:</span> {data.customer.names}
                </p>
                <p>
                  <span className="font-medium">ID:</span> {data.customer.identification}-{data.customer.dv}
                </p>
                <p>
                  <span className="font-medium">Address:</span> {data.customer.address}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {data.customer.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {data.customer.phone}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Invoice Details</h3>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Reference:</span> {data.reference_code}
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span> {data.payment_method_code}
                </p>
                {data.observation && (
                  <p>
                    <span className="font-medium">Observation:</span> {data.observation}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Tax Rate</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Ref: {item.code_reference}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell>
                      {item.discount > 0 && (
                        <div>
                          <p>{formatCurrency(item.discount)}</p>
                          <Badge variant="secondary">{item.discount_rate}%</Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{item.tax_rate}%</TableCell>
                    <TableCell>{formatCurrency(calculateTotal(item))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data.items.some((item) => item.withholding_taxes.length > 0) && (
            <div>
              <h3 className="font-semibold mb-2">Withholding Taxes</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((item, itemIndex) =>
                    item.withholding_taxes.map((tax, taxIndex) => (
                      <TableRow key={`${itemIndex}-${taxIndex}`}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{tax.code}</TableCell>
                        <TableCell>{tax.withholding_tax_rate}%</TableCell>
                      </TableRow>
                    )),
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(data.items.reduce((acc, item) => acc + calculateSubtotal(item), 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>{formatCurrency(data.items.reduce((acc, item) => acc + calculateTax(item), 0))}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(data.items.reduce((acc, item) => acc + calculateTotal(item), 0))}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

