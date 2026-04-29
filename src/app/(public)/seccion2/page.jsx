'use client'

import Link from "next/link";
import RevealOnScroll from "@/Componentes/RevealOnScroll";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Seccion2() {
  const API = process.env.NEXT_PUBLIC_API_URL || "https://bartelsmansalud.nativecode.cl";
  const [infoData, setInfoData] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [carouselApi, setCarouselApi] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallbackServices = [
    {
      id: "srv-1",
      name: "Kinesiologia a domicilio",
      description: "Rehabilitacion funcional, manejo del dolor y mejora de movilidad con plan personalizado.",
      image: "/logo_transparent.png",
    },
    {
      id: "srv-2",
      name: "Terapia ocupacional",
      description: "Intervencion para promover independencia en actividades diarias y adaptacion del entorno.",
      image: "/logo_transparent.png",
    },
    {
      id: "srv-3",
      name: "Medicina general y geriatria",
      description: "Evaluacion, diagnostico y seguimiento clinico continuo en domicilio.",
      image: "/logo_transparent.png",
    },
  ];

  async function loadServices() {
    try {
      const mapTituloDetalle = (items) =>
        items.map((item, index) => ({
          id: `titulo-${item.id_publicacionesTituloDescripcion ?? index}`,
          name: (item.publicacionesTitulo || "").trim() || `Publicacion ${index + 1}`,
          description:
            (item.publicacionesDescripcion || "").trim() ||
            "Atencion personalizada con acompanamiento profesional y seguimiento continuo para resultados sostenibles.",
          image: item.publicacionesTituloDescripcionImagen
            ? `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${item.publicacionesTituloDescripcionImagen}/card`
            : "/logo_transparent.png",
        }));

      const mapPublicaciones = (items) =>
        items.map((item, index) => ({
          id: `publicacion-${item.id_publicaciones ?? index}`,
          name: (item.descripcionPublicaciones || "").trim() || `Publicacion ${index + 1}`,
          description:
            "Atencion personalizada con acompanamiento profesional y seguimiento continuo para resultados sostenibles.",
          image: item.imagenPublicaciones_primera
            ? `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${item.imagenPublicaciones_primera}/full`
            : "/logo_transparent.png",
        }));

      const resTitulo = await fetch(`${API}/publicacionesTituloDetalle/seleccionarPublicacionesTituloDetalle`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (resTitulo.ok) {
        const dataTitulo = await resTitulo.json();
        const activeTitulo = Array.isArray(dataTitulo)
          ? dataTitulo.filter((item) => Number(item.publicacionesTituloDescripcion_estado ?? 1) === 1)
          : [];

        if (activeTitulo.length > 0) {
          setInfoData(mapTituloDetalle(activeTitulo));
          return;
        }
      }

      const resPublicaciones = await fetch(`${API}/publicaciones/seleccionarPublicaciones`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (!resPublicaciones.ok) {
        setInfoData([]);
        return toast.error(`No ha sido posible cargar las imagenes del sistema contacte a soporte de NativeCode`);
      }

      const dataPublicaciones = await resPublicaciones.json();
      const activePublicaciones = Array.isArray(dataPublicaciones)
        ? dataPublicaciones.filter((item) => Number(item.estadoPublicacion ?? 1) === 1)
        : [];
      setInfoData(mapPublicaciones(activePublicaciones));
    } catch {
      setInfoData([]);
      return toast.error(`No ha sido posible cargar las imagenes del sistema contacte a soporte de NativeCode`);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const content = infoData.length > 0 ? infoData : fallbackServices;

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    onSelect();
    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi || content.length <= 1) return;

    const intervalId = setInterval(() => {
      carouselApi.scrollNext();
    }, 5200);

    return () => clearInterval(intervalId);
  }, [carouselApi, content.length]);

  return (
    <section id="servicios" className="relative scroll-mt-24 bg-transparent py-22 text-[#0f5a52] sm:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/fondoblanco.png')",
          backgroundSize: "contain",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat",
          opacity: 0.10,
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#1f8f7d]/80">Servicios coordinados</p>
              <h2 className="mt-4 max-w-4xl text-balance text-4xl font-semibold leading-[1.04] text-[#0f5a52] sm:text-5xl">
                Atencion interdisciplinaria a domicilio para recuperar y mantener funcionalidad.
              </h2>
            </div>
            <Link
              href="/servicios"
              className="inline-flex justify-center rounded-full border border-[#34cdb4] bg-[#34cdb4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#2ab9a2]"
            >
              Ver detalle completo
            </Link>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="mt-12">
          <div className="relative">
            <Carousel
              setApi={setCarouselApi}
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {content.map((service, index) => (
                  <CarouselItem
                    key={service.id ?? service.name}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <Link
                      href="/reserva-hora"
                      aria-label={`Agendar para ${service.name}`}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#bfeee3] bg-white shadow-[0_14px_34px_-24px_rgba(15,90,82,0.24)] transition duration-300 ease-out hover:-translate-y-1"
                    >
                      <div className="relative h-[340px] overflow-hidden bg-[#f2fffb] sm:h-[390px] lg:h-[430px]">
                        <img
                          src={imageErrors[service.id] ? "/logo_transparent.png" : service.image}
                          alt={service.name}
                          className="h-full w-full object-contain transition duration-500 ease-out group-hover:scale-[1.02]"
                          onError={() =>
                            setImageErrors((current) => ({
                              ...current,
                              [service.id]: true,
                            }))
                          }
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold tracking-[0.01em] text-[#0f5a52]">
                          {service.name}
                        </h3>
                        <p className="mt-2 text-sm leading-7 tracking-[0.01em] text-[#2b7268]">
                          {service.description || "Atencion personalizada con acompanamiento profesional y seguimiento continuo para resultados sostenibles."}
                        </p>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-2 top-1/2 z-20 -translate-y-1/2 border-[#bfeee3] bg-white text-[#1f8f7d] hover:bg-[#ecfbf7] disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-35" />
              <CarouselNext className="right-2 top-1/2 z-20 -translate-y-1/2 border-[#bfeee3] bg-white text-[#1f8f7d] hover:bg-[#ecfbf7] disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-35" />
            </Carousel>

            {content.length > 1 && (
              <div className="mt-5 flex items-center justify-center gap-2">
                {content.map((item, index) => (
                  <button
                    key={item.id ?? item.name}
                    type="button"
                    aria-label={`Ir a publicacion ${index + 1}`}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={[
                      "h-2 rounded-full transition-all duration-300",
                      currentIndex === index ? "w-7 bg-[#34cdb4]" : "w-2 bg-[#8fdfcf] hover:bg-[#73d6c4]",
                    ].join(" ")}
                  />
                ))}
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>

      <div className="hero-wave" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#00cba9"
            fillOpacity="1"
            d="M0,320L24,314.7C48,309,96,299,144,293.3C192,288,240,288,288,293.3C336,299,384,309,432,277.3C480,245,528,171,576,154.7C624,139,672,181,720,202.7C768,224,816,224,864,218.7C912,213,960,203,1008,208C1056,213,1104,235,1152,218.7C1200,203,1248,149,1296,160C1344,171,1392,245,1416,282.7L1440,320L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}
