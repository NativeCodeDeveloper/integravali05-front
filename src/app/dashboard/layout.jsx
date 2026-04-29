// app/dashboard/layout.jsx
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import { Michroma } from "next/font/google";
import MobileNav from "./MobileNav";
import SignOutBtn from "./SignOutBtn";

const michroma = Michroma({ weight: "400", subsets: ["latin"], display: "swap" });

export const metadata = {
    title: "Dashboard",
    description: "Panel de administración",
};

export default function DashboardLayout({ children }) {
    return (
        <ClerkProvider>
        <div className="h-screen w-full overflow-hidden bg-white">
            <div className="flex h-full w-full">
                {/* Sidebar */}
                <aside className="hidden md:flex h-screen w-[240px] shrink-0 flex-col bg-gray-900 text-white border-r border-white/[0.06] selection:bg-violet-500/30 font-[family-name:var(--font-inter)]">

                    {/* ── Brand ── */}
                    <div className="relative px-4 pb-3 pt-4 shrink-0">
                        <div className="relative flex justify-center">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-20 w-20 rounded-full bg-violet-500/[0.06] blur-2xl" />
                            </div>
                            <img
                                src="/logo.png"
                                alt="AgendaClinica"
                                className="relative h-32 w-full object-contain object-center drop-shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                            />
                        </div>
                        <div className={`${michroma.className} -mt-1 text-center`}>
                            <p className="text-[11.5px] leading-tight text-white/90 tracking-[0.08em]">AgendaClinica</p>
                        </div>
                        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
                    </div>

                    {/* ── Navigation ── */}
                    <nav className="flex-1 px-3 pt-1 pb-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="space-y-3">

                            {/* — Principal — */}
                            <details className="group">
                                <summary className="flex items-center justify-between px-2 py-1.5 text-[9px] font-medium text-white/35 hover:text-white/55 transition-colors duration-200 cursor-pointer list-none select-none tracking-[0.08em] uppercase">
                                    <span className="flex items-center gap-2">
                                        <svg className="h-3.5 w-3.5 text-cyan-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Inicio
                                    </span>
                                    <svg className="h-3 w-3 text-cyan-400/60 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 ml-1 space-y-0.5 border-l border-white/[0.06] pl-3">
                                    <Link
                                        href="/dashboard"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Resumen Diario
                                    </Link>
                                </div>
                            </details>

                            {/* — Agenda Clínica — */}
                            <details className="group">
                                <summary className="flex items-center justify-between px-2 py-1.5 text-[9px] font-medium text-white/35 hover:text-white/55 transition-colors duration-200 cursor-pointer list-none select-none tracking-[0.08em] uppercase">
                                    <span className="flex items-center gap-2">
                                        <svg className="h-3.5 w-3.5 text-cyan-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Agenda clínica
                                    </span>
                                    <svg className="h-3 w-3 text-cyan-400/60 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 ml-1 space-y-0.5 border-l border-white/[0.06] pl-3">
                                    <Link
                                        href="/dashboard/calendario"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Ingresar Agendamiento
                                    </Link>
                                    <Link
                                        href="/dashboard/calendarioGeneral"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Vista General
                                    </Link>
                                    <Link
                                        href="/dashboard/agendaCitas"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Listado de Reservaciones
                                    </Link>
                                    <Link
                                        href="/dashboard/bloqueosAgenda"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Bloqueos de Agenda
                                    </Link>
                                </div>
                            </details>

                            {/* — Registros Clínicos — */}
                            <details className="group">
                                <summary className="flex items-center justify-between px-2 py-1.5 text-[9px] font-medium text-white/35 hover:text-white/55 transition-colors duration-200 cursor-pointer list-none select-none tracking-[0.08em] uppercase">
                                    <span className="flex items-center gap-2">
                                        <svg className="h-3.5 w-3.5 text-cyan-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Registros
                                    </span>
                                    <svg className="h-3 w-3 text-cyan-400/60 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 ml-1 space-y-0.5 border-l border-white/[0.06] pl-3">

                                    <Link
                                        href="/dashboard/listaPacientes"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Listado de Pacientes
                                    </Link>


                                    <Link
                                        href="/dashboard/GestionPaciente"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Ingreso de Pacientes
                                    </Link>
                                    <Link
                                        href="/dashboard/FichaClinica"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Carpeta del paciente
                                    </Link>
                                </div>
                            </details>

                            {/* — Emisión de Documentos — */}
                            <details className="group">
                                <summary className="flex items-center justify-between px-2 py-1.5 text-[9px] font-medium text-white/35 hover:text-white/55 transition-colors duration-200 cursor-pointer list-none select-none tracking-[0.08em] uppercase">
                                    <span className="flex items-center gap-2">
                                        <svg className="h-3.5 w-3.5 text-cyan-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Documentos
                                    </span>
                                    <svg className="h-3 w-3 text-cyan-400/60 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 ml-1 space-y-0.5 border-l border-white/[0.06] pl-3">
                                    <Link
                                        href="/dashboard/presupuestoTratamiento"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Generacion de Presupuesto
                                    </Link>
                                    <Link
                                        href="/dashboard/recetaRapida"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Receta Rapida
                                    </Link>


                                    <Link
                                        href="/dashboard/recetaLentes"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Receta Lentes
                                    </Link>

                                    <Link
                                        href="/dashboard/examenDocumento"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Solicitar Examenes
                                    </Link>
                                </div>
                            </details>

                            {/* — Gestión de Contenido — */}
                            <details className="group">
                                <summary className="flex items-center justify-between px-2 py-1.5 text-[9px] font-medium text-white/35 hover:text-white/55 transition-colors duration-200 cursor-pointer list-none select-none tracking-[0.08em] uppercase">
                                    <span className="flex items-center gap-2">
                                        <svg className="h-3.5 w-3.5 text-cyan-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Contenido web
                                    </span>
                                    <svg className="h-3 w-3 text-cyan-400/60 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 ml-1 space-y-0.5 border-l border-white/[0.06] pl-3">
                                    <Link
                                        href="/dashboard/portadaEdit"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Carrusel de Portada
                                    </Link>
                                    <Link
                                        href="/dashboard/publicacionesTituloDescripcion"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Carrusel Seccion 1
                                    </Link>
                                    <Link
                                        href="/dashboard/publicaciones"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Carrusel seccion 2
                                    </Link>
                                </div>
                            </details>

                            {/* — Configuraciones — */}
                            <details className="group">
                                <summary className="flex items-center justify-between px-2 py-1.5 text-[9px] font-medium text-white/35 hover:text-white/55 transition-colors duration-200 cursor-pointer list-none select-none tracking-[0.08em] uppercase">
                                    <span className="flex items-center gap-2">
                                        <svg className="h-3.5 w-3.5 text-cyan-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Configuraciones
                                    </span>
                                    <svg className="h-3 w-3 text-cyan-400/60 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 ml-1 space-y-0.5 border-l border-white/[0.06] pl-3">
                                    <Link
                                        href="/dashboard/profesionales"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Registro de Agendas
                                    </Link>
                                    <Link
                                        href="/dashboard/serviciosAgendamiento"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Prestaciones en Agenda
                                    </Link>
                                    <Link
                                        href="/dashboard/tarifaServicio"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Cobro por Consulta
                                    </Link>
                                    <Link
                                        href="/dashboard/fichasClinicasPlantillas"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Fichas Clinicas
                                    </Link>
                                    <Link
                                        href="/dashboard/ingresoProductos"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Tratamientos y Servicios
                                    </Link>
                                    <Link
                                        href="/dashboard/categoriasProductos"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Categorias Servicios Tratamientos
                                    </Link>
                                    <Link
                                        href="/dashboard/examenesClinicos"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Ingreso de Examenes
                                    </Link>
                                </div>
                            </details>

                        </div>

                        {/* ── Atajos ── */}
                        <div className="mt-5 pt-4 relative">
                            <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />
                            <div className="px-2 flex items-center gap-2 text-[9px] font-medium text-white/30 tracking-[0.08em] uppercase">
                                <svg className="h-3.5 w-3.5 text-cyan-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                Atajos
                            </div>
                            <div className="mt-1.5 ml-1 space-y-0.5 border-l border-white/[0.06] pl-3">
                                <Link
                                    href="/"
                                    className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                >
                                    <svg className="h-3.5 w-3.5 text-cyan-400/70 group-hover/link:text-cyan-300 transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                                    </svg>
                                    Volver al sitio
                                </Link>
                                <SignOutBtn />
                            </div>
                        </div>
                    </nav>

                    {/* ── Footer status ── */}
                    <div className="relative px-3 py-3 shrink-0">
                        <div className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />
                        <div className="rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] ring-1 ring-white/[0.07] px-3.5 py-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[9.5px] font-semibold text-white/25 tracking-[0.1em] uppercase">Sistema</div>
                                    <div className="mt-0.5 text-[12px] font-medium text-white/65">Operativo</div>
                                </div>
                                <div className="relative flex items-center gap-1.5">
                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-emerald-400/10 animate-ping" />
                                    <span className="relative h-2 w-2 rounded-full bg-emerald-400 block shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0 h-full overflow-y-auto">
                    <MobileNav />

                    <main className="min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
        </ClerkProvider>
    );
}
