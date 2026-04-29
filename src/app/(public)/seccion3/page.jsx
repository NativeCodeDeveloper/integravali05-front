"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RevealOnScroll from "@/Componentes/RevealOnScroll";

const FALLBACK_CASE_IMAGE = "/Pub2.png";

export default function Seccion3() {
  const scrollerRef = useRef(null);
  const [imageErrors, setImageErrors] = useState({});
  const [listaPublicaciones, setListaPublicaciones] = useState([]);
  const API = process.env.NEXT_PUBLIC_API_URL || "https://bartelsmansalud.nativecode.cl";

  async function listarPublicacionesSeccion3() {
    try {
      const res = await fetch(`${API}/publicaciones/seleccionarPublicaciones`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (!res.ok) {
        console.error("No se han podido listar publicaciones.");
        setListaPublicaciones([]);
        return [];
      }

      const publicaciones = await res.json();
      const activePublicaciones = Array.isArray(publicaciones)
        ? publicaciones.filter((item) => Number(item.estadoPublicacion ?? 1) === 1)
        : [];
      setListaPublicaciones(activePublicaciones);
      return activePublicaciones;
    } catch (err) {
      console.error("Problema al consultar backend desde la vista frontend:" + err);
      setListaPublicaciones([]);
      return [];
    }
  }

  useEffect(() => {
    listarPublicacionesSeccion3();
  }, []);

  const clinicalCases = listaPublicaciones.map((publicaciones, index) => ({
    id: publicaciones.id_publicaciones ?? `case-${index}`,
    title: publicaciones.descripcionPublicaciones || `Publicacion ${index + 1}`,
    image: `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${publicaciones.imagenPublicaciones_primera}/full`,
  }));
  const content = clinicalCases.length > 0
    ? clinicalCases
    : [{ id: "fallback-case", title: "Publicacion en proceso", image: FALLBACK_CASE_IMAGE }];

  const scrollByAmount = (direction) => {
    const container = scrollerRef.current;
    if (!container) return;

    const firstCardWidth = container.firstElementChild?.clientWidth ?? 0;
    const styles = window.getComputedStyle(container);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");
    const amount =
      firstCardWidth > 0 ? Math.round(firstCardWidth + gap) : Math.round(container.clientWidth * 0.82);
    const maxLeft = Math.max(0, container.scrollWidth - container.clientWidth);

    if (direction === "right") {
      const nearEnd = container.scrollLeft >= maxLeft - 8;
      if (nearEnd) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: amount, behavior: "smooth" });
      }
      return;
    }

    const nearStart = container.scrollLeft <= 8;
    if (nearStart) {
      container.scrollTo({ left: maxLeft, behavior: "smooth" });
    } else {
      container.scrollBy({ left: -amount, behavior: "smooth" });
    }
  };

  return (
    <>
      <section id="casos-clinicos" className="scroll-mt-24 bg-transparent py-22 text-[#0f5a52] sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
          <RevealOnScroll>
            <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#1f8f7d]/78">Modelo SaludB</p>
                <h2 className="mt-4 max-w-4xl text-balance text-4xl leading-[1] text-[#0f5a52] sm:text-5xl">
                  Coordinamos cada caso para evitar atenciones fragmentadas.
                </h2>
              </div>
              <div className="rounded-3xl border border-[#00b89a] bg-[linear-gradient(180deg,#00cba9_0%,#00b89a_100%)] p-5 shadow-[0_16px_36px_-22px_rgba(0,122,103,0.34)]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/86">Atencion en red</p>
                <p className="mt-2 text-sm leading-7 text-white/94">
                  Integramos profesionales, objetivos clinicos y comunicacion con la familia en una sola ruta de cuidado.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <div className="mt-8 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              aria-label="Desplazar resultados hacia la izquierda"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#00b89a] bg-[#00cba9] text-white transition duration-300 hover:bg-[#00b89a]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              aria-label="Desplazar resultados hacia la derecha"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#00b89a] bg-[#00cba9] text-white transition duration-300 hover:bg-[#00b89a]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollerRef} className="hide-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2">
            {content.map((item, index) => (
              <RevealOnScroll
                key={item.id}
                className="w-[74%] shrink-0 snap-start sm:w-[52%] lg:w-[32%]"
                delayClass={index === 0 ? "delay-100" : "delay-150"}
              >
                <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#bfeee3] bg-white shadow-[0_16px_36px_-22px_rgba(15,90,82,0.2)]">
                  <div className="relative aspect-[2/3] overflow-hidden bg-[#f3fffc]">
                    <img
                      src={imageErrors[item.image] ? FALLBACK_CASE_IMAGE : item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-contain object-center"
                      onError={() =>
                        setImageErrors((current) => ({
                          ...current,
                          [item.image]: true,
                        }))
                      }
                    />
                  </div>
                  <div className="flex justify-center p-6">
                    <h3 className="text-center text-xl font-semibold leading-7 tracking-[0.01em] text-[#0f5a52]">
                      {item.title}
                    </h3>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="agenda" className="scroll-mt-24 bg-transparent py-20 text-white sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
          <RevealOnScroll>
            <div
              className="relative overflow-hidden rounded-[2rem] border border-white/28 px-6 py-14 text-center shadow-[0_18px_40px_-45px_rgba(7,62,55,0.45)] sm:px-10"
              style={{
                backgroundImage: "url('/fondoverde.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.24em] text-white/86">Agenda SaludB</p>
                <h2 className="mx-auto mt-4 max-w-3xl text-balance text-4xl leading-[1] text-white sm:text-5xl">
                  Agenda una primera evaluacion para coordinar tu plan domiciliario.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 tracking-[0.02em] text-white/90 sm:text-base">
                  Revisamos tu caso, definimos prioridades y te orientamos con un equipo interdisciplinario segun tus necesidades.
                </p>
                <Link
                  href="/agendaProfesionales"
                  aria-label="Reservar hora"
                  className="mt-8 inline-flex w-full max-w-xs justify-center rounded-full border border-white/35 bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f5a52] transition duration-300 ease-out hover:bg-white/90"
                >
                  Agendar reunión
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
