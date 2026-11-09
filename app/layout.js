import "./globals.css";

export const metadata = {
  // 1. Añadimos metadataBase para que las URLs de la imagen sean absolutas
  metadataBase: new URL('https://smartworld-auditor.vercel.app'),
  title: "SmartWorld Auditor | IA para Seguros",
  description: "Sube tu póliza y obtén un Resumen Ejecutivo y una Guía de Siniestro en segundos.",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "SmartWorld Auditor",
    description: "Plataforma de auditoría inteligente de pólizas de seguros.",
    url: "https://smartworld-auditor.vercel.app/",
    siteName: "SmartWorld AI",
    images: [
      {
        // 2. La URL de la imagen puede ser relativa gracias a metadataBase
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "SmartWorld Auditor Preview",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}