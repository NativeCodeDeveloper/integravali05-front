import Navbar from "@/Componentes/Navbar";
import FooterPremiumMedico from "@/Componentes/Footer";
import ToasterClient from "@/Componentes/ToasterClient";
import WhatsAppFloatButton from "@/Componentes/WhatsAppFloatButton";
import CarritoProvider from "@/ContextosGlobales/CarritoContext";
import ObjetoPagarProvider from "@/ContextosGlobales/ObjetoPagarContext";

export default function PublicLayout({ children }) {
  return (
    <CarritoProvider>
      <ObjetoPagarProvider>
        <div className="theme-white relative min-h-screen bg-white text-slate-900">
          <ToasterClient />
          <main className="relative z-10 pt-24 md:pt-20">{children}</main>
        </div>
      </ObjetoPagarProvider>
    </CarritoProvider>
  );
}
