import "./globals.css";

export const metadata = {
  title: "SmartWorld Auditor",
  description: "Plataforma de auditoría inteligente de pólizas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}