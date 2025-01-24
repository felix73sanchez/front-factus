import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function WelcomeMessage() {
  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Bienvenido al Sistema de Facturación</CardTitle>
        <CardDescription className="text-center">
          Una integración didáctica de la API de Halltech
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-neutral-600 dark:text-neutral-400">
          Este sistema fue desarrollado por{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">Félix Sánchez (FSX)</span>{" "}
          como un proyecto educativo para demostrar la integración de APIs en aplicaciones modernas.
        </p>
        
      </CardContent>
    </Card>
  );
}