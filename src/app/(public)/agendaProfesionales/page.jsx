"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AgendaProfesionales() {
  const API = process.env.NEXT_PUBLIC_API_URL || "https://bartelsmansalud.nativecode.cl";
  const router = useRouter();
  const [listaProfesionales, setListaProfesionales] = useState([]);
  const esSeleccionUnica = listaProfesionales.length === 1;

  function irAgendaProfesional(id_profesional) {
    router.push(`/agendaEspecificaProfersional/${id_profesional}`);
  }

  async function seleccionarProfesionales() {
    try {
      const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      const dataProfesionales = await res.json();
      setListaProfesionales(dataProfesionales);
    } catch {
      return toast.error("No ha sido posible listar profesionales, contacte a soporte IT");
    }
  }

  useEffect(() => {
    seleccionarProfesionales();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7f6] px-4 pb-20 pt-20 text-slate-900 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,#f7fafa_0%,#f0f5f4_52%,#edf3f2_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,rgba(90,172,168,0.22),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex justify-start">
          <a
            href="https://profesionales-itegravali.agendaclinicas.cl"
            className="inline-flex items-center gap-2 rounded-full border border-[#C1D9D3] bg-white px-5 py-2.5 text-sm font-semibold text-[#3D7B7B] shadow-sm transition-all duration-300 hover:border-[#7BBAB3] hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Volver
          </a>
        </div>
        <div className="animate-reveal-up-delay grid grid-cols-1 justify-items-center gap-5">
          {listaProfesionales.map((profesional, index) => (
            <button
              key={profesional.id_profesional}
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => irAgendaProfesional(profesional.id_profesional)}
              className={`animate-reveal-up group relative flex w-full flex-col overflow-hidden text-left opacity-0 transition-all duration-500 hover:-translate-y-1.5 ${
                esSeleccionUnica
                  ? "max-w-5xl rounded-[32px] border border-[#c1d9d3] bg-[linear-gradient(135deg,rgba(255,255,255,0.99)_0%,rgba(247,250,249,0.98)_48%,rgba(241,246,245,0.98)_100%)] p-7 shadow-[0_30px_70px_-40px_rgba(45,94,94,0.20)] ring-1 ring-white hover:border-[#7BBAB3] hover:shadow-[0_36px_82px_-44px_rgba(45,94,94,0.26)] sm:p-9 lg:p-10"
                  : "max-w-4xl rounded-[28px] border border-[#c1d9d3] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,250,249,0.98)_100%)] p-7 shadow-[0_22px_54px_-36px_rgba(45,94,94,0.20)] ring-1 ring-white hover:border-[#72B5AE] hover:shadow-[0_28px_64px_-38px_rgba(45,94,94,0.26)] sm:p-8 lg:p-9"
              }`}
            >
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(circle_at_top_right,rgba(90,172,168,0.18),transparent_58%)]" />
              <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-[linear-gradient(120deg,rgba(255,255,255,0.64)_0%,transparent_38%)]" />
              <div className="absolute left-0 top-0 h-[3px] w-0 bg-gradient-to-r from-[#5AACA8] via-[#8CB438] to-[#C5E2DD] transition-all duration-500 group-hover:w-full" />
              <div className={`pointer-events-none absolute border border-[#e8f0ee] ${esSeleccionUnica ? "inset-[14px] rounded-[26px]" : "inset-[16px] rounded-[22px]"}`} />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className={`grid gap-6 lg:items-start ${esSeleccionUnica ? "lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]" : "lg:grid-cols-[minmax(0,1.45fr)_minmax(240px,0.85fr)]"}`}>
                  <div className="max-w-2xl">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#9DCDC6] bg-[linear-gradient(180deg,#EEF7F6_0%,#D5EDE9_100%)] text-xl font-bold text-[#3D8585] shadow-[0_14px_30px_-20px_rgba(90,172,168,0.35)] transition-all duration-500 group-hover:border-[#7BBFB8] group-hover:bg-[linear-gradient(180deg,#ECF6F5_0%,#D0EAE6_100%)]">
                        {profesional.nombreProfesional?.charAt(0)}
                      </div>
                      {esSeleccionUnica && (
                        <div className="rounded-full border border-[#C5DDD8] bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5F8580] backdrop-blur-sm">
                          Atención cercana
                        </div>
                      )}
                    </div>

                    <h2 className={`mt-6 font-semibold tracking-[-0.04em] text-[#1F4A4A] ${esSeleccionUnica ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"}`}>
                      {profesional.nombreProfesional}
                    </h2>
                    <div className="mt-5 inline-flex rounded-2xl border border-[#C5DDD8] bg-[#EFF7F6] px-5 py-3 shadow-[0_10px_24px_-20px_rgba(90,172,168,0.28)]">
                      <p className={`font-semibold text-[#2D6B6B] ${esSeleccionUnica ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
                        {profesional.descripcionProfesional}
                      </p>
                    </div>

                    {!esSeleccionUnica && (
                      <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#507070]">
                        Selecciona este profesional para revisar su disponibilidad y continuar con la reserva.
                      </p>
                    )}

                    {esSeleccionUnica && (
                      <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#507070] sm:text-base">
                        Agenda una atención de forma simple y revisa los horarios disponibles para continuar con tu reserva.
                      </p>
                    )}

                    <div className="mt-7 max-w-sm">
                      <div className="flex items-center justify-between rounded-[22px] bg-[linear-gradient(90deg,#3D7B7B_0%,#5AACA8_100%)] px-6 py-4 text-white shadow-[0_20px_45px_-28px_rgba(61,123,123,0.55)] transition-all duration-300 group-hover:shadow-[0_24px_55px_-28px_rgba(61,123,123,0.62)]">
                        <span className="text-sm font-semibold uppercase tracking-[0.22em] sm:text-[15px]">
                          Agendar ahora
                        </span>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/14 ring-1 ring-white/22">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-all duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`relative flex flex-col justify-between border border-[#C8DDD8] bg-[linear-gradient(180deg,#FBFEFD_0%,#F2F7F6_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ${esSeleccionUnica ? "min-h-[250px] rounded-[28px] p-6" : "min-h-[210px] rounded-[24px] p-5"}`}>
                    {esSeleccionUnica && (
                      <div className="pointer-events-none absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-[#C5DDD8] to-transparent" />
                    )}
                    <div>
                      {esSeleccionUnica && (
                        <div className="mb-5 rounded-[22px] border border-[#C5DDD8] bg-white p-4 shadow-[0_18px_40px_-30px_rgba(26,75,75,0.18)]">
                          <div className="relative mx-auto flex aspect-[1.05/1] w-full max-w-[180px] items-center justify-center overflow-hidden rounded-[18px]">
                            <Image
                              src="/logointegra.png"
                              alt="Integravali Centro de Terapias Integrales"
                              fill
                              className="object-contain p-4"
                              sizes="220px"
                              priority
                            />
                          </div>
                        </div>
                      )}
                      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#6A8E88]">
                        Siguiente paso
                      </p>
                      <p className={`mt-4 font-semibold tracking-[-0.04em] text-[#1F4A4A] ${esSeleccionUnica ? "text-3xl" : "text-2xl"}`}>
                        Revisar horarios
                      </p>
                      <p className={`mt-3 leading-6 text-[#5A7E78] ${esSeleccionUnica ? "text-[15px]" : "text-sm"}`}>
                        {esSeleccionUnica
                          ? "Podrás ver los horarios disponibles y elegir el momento que mejor se ajuste a tu atención."
                          : "Ingresa a la disponibilidad del profesional y continua con la reserva de forma clara y directa."}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
