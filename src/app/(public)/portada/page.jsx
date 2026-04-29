"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const fallbackSlides = [
  {
    id: "fallback-1",
    image: "/fondoverde.png",
    alt: "SaludB atencion domiciliaria",
    badge: "SaludB",
    title: "Atencion integral a domicilio con coordinacion clinica real.",
    text: "Acompanamos a pacientes y familias con un equipo interdisciplinario que trabaja de forma coordinada y personalizada.",
  },
  {
    id: "fallback-2",
    image: "/logo_transparent.png",
    alt: "Atencion domiciliaria SaludB",
    badge: "Region Metropolitana",
    title: "Reducimos barreras de acceso para mejorar calidad de vida.",
    text: "Llevamos atencion de salud al hogar para evitar traslados innecesarios y favorecer la continuidad del cuidado.",
  },
];

export default function Portada() {
  const [dataPortada, setDataPortada] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const API = process.env.NEXT_PUBLIC_API_URL || "https://bartelsmansalud.nativecode.cl";

  async function cargarPortada() {
    try {
      const res = await fetch(`${API}/carruselPortada/seleccionarCarruselPortada`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (!res.ok) {
        setDataPortada([]);
        return;
      }

      const data = await res.json();
      setDataPortada(Array.isArray(data) ? data : []);
    } catch {
      setDataPortada([]);
      toast.error("No se ha podido cargar portada, contacte al administrador del sistema.");
    }
  }

  useEffect(() => {
    cargarPortada();
  }, []);

  const backendSlides = dataPortada
    .filter((item) => Number(item.estadoPublicacionPortada ?? 1) === 1)
    .map((item, index) => ({
      id: `portada-${item.id_publicacionesPortada ?? index}`,
      image: item.imagenPortada
        ? `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${item.imagenPortada}/portada`
        : "/fondoverde.png",
      alt: item.tituloPortadaCarrusel || "Portada SaludB",
      badge: "SaludB",
      title: item.tituloPortadaCarrusel || "Salud integral a domicilio",
      text: item.descripcionPublicacionesPortada || "Atencion personalizada para pacientes y familias en la Region Metropolitana.",
    }));

  const safeSlides = useMemo(
    () => (backendSlides.length > 0 ? backendSlides : fallbackSlides),
    [backendSlides]
  );

  useEffect(() => {
    if (safeSlides.length <= 1) return undefined;

    const intervalId = setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeSlides.length);
    }, 5200);

    return () => clearInterval(intervalId);
  }, [safeSlides.length]);

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + safeSlides.length) % safeSlides.length);
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % safeSlides.length);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current == null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;

    if (Math.abs(distance) > 45) {
      if (distance > 0) {
        goPrev();
      } else {
        goNext();
      }
    }

    touchStartX.current = null;
  };

  return (
    <section id="inicio" className="relative -mt-24 min-h-[100svh] scroll-mt-24 overflow-hidden md:-mt-24">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/fondoverde.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="mx-auto flex min-h-[100svh] w-full max-w-none items-start px-2 pt-28 pb-4 sm:pt-32 sm:pb-8 md:px-8 lg:px-10">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/16 bg-transparent shadow-[0_34px_90px_-56px_rgba(0,0,0,0.62)]">
          <div
            className="relative min-h-[74svh] sm:min-h-[80svh]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {safeSlides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <article
                  key={slide.id}
                  className={[
                    "absolute inset-0 transition-opacity duration-700 ease-out",
                    isActive ? "opacity-100" : "pointer-events-none opacity-0",
                  ].join(" ")}
                >
                  <img
                    src={imageErrors[slide.id] ? "/fondoverde.png" : slide.image}
                    alt={slide.alt}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    onError={() =>
                      setImageErrors((current) => ({
                        ...current,
                        [slide.id]: true,
                      }))
                    }
                  />
                  <div className="absolute inset-x-0 bottom-0 top-0 flex items-end px-6 pb-10 pt-20 sm:px-10 sm:pb-12 md:px-14">
                    <div className="max-w-2xl">
                      <img
                        src="/logo_clean.png"
                        alt="SaludB"
                        width={120}
                        height={120}
                        className="h-20 w-auto object-contain opacity-95 sm:h-18"
                      />
                      <h1 className="mt-4 text-balance text-3xl font-medium leading-tight tracking-[0.01em] text-white sm:text-4xl lg:text-5xl">
                        Salud integral a domicilio
                      </h1>
                      <h2 className="mt-4 text-balance text-xl font-medium leading-tight tracking-[0.01em] text-white/95 sm:text-2xl lg:text-3xl">
                        {slide.title}
                      </h2>
                      <p className="mt-5 max-w-xl text-xs leading-7 tracking-[0.01em] text-white/88 sm:text-sm">
                        {slide.text}
                      </p>

                      <div className="mt-8 mb-3.5 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link
                          href="/agendaProfesionales"
                          aria-label="Agendar evaluacion"
                          className="inline-flex w-full justify-center rounded-full border border-white/22 bg-white px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f5a52] transition duration-300 ease-out hover:bg-white/90 sm:w-auto"
                        >
                          Agendar reunión
                        </Link>
                        <Link
                          href="/#servicios"
                          aria-label="Ir a servicios"
                          className="inline-flex w-full justify-center rounded-full border border-white/35 bg-white/12 px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition duration-300 ease-out hover:bg-white/22 sm:w-auto"
                        >
                          Conoce servicios
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            <div className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-2">
                {safeSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Mostrar slide ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={[
                      "h-2.5 rounded-full transition-all duration-300",
                      activeIndex === index ? "w-8 bg-[#34cdb4]" : "w-2.5 bg-white/45 hover:bg-white/70",
                    ].join(" ")}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Slide anterior"
                  onClick={goPrev}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white transition duration-300 hover:bg-black/55"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Siguiente slide"
                  onClick={goNext}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white transition duration-300 hover:bg-black/55"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-wave" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,320L24,314.7C48,309,96,299,144,293.3C192,288,240,288,288,293.3C336,299,384,309,432,277.3C480,245,528,171,576,154.7C624,139,672,181,720,202.7C768,224,816,224,864,218.7C912,213,960,203,1008,208C1056,213,1104,235,1152,218.7C1200,203,1248,149,1296,160C1344,171,1392,245,1416,282.7L1440,320L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}
