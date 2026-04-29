"use client";

import Link from "next/link";
import { Clock3, Instagram, Mail, MapPin, MessageCircle } from "lucide-react";

const contactCards = [
  {
    title: "Cobertura",
    value: "Region Metropolitana",
    href: null,
    icon: MapPin,
  },
  {
    title: "WhatsApp",
    value: "+56 9 8527 8325",
    href: "https://wa.me/56985278325",
    icon: MessageCircle,
  },
  {
    title: "Email",
    value: "Contacto@saludb.cl",
    href: "mailto:Contacto@saludb.cl",
    icon: Mail,
  },
  {
    title: "Instagram",
    value: "@saludb.cl",
    href: "https://www.instagram.com/saludb.cl",
    icon: Instagram,
  },
];

export default function ContactoPage() {
  return (
    <main className="bg-transparent text-[#0f5a52]">
      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(0,203,169,0.2),transparent_34%),radial-gradient(circle_at_88%_2%,rgba(0,203,169,0.16),transparent_42%)]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-6 md:px-10 lg:grid-cols-[1fr_1.05fr] xl:px-12 xl:gap-14">
          <aside className="rounded-[2rem] border border-[#00b89a] bg-[linear-gradient(160deg,#00cba9_0%,#00b89a_100%)] p-7 shadow-[0_20px_54px_-34px_rgba(0,122,103,0.38)] backdrop-blur md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/84">
              Contacto
            </p>
            <h1 className="mt-4 text-4xl leading-[1.02] text-white sm:text-5xl">
              Salud integral a domicilio en la Region Metropolitana.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/92 sm:text-base">
              Coordinamos kinesiologia, terapia ocupacional, fonoaudiologia, enfermeria, medicina y mas servicios en tu hogar.
            </p>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/86 sm:text-sm">
              Nuestro enfoque interdisciplinario prioriza continuidad clinica, cercania y decisiones compartidas con cada familia.
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {contactCards.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/82">
                      {item.title}
                    </p>
                    <p
                      className={[
                        "mt-2 min-w-0 text-sm font-medium leading-relaxed text-white",
                        item.title === "Email" ? "break-all" : "break-words",
                      ].join(" ")}
                    >
                      {item.value}
                    </p>
                  </>
                );

                if (item.href) {
                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                      className="rounded-2xl border border-white/28 bg-white/12 p-5 transition hover:-translate-y-0.5 hover:bg-white/16"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-white/28 bg-white/12 p-5"
                  >
                    {content}
                  </article>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl border border-white/28 bg-white/12 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/84">
                Horario de atencion
              </p>
              <div className="mt-3 flex items-start gap-3 text-sm text-white/92">
                <Clock3 className="mt-0.5 h-4 w-4 text-white/86" />
                <div className="space-y-1.5">
                  <p>Lunes a Viernes: 08:00 a 21:30</p>
                  <p>Sabado: 09:00 a 13:00 (ocasional)</p>
                  <p>Disponibilidad sujeta a agenda profesional</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-[#00b89a] bg-[linear-gradient(160deg,#00cba9_0%,#00b89a_100%)] p-7 shadow-[0_20px_54px_-34px_rgba(0,122,103,0.38)] md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/84">
              Canales de contacto
            </p>
            <h2 className="mt-4 text-3xl leading-tight text-white sm:text-4xl">
              Este sitio no utiliza formulario de contacto.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/92">
              Para coordinar una evaluacion o resolver dudas, escribenos directamente por WhatsApp, correo o Instagram.
            </p>

            <div className="mt-8 grid gap-4">
              <a
                href="https://wa.me/56985278325"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/34 bg-white px-7 py-3 text-sm font-semibold text-[#0f5a52] transition hover:bg-white/90"
              >
                Escribir por WhatsApp
              </a>

              <a
                href="mailto:Contacto@saludb.cl"
                className="inline-flex items-center justify-center rounded-full border border-white/34 bg-white/12 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
              >
                Enviar correo
              </a>

              <a
                href="https://www.instagram.com/saludb.cl"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/34 bg-white/12 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
              >
                Ir a Instagram
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-white/28 bg-white/12 p-5 text-sm text-white/92">
              <p className="font-semibold uppercase tracking-[0.12em] text-white/84">Atencion por coordinacion</p>
              <p className="mt-2">
                Agendamos segun disponibilidad profesional y prioridad clinica del caso.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/agendaProfesionales"
                className="inline-flex rounded-full border border-white/34 bg-white px-7 py-3 text-sm font-semibold text-[#0f5a52] transition hover:bg-white/90"
              >
                Agendar primera evaluacion
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
