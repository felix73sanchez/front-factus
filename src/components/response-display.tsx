import { CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"

interface ResponseDisplayProps {
  response: {
    success: boolean
    error?: string
  }
}

export function ResponseDisplay({ response }: ResponseDisplayProps) {
  return (
    <Alert variant={response.success ? "success" : "destructive"}>
      {response.success ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <XCircle className="h-4 w-4" />
      )}
      <AlertTitle>{response.success ? "Success" : "Error"}</AlertTitle>
      <AlertDescription>
        {response.success
          ? "La factura se envió correctamente."
          : response.error || "Hubo un error al enviar la factura."}
      </AlertDescription>
    </Alert>
  )
}