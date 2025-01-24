export default function Header() {
  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
       
        <nav>
          <a href="/facturas" className="px-4 hover:underline">
            Crear factura
          </a>
          <a href="#search" className="px-4 hover:underline">
            Ver facturas
          </a>
        </nav>
      </div>
    </header>
  );
}