"use client";

import Link from "next/link";

const servicios = [
  "Kinesiologia a domicilio",
  "Terapia ocupacional",
  "Fonoaudiologia",
  "Medicina general",
  "Geriatria",
  "Enfermeria",
  "Tecnico en enfermeria (TENS)",
  "Cuidadores",
  "Podologia",
  "Arriendo de productos de salud",
];

export default function ServicioPage() {
  return (
    <main className="bg-transparent text-[#0f5a52]">
      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-24 md:px-10 md:pb-24 md:pt-28 xl:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#009a82]/88">
          Servicios
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl leading-tight text-[#0f5a52] sm:text-5xl">
          Servicios integrales a domicilio para funcionalidad y bienestar.
        </h1>
        <p className="mt-7 max-w-3xl text-base leading-relaxed text-[#2b7268]/86">
          En SaludB coordinamos distintas areas clinicas para que pacientes y familias reciban una atencion continua, humana y personalizada.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-7 px-6 pb-28 md:grid-cols-2 md:px-10 md:pb-32 xl:grid-cols-3 xl:px-12">
        {servicios.map((servicio, index) => (
          <article
            key={servicio}
            className="group rounded-3xl border border-[#00b89a] bg-[linear-gradient(170deg,#00cba9_0%,#00b89a_100%)] p-7 shadow-[0_18px_40px_-26px_rgba(0,122,103,0.34)] transition hover:-translate-y-1 hover:border-[#00a58a] hover:shadow-[0_22px_46px_-24px_rgba(0,122,103,0.42)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/84">
              Servicio {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-4 text-xl leading-snug text-white">{servicio}</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/92">
              Intervencion coordinada con el equipo tratante para asegurar continuidad, seguridad y avances sostenidos.
            </p>
          </article>
        ))}
      </section>

      <section className="border-t border-[#00cba9]/44 bg-transparent">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-center md:px-10 md:py-20 xl:px-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#009a82]/88">
              Siguiente paso
            </p>
            <h3 className="mt-4 text-3xl leading-tight text-[#0f5a52]">
              Agenda una primera evaluacion y coordinemos tu plan.
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contacto"
              className="rounded-full border border-[#00b89a] bg-[linear-gradient(135deg,#00cba9_0%,#00b89a_100%)] px-7 py-3 text-sm font-semibold text-white transition hover:brightness-105"
            >
              Solicitar cita
            </Link>
            <a
              href="https://wa.me/56985278325"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#00b89a] bg-[#00cba9] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#00b89a]"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
