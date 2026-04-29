"use client";
import { FloatingWhatsApp } from "react-floating-whatsapp";

export default function WhatsAppButton() {
    return (
        <FloatingWhatsApp
            phoneNumber="+56985278325"
            accountName="SaludB"
            avatar="/logodifort.png" // opcional: logo o imagen en public/
            statusMessage=""
            chatMessage="Hola, gracias por contactar a SaludB. En que podemos ayudarte?"
            placeholder="Escribe tu mensaje..."
            notification
            notificationSound
        />
    );
}
