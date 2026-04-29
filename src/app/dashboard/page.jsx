"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import OrbBackground from "@/components/OrbBackground";
import { Michroma } from "next/font/google";
import { motion } from "framer-motion";
import {
    CalendarDays,
    Users,
    ClipboardList,
    TrendingUp,
    UserPlus,
    CalendarPlus,
    FileText,
    Calendar,
    ChevronRight,
    Clock,
    ArrowUpRight,
    Activity,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const michroma = Michroma({ weight: "400", subsets: ["latin"], display: "swap" });

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] },
    }),
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } },
};

const acciones = [
    { label: "Nuevo paciente", desc: "Registrar", icon: UserPlus, href: "/dashboard/GestionPaciente", color: "from-teal-500 to-teal-700" },
    { label: "Nueva cita", desc: "Agendar", icon: CalendarPlus, href: "/dashboard/calendario", color: "from-indigo-600 to-indigo-800" },
    { label: "Ficha clinica", desc: "Consultar", icon: FileText, href: "/dashboard/FichaClinica", color: "from-indigo-700 to-teal-600" },
    { label: "Calendario", desc: "Ver agenda", icon: Calendar, href: "/dashboard/calendarioGeneral", color: "from-teal-600 to-indigo-700" },
];

function getFechaHoy() {
    return new Date().toLocaleDateString("es-CL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Buenos dias";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
}

function normalizarEstadoReserva(estado = "") {
    return String(estado)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function estadoDotClass(estado) {
    const normalizado = normalizarEstadoReserva(estado);
    if (normalizado === "asiste") return "bg-cyan-400 shadow-sm shadow-cyan-400/40";
    if (normalizado === "no asiste" || normalizado === "no asistio" || normalizado === "no asistste") return "bg-pink-400 shadow-sm shadow-pink-400/40";
    if (normalizado === "finalizado") return "bg-orange-400 shadow-sm shadow-orange-400/40";
    if (normalizado === "confirmada") return "bg-emerald-400 shadow-sm shadow-emerald-400/40";
    if (normalizado === "reservada") return "bg-indigo-400 shadow-sm shadow-indigo-400/40";
    if (normalizado === "anulada") return "bg-red-400 shadow-sm shadow-red-400/40";
    return "bg-slate-300";
}

function estadoBadgeClass(estado) {
    const normalizado = normalizarEstadoReserva(estado);
    if (normalizado === "asiste") return "bg-cyan-500/15 text-cyan-500";
    if (normalizado === "no asiste" || normalizado === "no asistio" || normalizado === "no asistste") return "bg-pink-500/15 text-pink-500";
    if (normalizado === "finalizado") return "bg-orange-500/15 text-orange-500";
    if (normalizado === "confirmada") return "bg-emerald-500/15 text-emerald-400";
    if (normalizado === "reservada") return "bg-indigo-500/15 text-indigo-400";
    if (normalizado === "anulada") return "bg-red-500/15 text-red-400";
    return "bg-slate-100 text-slate-500";
}

function MiniCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const { firstDayOffset, daysInMonth, monthLabel } = useMemo(() => {
        const first = new Date(year, month, 1).getDay();
        const offset = first === 0 ? 6 : first - 1;
        const days = new Date(year, month + 1, 0).getDate();
        const label = new Date(year, month).toLocaleDateString("es-CL", { month: "long", year: "numeric" });
        return { firstDayOffset: offset, daysInMonth: days, monthLabel: label };
    }, [year, month]);

    return (
        <div className="rounded-[24px] border border-slate-300 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-semibold capitalize text-slate-700">{monthLabel}</span>
                <Link href="/dashboard/calendarioGeneral" className="text-[11px] font-medium text-indigo-600 transition-colors hover:text-indigo-700">
                    Expandir
                </Link>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d) => (
                    <span key={d} className="pb-2 text-[10px] font-bold uppercase text-slate-400">
                        {d}
                    </span>
                ))}
                {Array.from({ length: firstDayOffset }, (_, i) => (
                    <span key={`e-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const isToday = day === today;
                    return (
                        <span
                            key={day}
                            className={cn(
                                "flex h-7 w-full items-center justify-center rounded-lg text-[10px] font-medium transition-all duration-200",
                                isToday
                                    ? "bg-gradient-to-br from-indigo-700 to-teal-600 text-white shadow-md shadow-indigo-500/30 scale-110"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}
                        >
                            {day}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

export default function DashboardHome() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [dataLista, setdataLista] = useState([]);

    async function buscarCitasHoy() {
        try {
            const hoy = new Date().toISOString().split("T")[0];

            const res = await fetch(`${API}/reservaPacientes/buscarEntreFechas`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fechaInicio: hoy, fechaFinalizacion: hoy }),
                mode: "cors",
            });

            if (!res.ok) {
                return toast.error("Error al buscar citas. Por favor, intente de nuevo.");
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend && Array.isArray(respuestaBackend) && respuestaBackend.length > 0) {
                setdataLista(respuestaBackend);
            } else {
                setdataLista([]);
            }
        } catch (error) {
            console.log(error);
            return toast.error("Error inesperado al buscar citas. Por favor, contacte a soporte tecnico.");
        }
    }

    useEffect(() => {
        buscarCitasHoy();
    }, []);

    const citasHoy = dataLista.map((cita) => ({
        hora: cita.horaInicio || "--:--",
        paciente: `${cita.nombrePaciente || ""} ${cita.apellidoPaciente || ""}`.trim(),
        tipo: cita.estadoReserva || "Sin estado",
        estado: normalizarEstadoReserva(cita.estadoReserva || "reservada"),
        iniciales: `${(cita.nombrePaciente || "")[0] || ""}${(cita.apellidoPaciente || "")[0] || ""}`.toUpperCase(),
        nombreProfesional: cita.nombreProfesional || "Sin profesional",
    }));

    const totalCitas = dataLista.length;
    const citasConfirmadas = dataLista.filter((c) => c.estadoReserva?.toLowerCase() === "confirmada").length;
    const citasAnuladas = dataLista.filter((c) => c.estadoReserva?.toLowerCase() === "anulada").length;
    const citasReservadas = dataLista.filter((c) => c.estadoReserva?.toLowerCase() === "reservada").length;

    const kpis = [
        { label: "Citas para hoy", value: totalCitas, icon: CalendarDays, color: "from-teal-400 to-teal-600", glow: "teal", pct: 100 },
        { label: "Confirmadas", value: citasConfirmadas, icon: TrendingUp, color: "from-indigo-700 to-teal-600", glow: "teal", pct: totalCitas > 0 ? Math.round((citasConfirmadas / totalCitas) * 100) : 0 },
        { label: "Anuladas", value: citasAnuladas, icon: ClipboardList, color: "from-indigo-500 to-indigo-700", glow: "indigo", pct: totalCitas > 0 ? Math.round((citasAnuladas / totalCitas) * 100) : 0 },
        { label: "Reservadas", value: citasReservadas, icon: Users, color: "from-teal-600 to-indigo-700", glow: "indigo", pct: totalCitas > 0 ? Math.round((citasReservadas / totalCitas) * 100) : 0 },
    ];

    return (
        <OrbBackground>
            <div className="mx-auto min-h-screen max-w-6xl px-4 py-5 sm:px-6 lg:px-10">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    className="mb-5"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="mt-2 flex items-center gap-4">
                                <h1 className={cn("text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl", michroma.className)}>
                                    AgendaClinica
                                </h1>
                            </div>
                            <p className={cn("mt-1.5 text-[12px] font-bold tracking-wide text-slate-400", michroma.className)}>Healthcare Information System</p>
                        </div>

                        <div className="hidden items-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.12)] sm:flex">
                            <div className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </div>
                            <span className="text-[12px] font-semibold text-slate-700">{getGreeting()}</span>
                            <span className="hidden h-3 w-px bg-slate-200 sm:block" />
                            <span className="text-[12px] capitalize text-slate-500">{getFechaHoy()}</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="mb-5 grid grid-cols-2 gap-2 lg:grid-cols-4"
                >
                    {kpis.map((kpi, i) => {
                        const Icon = kpi.icon;
                        const glowColors = {
                            teal: { blob1: "bg-teal-500", blob2: "bg-teal-400", bar: "from-teal-400 to-teal-600", barShadow: "shadow-teal-500/40", iconRing: "ring-teal-400/30", iconShadow: "shadow-teal-500/30", pctText: "text-teal-400", dotBg: "bg-teal-400", dotGlow: "bg-teal-400" },
                            indigo: { blob1: "bg-indigo-500", blob2: "bg-indigo-400", bar: "from-indigo-400 to-indigo-600", barShadow: "shadow-indigo-500/40", iconRing: "ring-indigo-400/30", iconShadow: "shadow-indigo-500/30", pctText: "text-indigo-400", dotBg: "bg-indigo-400", dotGlow: "bg-indigo-400" },
                        };
                        const g = glowColors[kpi.glow];

                        return (
                            <motion.div
                                key={kpi.label}
                                variants={fadeUp}
                                custom={i + 1}
                                className="group relative cursor-default overflow-hidden rounded-lg border border-slate-300 bg-white p-2.5 shadow-[0_16px_40px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(15,23,42,0.16)]"
                            >
                                <div className={cn("pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full opacity-[0.1] blur-3xl transition-opacity group-hover:opacity-[0.16]", g.blob1)} />
                                <div className={cn("pointer-events-none absolute -bottom-5 -left-5 h-16 w-16 rounded-full opacity-[0.06] blur-3xl", g.blob2)} />

                                <div className="relative">
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg ring-2", kpi.color, g.iconShadow, g.iconRing)}>
                                            <Icon className="h-3.5 w-3.5 text-white" strokeWidth={1.8} />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="relative flex h-1 w-1">
                                                <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60", g.dotGlow)} />
                                                <span className={cn("relative inline-flex h-1 w-1 rounded-full", g.dotBg)} />
                                            </span>
                                            <span className={cn("text-[9px] font-semibold tabular-nums", g.pctText)}>{kpi.pct}%</span>
                                        </div>
                                    </div>

                                    <div className="text-lg font-extrabold tracking-tight text-slate-900">
                                        {kpi.value}
                                    </div>

                                    <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                        {kpi.label}
                                    </span>

                                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={cn("h-full rounded-full bg-gradient-to-r shadow-sm", g.bar, g.barShadow)}
                                            style={{ width: `${Math.max(kpi.pct, 3)}%` }}
                                        />
                                    </div>
                                    <div className="mt-1 flex items-center justify-between">
                                        <span className="text-[8px] font-medium text-slate-400">del total de hoy</span>
                                        <span className="text-[9px] font-semibold tabular-nums text-slate-600">{kpi.value}/{totalCitas}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={5}
                        className="overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)] lg:col-span-2"
                    >
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-700 to-teal-600 shadow-sm shadow-indigo-500/20">
                                    <Clock className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                                </div>
                                <div>
                                    <h2 className="text-[14px] font-semibold text-slate-900">Proximas citas</h2>
                                    <p className="text-[11px] text-slate-500">Agenda de hoy</p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard/agendaCitas"
                                className="group/link flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-all hover:border-indigo-400/30 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                                Ver todo
                                <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-200">
                            {citasHoy.length === 0 ? (
                                <div className="px-6 py-10 text-center">
                                    <p className="text-sm text-slate-500">No hay citas programadas para hoy</p>
                                </div>
                            ) : (
                                citasHoy.map((cita, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={idx * 0.5 + 6}
                                        className="group flex items-center gap-3 px-4 py-2.5 transition-all duration-200 hover:bg-slate-50"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-[13px] font-bold tabular-nums text-slate-900">{cita.hora}</span>
                                            <span className="text-[10px] font-medium text-slate-400">hrs</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-0.5">
                                            <div className={cn("h-2 w-2 rounded-full", estadoDotClass(cita.estado))} />
                                            <div className="h-6 w-px bg-slate-200" />
                                        </div>

                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                                            {cita.iniciales}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-[12px] font-semibold text-slate-900">{cita.paciente}</div>
                                            <div className="text-[11px] text-slate-500">{cita.tipo}</div>
                                        </div>

                                        <span className={cn(
                                            "hidden sm:inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium capitalize",
                                            estadoBadgeClass(cita.estado)
                                        )}>
                                            <span className={cn("h-1 w-1 rounded-full", estadoDotClass(cita.estado))} />
                                            {cita.nombreProfesional}
                                        </span>

                                        <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                                    </motion.div>
                                ))
                            )}
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2.5">
                            <div className="flex items-center gap-2">
                                <Activity className="h-3.5 w-3.5 text-slate-500" />
                                <span className="text-[11px] text-slate-500">{citasHoy.length} citas programadas para hoy</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                <span className="text-[11px] text-slate-500">{citasConfirmadas} confirmadas</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 ml-2" />
                                <span className="text-[11px] text-slate-500">{citasReservadas} reservadas</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="space-y-3.5">
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={6}
                            className="rounded-[24px] border border-slate-300 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-indigo-500" strokeWidth={2} />
                                <h2 className="text-[14px] font-semibold text-slate-900">Acciones rapidas</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                                {acciones.map((acc) => {
                                    const Icon = acc.icon;
                                    return (
                                        <Link
                                            key={acc.label}
                                            href={acc.href}
                                            className="group relative flex flex-col items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
                                        >
                                            <div className={cn(
                                                "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm transition-transform duration-300 group-hover:scale-110",
                                                acc.color
                                            )}>
                                                <Icon className="h-4.5 w-4.5 text-white" strokeWidth={1.8} />
                                            </div>
                                            <div>
                                                <span className="block text-[11px] font-semibold text-slate-800">{acc.label}</span>
                                                <span className="block text-[10px] text-slate-500">{acc.desc}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={7}
                        >
                            <MiniCalendar />
                        </motion.div>
                    </div>
                </div>
            </div>
        </OrbBackground>
    );
}
