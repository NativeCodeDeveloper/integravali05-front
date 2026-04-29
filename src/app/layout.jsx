import "./globals.css";
import { AnimatedLayout } from "@/Componentes/AnimatedLayout";
import AgendaProvider from "@/ContextosGlobales/AgendaContext";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["500", "600", "700", "800"],
});

export const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.saludb.cl");

export const metadata = {
  title: {
    default: "SaludB | Salud Integral a Domicilio",
    template: "%s | SaludB",
  },
  description:
    "SaludB entrega atencion integral a domicilio en la Region Metropolitana con equipo interdisciplinario y coordinacion clinica continua.",
  keywords: [
    "SaludB",
    "salud a domicilio",
    "atencion domiciliaria",
    "kinesiologia",
    "terapia ocupacional",
    "fonoaudiologia",
    "medicina general",
    "geriatria",
    "enfermeria",
    "Region Metropolitana",
  ],
  authors: [{ name: "SaludB", url: metadataBase.href }],
  publisher: "SaludB",
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  alternates: {
    canonical: metadataBase.href,
  },
  icons: {
    icon: "/logo_transparent.png",
    shortcut: "/logo_transparent.png",
    apple: "/logo_transparent.png",
  },
  openGraph: {
    title: "SaludB | Salud Integral a Domicilio",
    description:
      "Atencion personalizada y coordinada a domicilio para mejorar la funcionalidad y calidad de vida de cada paciente.",
    url: metadataBase.href,
    siteName: "SaludB",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaludB",
    description: "Red de atencion domiciliaria integral en la Region Metropolitana.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-white">
        <AnimatedLayout>
          <AgendaProvider>{children}</AgendaProvider>
        </AnimatedLayout>
      </body>
    </html>
  );
}
