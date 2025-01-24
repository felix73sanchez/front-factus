const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>© {year} Sistema de facturas. All rights reserved. | FsX</p>
      </div>
    </footer>
  );
}