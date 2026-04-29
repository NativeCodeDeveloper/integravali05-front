import { MessageCircle } from "lucide-react";

export default function WhatsAppFloatButton() {
  return (
    <a
      href="https://wa.me/56985278325"
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir WhatsApp de SaludB"
      className="fixed bottom-5 right-5 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#34cdb4]/40 bg-[linear-gradient(145deg,#34cdb4_0%,#2ab9a2_100%)] text-white shadow-[0_18px_45px_-20px_rgba(52,205,180,0.72)] transition duration-300 ease-out hover:scale-105 hover:brightness-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
