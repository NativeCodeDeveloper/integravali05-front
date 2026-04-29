import Image from "next/image";
import RevealOnScroll from "@/Componentes/RevealOnScroll";

const pillars = [
  {
    title: "Atencion integral en domicilio",
    text: "Coordinamos distintas disciplinas para abordar funcionalidad, bienestar y salud de forma completa.",
    logoSrc: "/logo_transparent.png",
  },
  {
    title: "Equipo interdisciplinario",
    text: "Kinesiologia, terapia ocupacional, fonoaudiologia, enfermeria, medicina y otras areas trabajan en conjunto.",
    logoSrc: "/logo_transparent.png",
  },
  {
    title: "Coordinacion clinica continua",
    text: "Gestionamos cada caso para asegurar coherencia, continuidad y comunicacion activa entre profesionales.",
    logoSrc: "/logo_transparent.png",
  },
  {
    title: "Apoyo real para familias",
    text: "Reducimos la carga de coordinar multiples servicios y entregamos tranquilidad con un plan unico de atencion.",
    logoSrc: "/logo_transparent.png",
  },
];

export default function Seccion1() {
  return (
    <section id="porque-elegirnos" className="scroll-mt-24 bg-transparent py-22 text-[#0f5a52] sm:py-28">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 md:px-8 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <RevealOnScroll className="lg:col-span-4">
          <div className="sticky top-28 rounded-[2rem] bg-[linear-gradient(165deg,#00cba9_0%,#00b89a_100%)] p-7 shadow-[0_30px_80px_-56px_rgba(0,160,134,0.42)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#e9fff9]">Por que elegir SaludB</p>
            <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.02] text-white sm:text-5xl">
              Salud a domicilio con enfoque humano y coordinado.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#f2fffb] sm:text-base">
              No entregamos prestaciones aisladas. Articulamos un plan personalizado para mejorar
              la funcionalidad y calidad de vida del paciente en su entorno real.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {pillars.map((item, index) => {
            const shifted = index % 2 === 0 ? "sm:-translate-y-3" : "sm:translate-y-3";

            return (
              <RevealOnScroll key={item.title} className="h-full">
                <article
                  className={[
                    "h-full rounded-3xl border border-[#bfeee3] bg-white p-6 text-[#0f5a52] shadow-[0_16px_36px_-24px_rgba(15,90,82,0.26)] transition duration-300 ease-out hover:-translate-y-1",
                    shifted,
                  ].join(" ")}
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ecfbf7]">
                    {item.logoSrc ? (
                      <Image
                        src={item.logoSrc}
                        alt="Logo SaludB"
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                      />
                    ) : null}
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-[0.01em] text-[#0f5a52]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 tracking-[0.01em] text-[#2b7268]">{item.text}</p>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
