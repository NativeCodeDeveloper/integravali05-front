"use client";
import {useMemo, useState, useEffect, useRef} from "react";
import {useAgenda} from "@/ContextosGlobales/AgendaContext";
import Link from "next/link";
import ShadcnButton2 from "@/Componentes/shadcnButton2";
import {toast} from "react-hot-toast";
import * as React from "react";
import {useParams, useRouter} from "next/navigation";

function formatDateToYMD(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export default function CalendarioMensualHoras() {
    const {id_profesional} = useParams();
    const [nombreProfesional, setNombreProfesional] = useState("");
    const [mesActual, setMesActual] = useState(new Date());
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    // Ref para evitar que resultados asíncronos antiguos sobrescriban acciones manuales recientes
    const lastManualUpdateRef = useRef(0);
    const API = process.env.NEXT_PUBLIC_API_URL;
    
    const router = useRouter();
    
    function formularioReservaProfesional(id_profesional) {
        router.push(`/formularioReservaProfesional/${id_profesional}`);
    }

    useEffect(() => {
        async function obtenerNombreProfesional() {
            try {
                const res = await fetch(`${API}/profesionales/seleccionarProfesional`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({id_profesional})
                });
                const data = await res.json();
                if (data && data[0]?.nombreProfesional) {
                    setNombreProfesional(data[0].nombreProfesional);
                }
            } catch (err) {
                console.error("Error obteniendo nombre profesional:", err);
            }
        }
        if (id_profesional) obtenerNombreProfesional();
    }, [id_profesional]);

    const {
        horaInicio, setHoraInicio,
        setHoraFin,
        setFechaInicio,
        setFechaFinalizacion
    } = useAgenda();


    /* ---------- utilidades ---------- */
    const generarDiasMes = () => {
        const year = mesActual.getFullYear();
        const month = mesActual.getMonth();
        const firstDay = new Date(year, month, 1).getDay(); // 0=domingo
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const dias = [];
        for (let i = 0; i < firstDay; i++) dias.push(null);
        for (let d = 1; d <= daysInMonth; d++) dias.push(new Date(year, month, d));
        return dias;
    };

    // Genera los bloques de atención (60 min) según el día de la semana
    // Lunes a Sábado: 09:00 - 22:00
    // Domingo: No disponible
    // Los inicios van separados por 70 minutos (60 atención + 10 descanso), pero los descansos no se muestran.
    const attentionSlots = useMemo(() => {
        if (!fechaSeleccionada) return [];

        const dayOfWeek = fechaSeleccionada.getDay(); // 0=domingo, 6=sábado

        // Domingo no tiene horarios
        if (dayOfWeek === 0) return [];

        const slots = [];
        const startMinutes = 9 * 60; // 09:00
        // Lunes a Sábado hasta 22:00
        const endMinutes = 22 * 60;
        let cursor = startMinutes;

        const minutesToHHMM = (min) => {
            const hh = Math.floor(min / 60);
            const mm = min % 60;
            return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
        };

        while (cursor + 60 <= endMinutes) {
            const attStart = cursor;
            const attEnd = cursor + 60;
            slots.push({start: minutesToHHMM(attStart), end: minutesToHHMM(attEnd)});
            // avanzar 60 + 10 minutos (=70) para el siguiente inicio
            cursor = attEnd + 10;
        }

        return slots;
    }, [fechaSeleccionada]);

    const addMinutesToHHMM = (hhmm, minutesToAdd) => {
        const [hh, mm] = hhmm.split(":").map(Number);
        const total = hh * 60 + mm + minutesToAdd;
        const newH = Math.floor(total / 60);
        const newM = total % 60;
        return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
    };

    const hhmmToMinutes = (hhmm) => {
        const [hh, mm] = hhmm.split(":").map(Number);
        return (hh * 60) + mm;
    };

    /* ---------- handlers ---------- */
    const seleccionarFecha = (fecha) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const day = new Date(fecha);
        day.setHours(0, 0, 0, 0);

        if (day < today) {
            toast.error("No puedes agendar en fechas pasadas");
            return;
        }

        // Validar que no sea domingo
        const dayOfWeek = fecha.getDay();
        if (dayOfWeek === 0) {
            toast.error("Las atenciones son de Lunes a Sábado.\nLun-Sáb: 9:00-22:00", {
                duration: 4000,
                style: {
                    background: '#FEE2E2',
                    color: '#991B1B',
                    border: '1px solid #FCA5A5',
                }
            });
            return;
        }

        setFechaSeleccionada(fecha);

        const fechaYMD = formatDateToYMD(fecha);

        // Si ya hay hora seleccionada, mantenla y recalcula las cadenas en el contexto
        if (horaInicio) {
            const horaFinAuto = addMinutesToHHMM(horaInicio, 60);
            setHoraFin(horaFinAuto);
            setFechaInicio(fechaYMD);
            setFechaFinalizacion(fechaYMD);
            return;
        }

        // Si aún no hay hora, solo dejamos la fecha lista (fechaInicio vacía hasta elegir hora)
        setHoraFin("");
        setFechaInicio("");
        setFechaFinalizacion("");
    };

    const seleccionarInicio = (hora) => {
        // Bloquear horas pasadas si la fecha seleccionada es hoy
        if (fechaSeleccionada) {
            const today = new Date();
            const day = new Date(fechaSeleccionada);
            today.setHours(0, 0, 0, 0);
            day.setHours(0, 0, 0, 0);

            const isToday = day.getTime() === today.getTime();
            if (isToday) {
                const now = new Date();
                const nowMinutes = (now.getHours() * 60) + now.getMinutes();
                const slotStartMinutes = hhmmToMinutes(hora);

                // Si el bloque ya empezó, no permitir agendar
                if (slotStartMinutes < nowMinutes) {
                    toast.error("No puedes agendar una hora que ya pasó");
                    return;
                }
            }
        }

        const horaFinAuto = addMinutesToHHMM(hora, 60);

        setHoraInicio(hora);
        setHoraFin(horaFinAuto);

        // Guardamos las strings en el contexto: fechaYYYY-MM-DD y hora HH:MM
        if (fechaSeleccionada) {
            const fechaYMD = formatDateToYMD(fechaSeleccionada);
            setFechaInicio(fechaYMD);
            setFechaFinalizacion(fechaYMD);

            // Marcar acción manual para que cualquier checkBlocked en curso no sobreescriba cambios
            lastManualUpdateRef.current = Date.now();

            // Revalidar slots adyacentes para evitar que la selección haga que los vecinos aparezcan bloqueados
            (async () => {
                try {
                    const idx = attentionSlots.findIndex(s => s.start === hora);
                    if (idx === -1) return;

                    const neighbors = [];
                    if (idx - 1 >= 0) neighbors.push(attentionSlots[idx - 1]);
                    if (idx + 1 < attentionSlots.length) neighbors.push(attentionSlots[idx + 1]);

                    for (const n of neighbors) {
                        const res = await validarFechaDisponible(formatDateToYMD(fechaSeleccionada), n.start, formatDateToYMD(fechaSeleccionada), n.end, false, id_profesional);
                        // res is object {available, ...}
                        if (res && res.available) {
                            setBlockedHours(prev => {
                                if (!prev.has(n.start)) return prev;
                                const copy = new Set(prev);
                                copy.delete(n.start);
                                // actualizar resumen también
                                setCheckSummary({blocked: copy.size, total: attentionSlots.length});
                                return copy;
                            });
                        }
                    }
                } catch (err) {
                    console.error('Error revalidando vecinos:', err);
                }
            })();
        }
    };

    const dias = generarDiasMes();


    const [blockedHours, setBlockedHours] = useState(new Set());
    const [checkingBlocked, setCheckingBlocked] = useState(false);
    const [checkSummary, setCheckSummary] = useState({blocked: 0, total: 0});

    // Comprueba si un slot está disponible. Devuelve true si está disponible, false si está ocupado.
    // showToast: opcional, si true mostrará mensajes de error al usuario.
    async function validarFechaDisponible(fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, showToast = false, id_profesional) {
        try {
            // validación mínima de parámetros
            if (!fechaInicio || !fechaFinalizacion || !horaInicio || !horaFinalizacion) {
                if (showToast) toast.error('Debe seleccionar fecha y hora para validar disponibilidad');
                return false;
            }

            const res = await fetch(`${API}/reservaPacientes/validar`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, id_profesional})
            });

            let respuestaBackend;
            try {
                respuestaBackend = await res.json();
            } catch (err) {
                respuestaBackend = null;
            }

            const status = res.status;

            // Logging para depuración
            console.debug('validarFechaDisponible ->', {
                fechaInicio,
                horaInicio,
                fechaFinalizacion,
                horaFinalizacion,
                status,
                body: respuestaBackend
            });

            // Determinar disponibilidad
            if (respuestaBackend && respuestaBackend.message === true) return {
                available: true,
                status,
                body: respuestaBackend,
                error: false
            };
            if (respuestaBackend && respuestaBackend.message === false) return {
                available: false,
                status,
                body: respuestaBackend,
                error: false
            };

            if (res.ok) return {available: true, status, body: respuestaBackend, error: false};

            // status no OK y sin body
            if (!res.ok) {
                if (showToast) toast.error('No hay respuesta válida del servidor');
                return {available: false, status, body: respuestaBackend, error: false};
            }
        } catch (error) {
            if (showToast) toast.error('Error de red al validar disponibilidad');
            console.error('validarFechaDisponible error:', error);
            return {available: true, status: 0, body: null, error: true};
        }
    }

    // Cuando el usuario selecciona una fecha, comprobamos en paralelo los slots y guardamos los bloqueados
    useEffect(() => {
        let mounted = true;
        const checkStart = Date.now();

        async function checkBlocked() {
            if (!fechaSeleccionada) {
                if (mounted) setBlockedHours(new Set());
                return;
            }

            setCheckingBlocked(true);
            const fechaYMD = formatDateToYMD(fechaSeleccionada);

            try {
                // paralelizamos las comprobaciones por batches para limitar concurrencia
                const attentionEntries = attentionSlots; // ahora es la lista de atenciones (sin descansos)
                const limit = 6; // máximo requests simultáneos
                const checks = [];

                for (let i = 0; i < attentionEntries.length; i += limit) {
                    const batch = attentionEntries.slice(i, i + limit);
                    const batchResults = await Promise.all(batch.map(async (entry) => {
                        const result = await validarFechaDisponible(fechaYMD, entry.start, fechaYMD, entry.end, false, id_profesional);
                        return {h: entry.start, ...result};
                    }));

                    checks.push(...batchResults);
                }

                if (!mounted) return;

                const blocked = new Set(checks.filter(c => c.available === false).map(c => c.h));
                // Si hubo una actualización manual después de que este check comenzó, NO aplicamos su resultado

                if (lastManualUpdateRef.current > checkStart) {
                    console.debug('checkBlocked result skipped because of manual update', {
                        skippedAt: lastManualUpdateRef.current,
                        checkStart
                    });

                } else {
                    setBlockedHours(blocked);
                    // actualizar resumen para debug en UI
                    setCheckSummary({blocked: blocked.size, total: attentionEntries.length});
                }
                console.debug('checkBlocked ->', {total: attentionEntries.length, blocked: blocked.size, raw: checks});



                // si la hora actualmente seleccionada quedó bloqueada, limpiarla
                if (horaInicio && blocked.has(horaInicio)) {
                    setHoraInicio("");
                    setHoraFin("");
                    setFechaInicio("");
                    setFechaFinalizacion("");
                    toast.error('La hora seleccionada ya no está disponible');
                }
            } catch (e) {
                // Si hay fallo general, vaciamos bloqueos y no bloqueamos nada por seguridad
                if (mounted) setBlockedHours(new Set());
            } finally {
                if (mounted) setCheckingBlocked(false);
            }
        }

        checkBlocked();

        return () => {
            mounted = false;
        }
    }, [fechaSeleccionada, attentionSlots]);

    // Evitar llamadas al backend en cada render; useEffect gestiona comprobaciones.

    /* ---------- UI ---------- */
    return (
        <div className="-mt-24 min-h-screen bg-[linear-gradient(180deg,#f7fbfa_0%,#eef7f4_100%)] px-4 py-10 pt-30 sm:-mt-20 sm:px-6 sm:pt-24 lg:px-8">
            <div className="mx-auto w-full max-w-3xl">
                <header className="mb-6 flex flex-col items-center gap-2 text-center">
                    <div
                        className="inline-flex items-center gap-2 rounded-full border border-[#cfe7df] bg-[#edf8f4] px-3 py-1 text-xs font-medium text-[#4f7a72]">
                        Agenda · Online
                    </div>

                    <h1
                        className={`text-3xl sm:text-4xl font-black tracking-widest `}
                    >
                        <span className="bg-gradient-to-r from-[#123f38] via-[#1a5f54] to-[#2b8a7a] text-transparent bg-clip-text ">{nombreProfesional || "Cargando..."}</span>
                        <span
                            className="relative mt-1 block h-1 w-40 max-w-full rounded-full bg-gradient-to-r from-[#58b8a5] via-[#cfe7df] to-transparent"
                        />
                    </h1>

                </header>

                <div className="rounded-2xl border border-[#d7ebe5] bg-white/88 p-4 shadow-[0_22px_55px_-34px_rgba(19,84,73,0.22)] backdrop-blur supports-[backdrop-filter]:bg-white/78 text-slate-800">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-[#173f39]">Agenda mensual</h2>
                        <span className="text-[12px] text-[#6b8b84]">Selecciona un día</span>
                    </div>
                    <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-[#d7ebe5] to-transparent"/>

                    {/* Navegación mes */}
                    <div className="mt-3 flex items-center justify-between">
                        <button
                            className="rounded-lg border border-[#1f6d61] bg-[#1f6d61] px-2.5 py-1 text-xs font-semibold text-white shadow-md shadow-[#1f6d61]/20 hover:bg-[#18594f] active:scale-[0.98] hover:shadow-lg hover:shadow-[#1f6d61]/25"
                            onClick={() => {
                                setMesActual(new Date(mesActual.setMonth(mesActual.getMonth() - 1)));
                                setFechaSeleccionada(null);
                                setHoraInicio("");
                                setHoraFin("");
                                setFechaInicio("");
                                setFechaFinalizacion("");
                            }}
                        >
                            ←
                        </button>
                        <strong className="capitalize text-sm font-semibold text-[#173f39]">
                            {mesActual.toLocaleString("es-CL", {month: "long", year: "numeric"})}
                        </strong>
                        <button
                            className="rounded-lg border border-[#1f6d61] bg-[#1f6d61] px-2.5 py-1 text-xs font-semibold text-white shadow-md shadow-[#1f6d61]/20 hover:bg-[#18594f] active:scale-[0.98] hover:shadow-lg hover:shadow-[#1f6d61]/25"
                            onClick={() => {
                                setMesActual(new Date(mesActual.setMonth(mesActual.getMonth() + 1)));
                                setFechaSeleccionada(null);
                                setHoraInicio("");
                                setHoraFin("");
                                setFechaInicio("");
                                setFechaFinalizacion("");
                            }}
                        >
                            →
                        </button>
                    </div>

                    {/* calendario */}
                    <div className="mt-4 grid grid-cols-7 gap-2 rounded-xl bg-[#f3faf7] p-2 ring-1 ring-[#d7ebe5]">
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, idx) => (
                            <strong key={`weekday-${idx}`}
                                    className="text-center text-xs font-semibold text-[#6c8f87]">{d}</strong>
                        ))}

                        {dias.map((dia, i) =>
                            dia ? (() => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const day = new Date(dia);
                                day.setHours(0, 0, 0, 0);
                                const isPastDay = day < today;
                                const isSunday = dia.getDay() === 0;
                                const isDisabled = isPastDay || isSunday;
                                const isSelected = fechaSeleccionada?.toDateString() === dia.toDateString();

                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        disabled={isDisabled}
                                        onClick={() => {
                                            if (isDisabled) return;
                                            seleccionarFecha(dia);
                                        }}
                                        className={
                                            "h-10 flex items-center justify-center rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#9fd4c8] focus:ring-offset-1 " +
                                            (isDisabled
                                                ? "cursor-not-allowed border border-[#dfece8] bg-white/70 text-slate-400 shadow-sm" + (isSunday ? " opacity-50" : "")
                                                : isSelected
                                                    ? "border border-[#1f6d61] bg-[#1f6d61] text-white shadow-md shadow-[#1f6d61]/20"
                                                    : "border border-[#d7ebe5] bg-white/90 text-[#31544e] shadow-sm hover:bg-white hover:border-[#7db8ac] hover:shadow-md hover:shadow-[#1f6d61]/10")
                                        }
                                    >
                                        {dia.getDate()}
                                    </button>
                                );
                            })() : (
                                <div key={i}/>
                            )
                        )}
                    </div>

                    {/* Horarios */}
                    {fechaSeleccionada && (
                        <div className="mt-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-[#173f39]">
                                    Agenda (09:00–22:00)
                                </h3>
                                <div className="flex items-center gap-3">
                                    <p className="text-xs text-[#6b8b84]">Bloques de 60 min</p>
                                    {checkingBlocked && (
                                        <div className="flex items-center gap-2 text-xs text-[#6b8b84]">
                                            <svg className="w-3 h-3 animate-spin text-[#4f7a72]"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor"
                                                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            <span>Comprobando disponibilidad...</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 max-h-96 space-y-2 overflow-y-auto rounded-xl bg-[#f3faf7] p-2 pr-1 ring-1 ring-[#d7ebe5]">
                                {attentionSlots
                                    .filter((entry) => {
                                        const isBlocked = blockedHours.has(entry.start);

                                        const isTodaySelected = (() => {
                                            if (!fechaSeleccionada) return false;
                                            const today = new Date();
                                            const day = new Date(fechaSeleccionada);
                                            today.setHours(0, 0, 0, 0);
                                            day.setHours(0, 0, 0, 0);
                                            return day.getTime() === today.getTime();
                                        })();

                                        const isPastHour = (() => {
                                            if (!isTodaySelected) return false;
                                            const now = new Date();
                                            const nowMinutes = (now.getHours() * 60) + now.getMinutes();
                                            const slotStartMinutes = hhmmToMinutes(entry.start);
                                            return slotStartMinutes < nowMinutes;
                                        })();

                                        // Solo mostrar slots que NO estén bloqueados NI sean pasados
                                        return !isBlocked && !isPastHour;
                                    })
                                    .map((entry, idx) => {
                                        const selected = horaInicio === entry.start;

                                        return (
                                            <div key={entry.start}
                                                 className={"flex items-center justify-between rounded-xl border p-3 shadow-sm transition hover:shadow-md hover:shadow-[#1f6d61]/10 " + (selected ? "border-[#9dd3c7] bg-[#ebf8f4]" : "border-[#d7ebe5] bg-white/90")}>
                                                <div>
                                                    <div className="text-sm font-medium text-[#173f39]">Atención</div>
                                                    <div className="text-xs text-[#6b8b84]">{entry.start} – {entry.end}</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => seleccionarInicio(entry.start)}
                                                        className={"rounded-lg px-3 py-1 font-semibold shadow-sm transition active:scale-[0.98] " + (selected ? 'bg-[#2f9a86] text-white shadow-md shadow-[#2f9a86]/20' : 'bg-[#1f6d61] text-white hover:bg-[#18594f] hover:shadow-md hover:shadow-[#1f6d61]/20')}
                                                    >
                                                        {selected ? 'Seleccionada' : 'Seleccionar'}
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}

                                {attentionSlots.filter((entry) => {
                                    const isBlocked = blockedHours.has(entry.start);
                                    const isTodaySelected = (() => {
                                        if (!fechaSeleccionada) return false;
                                        const today = new Date();
                                        const day = new Date(fechaSeleccionada);
                                        today.setHours(0, 0, 0, 0);
                                        day.setHours(0, 0, 0, 0);
                                        return day.getTime() === today.getTime();
                                    })();
                                    const isPastHour = (() => {
                                        if (!isTodaySelected) return false;
                                        const now = new Date();
                                        const nowMinutes = (now.getHours() * 60) + now.getMinutes();
                                        const slotStartMinutes = hhmmToMinutes(entry.start);
                                        return slotStartMinutes < nowMinutes;
                                    })();
                                    return !isBlocked && !isPastHour;
                                }).length === 0 && (
                                    <div className="text-center py-8 text-red-500">
                                        <p className="text-sm">No hay horarios disponibles para esta fecha</p>
                                        <p className="text-xs mt-1">Por favor selecciona otra fecha</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
                <br/>

                <div className="flex gap-5 justify-center">
                    <Link href={"/agendaProfesionales"}>
                        <ShadcnButton2 nombre={"RETROCEDER"}/>
                    </Link>


                        <ShadcnButton2 nombre={"SIGUIENTE"} funcion={()=>formularioReservaProfesional(id_profesional)}/>

                </div>

                <footer className="mt-10 text-center text-xs text-slate-600">
                    <p className="mt-2 text-[11px] text-[#86a49d]">
                        Horarios: Lun-Sáb 9:00-22:00 | Dom Cerrado
                    </p>
                </footer>
            </div>
        </div>
    );
}
