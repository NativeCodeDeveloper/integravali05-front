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

export const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.integravali.cl");

export const metadata = {
  title: {
    default: "IntegraVali | Centro de Terapias Integrales",
    template: "%s | IntegraVali",
  },
  description:
    "IntegraVali es un centro de terapias integrales con un equipo interdisciplinario comprometido con el bienestar y la calidad de vida de cada persona.",
  keywords: [
    "IntegraVali",
    "centro de terapias",
    "terapias integrales",
    "kinesiologia",
    "terapia ocupacional",
    "fonoaudiologia",
    "psicologia",
    "nutricion",
    "bienestar",
    "salud integral",
  ],
  authors: [{ name: "IntegraVali", url: metadataBase.href }],
  publisher: "IntegraVali",
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
  openGraph: {
    title: "IntegraVali | Centro de Terapias Integrales",
    description:
      "Atencion personalizada e integral para mejorar el bienestar y la calidad de vida de cada persona.",
    url: metadataBase.href,
    siteName: "IntegraVali",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IntegraVali",
    description: "Centro de terapias integrales con equipo interdisciplinario.",
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
