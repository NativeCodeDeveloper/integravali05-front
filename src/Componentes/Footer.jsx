import Link from "next/link";
import { ArrowRight, Globe, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const footerLinks = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Modelo integral", href: "/#porque-elegirnos" },
  { label: "Atencion coordinada", href: "/#servicios" },
  { label: "Cobertura", href: "/#casos-clinicos" },
  { label: "Servicios", href: "/servicios" },
  { label: "Contacto", href: "/contacto" },
];

const serviceHighlights = [
  "Kinesiologia",
  "Terapia ocupacional",
  "Fonoaudiologia",
  "Medicina general y geriatria",
  "Enfermeria y TENS",
  "Cuidadores y podologia",
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/saludb.cl",
    icon: Instagram,
  },
  {
    label: "Sitio web",
    href: "https://www.saludb.cl",
    icon: Globe,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/56985278325",
    icon: MessageCircle,
  },
];

export default function FooterPremiumMedico() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-[#00cba9] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 overflow-hidden bg-white leading-none" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="block h-[96px] w-full translate-y-px">
          <path fill="#00cba9" fillOpacity="1" d="M0,64L20,64C40,64,80,64,120,58.7C160,53,200,43,240,69.3C280,96,320,160,360,160C400,160,440,96,480,85.3C520,75,560,117,600,122.7C640,128,680,96,720,117.3C760,139,800,213,840,240C880,267,920,245,960,224C1000,203,1040,181,1080,154.7C1120,128,1160,96,1200,74.7C1240,53,1280,43,1320,32C1360,21,1400,11,1420,5.3L1440,0L1440,320L1420,320C1400,320,1360,320,1320,320C1280,320,1240,320,1200,320C1160,320,1120,320,1080,320C1040,320,1000,320,960,320C920,320,880,320,840,320C800,320,760,320,720,320C680,320,640,320,600,320C560,320,520,320,480,320C440,320,400,320,360,320C320,320,280,320,240,320C200,320,160,320,120,320C80,320,40,320,20,320L0,320Z"></path>
        </svg>
        <div className="h-[2px] w-full bg-[#00cba9]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[96px] bg-[radial-gradient(circle_at_12%_10%,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_86%_12%,rgba(255,255,255,0.08),transparent_36%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pt-28 pb-14 md:px-8 lg:px-10">
        <div className="grid gap-10 border-b border-white/28 pb-10 lg:grid-cols-12 lg:gap-8">
          <section className="lg:col-span-5">
            <img
              src="/logo_clean.png"
              alt="Logo SaludB"
              width={186}
              height={186}
              className="mx-auto h-[146px] w-[146px] object-contain object-center sm:h-[162px] sm:w-[162px] lg:h-[174px] lg:w-[174px]"
            />

            <h3 className="mt-5 max-w-md text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Cuidado integral en casa, coordinado por un solo equipo.
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/92">
              Acompanamos a pacientes y familias con una red interdisciplinaria que organiza cada paso del proceso de atencion domiciliaria.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/agendaProfesionales"
                className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0f5a52] transition hover:bg-white/90"
              >
                Agendar reunión
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-transparent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/16"
              >
                Hablar con el equipo
              </Link>
            </div>
          </section>

          <section className="lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/76">Navegacion</p>
            <nav aria-label="Links del pie de pagina" className="mt-4">
              <ul className="space-y-2.5">
                {footerLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="inline-flex text-sm tracking-[0.05em] text-white/92 transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          <section className="lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/76">Servicios clave</p>
            <ul className="mt-4 space-y-2">
              {serviceHighlights.map((item) => (
                <li key={item} className="text-sm text-white/92">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="lg:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/76">Contacto</p>

            <div className="mt-4 space-y-3 text-sm text-white/92">
              <a href="tel:+56985278325" className="inline-flex items-center gap-2 transition hover:text-white">
                <Phone className="h-4 w-4" />
                +56 9 8527 8325
              </a>
              <a href="mailto:Contacto@saludb.cl" className="flex items-center gap-2 transition hover:text-white">
                <Mail className="h-4 w-4" />
                Contacto@saludb.cl
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Region Metropolitana (sin direccion fisica)
              </div>
            </div>

            <div className="mt-6 text-sm text-white/92">
              <p className="font-semibold uppercase tracking-[0.12em] text-white/82">Horario de atencion</p>
              <p className="mt-2">Lunes a Viernes: 08:00 a 21:30</p>
              <p>Sabados: 09:00 a 13:00 (segun disponibilidad)</p>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-transparent text-white transition hover:bg-white/16 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-[11px] text-white/82 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Bartelsman Salud Integral a Casa. Todos los derechos reservados.</p>
          <a
            href="https://nativecode.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold uppercase tracking-[0.16em] text-white underline decoration-white/70 underline-offset-2 transition hover:text-white/90"
          >
            Desarrollado por nativecode.cl
          </a>
        </div>
      </div>
    </footer>
  );
}
