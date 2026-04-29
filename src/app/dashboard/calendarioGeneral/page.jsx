"use client"

import {useState, useMemo, useEffect} from "react";
import {Calendar, dateFnsLocalizer} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import ShadcnInput from "@/Componentes/shadcnInput2";
import ShadcnFechaHora from "@/Componentes/ShadcnFechaHora";
import ToasterClient from "@/Componentes/ToasterClient";
import {toast} from "react-hot-toast";

import es from "date-fns/locale/es";
import {SelectDinamic} from "@/Componentes/SelectDinamic";
import {InfoButton} from "@/Componentes/InfoButton";

const locales = {
    es: es,
};

const dfStartOfWeek = (date) => startOfWeek(date, {locale: es});

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: dfStartOfWeek,
    getDay,
    locales,
});
const HORA_MINIMA_AGENDA = 9;
const HORA_MAXIMA_AGENDA = 20;

function crearHoraLimite(hora, minuto = 0, segundo = 0) {
    const fecha = new Date();
    fecha.setHours(hora, minuto, segundo, 0);
    return fecha;
}

export default function Calendario() {

    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .rbc-calendar, .rbc-time-view, .rbc-month-view {
                border: 0 !important;
                background: transparent !important;
            }
            .rbc-toolbar {
                margin-bottom: 16px !important;
                gap: 10px !important;
            }
            .rbc-toolbar button {
                border-radius: 12px !important;
                border: 1px solid #e2e8f0 !important;
                background: #ffffff !important;
                color: #475569 !important;
                box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
            }
            .rbc-toolbar button:hover,
            .rbc-toolbar button:focus {
                background: #faf5ff !important;
                border-color: #c084fc !important;
                color: #7c3aed !important;
            }
            .rbc-toolbar button.rbc-active {
                background: linear-gradient(135deg, #9333ea, #7c3aed) !important;
                border-color: #7c3aed !important;
                color: #ffffff !important;
                box-shadow: 0 12px 24px rgba(124, 58, 237, 0.22) !important;
            }
            .rbc-header {
                padding: 12px 8px !important;
                border-bottom: 1px solid #e2e8f0 !important;
                color: #475569 !important;
                font-size: 12px !important;
                font-weight: 700 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.08em !important;
                background: rgba(248, 250, 252, 0.85) !important;
            }
            .rbc-time-view .rbc-header,
            .rbc-time-view .rbc-time-gutter .rbc-label,
            .rbc-time-view .rbc-time-slot {
                font-size: 14.4px !important;
            }
            .rbc-time-header-content,
            .rbc-time-content,
            .rbc-time-view,
            .rbc-timeslot-group,
            .rbc-day-bg + .rbc-day-bg,
            .rbc-month-row + .rbc-month-row,
            .rbc-header + .rbc-header,
            .rbc-time-header-content + .rbc-time-header-content {
                border-color: #e2e8f0 !important;
            }
            .rbc-time-content {
                -webkit-overflow-scrolling: touch !important;
                touch-action: pan-y !important;
                overscroll-behavior: contain !important;
            }
            .rbc-time-view .rbc-timeslot-group {
                min-height: 44px !important;
            }
            .rbc-time-slot {
                transition: background-color 120ms ease !important;
            }
            .rbc-day-slot .rbc-time-slot:hover {
                background: rgba(168, 85, 247, 0.06) !important;
            }
            .rbc-today {
                background: rgba(237, 233, 254, 0.42) !important;
            }
            .rbc-current-time-indicator {
                background-color: #7c3aed !important;
                height: 2px !important;
            }
            .rbc-slot-selection {
                background: rgba(124, 58, 237, 0.22) !important;
                border: 1px solid rgba(124, 58, 237, 0.42) !important;
                border-radius: 16px !important;
                box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2) !important;
            }
            .rbc-selected-cell {
                background: rgba(124, 58, 237, 0.08) !important;
            }
            .rbc-event,
            .rbc-background-event {
                border-radius: 0 !important;
                box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08) !important;
            }
            .rbc-background-event {
                background-color: rgba(107, 114, 128, 0.28) !important;
                border: 1px solid rgba(107, 114, 128, 0.38) !important;
                border-left: 4px solid rgba(71, 85, 105, 0.95) !important;
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16) !important;
            }
            .rbc-month-view .rbc-event {
                min-height: 0 !important; height: auto !important; padding: 2px 3px !important;
                line-height: 1.1 !important; white-space: normal !important; overflow: visible !important; word-break: break-word !important;
                font-size: 40% !important;
            }
            .rbc-time-view .rbc-event {
                min-height: 0 !important; padding: 1px 2px !important;
                line-height: 1.1 !important; white-space: normal !important; overflow: hidden !important; word-break: break-word !important;
                font-size: 48% !important;
            }
            .rbc-month-view .rbc-day-slot { min-height: 80px !important; }
            .rbc-row-segment { z-index: 1 !important; }
            .rbc-event-label, .rbc-event-content { white-space: normal !important; overflow: visible !important; word-break: break-word !important; font-size: 40% !important; }
            .rbc-time-view .rbc-event-label,
            .rbc-time-view .rbc-event-content { font-size: 48% !important; }
            .rbc-event-label { display: none !important; }
            @media (max-width: 767px) {
                .rbc-time-view,
                .rbc-time-content,
                .rbc-day-slot,
                .rbc-time-column {
                    touch-action: pan-y !important;
                }
                .rbc-toolbar {
                    flex-wrap: wrap !important;
                }
                .rbc-toolbar button {
                    min-height: 38px !important;
                }
            }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState("month");
    const [esMobile, setEsMobile] = useState(false);


    const [nombrePaciente, setNombrePaciente] = useState("");
    const [apellidoPaciente, setApellidoPaciente] = useState("");
    const [rut, setRut] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [fechaInicio, setfechaInicio,] = useState("");
    const [fechaFinalizacion, setfechaFinalizacion,] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFinalizacion, setHoraFinalizacion] = useState("");
    const [estadoReserva, setEstadoReserva,] = useState("");
    const [id_reserva, setid_reserva] = useState(0);

    const [dataAgenda, setDataAgenda] = useState([]);
    const [dataBloqueos, setDataBloqueos] = useState([]);
    const [backgroundCalendarEvents, setBackgroundCalendarEvents] = useState([]);
    const [listaProfesionales, setListaProfesionales] = useState([]);
    const [id_profesional, setId_profesional] = useState("");

    useEffect(() => {
        function actualizarModoMobile() {
            const mobile = window.innerWidth < 768;
            setEsMobile(mobile);
            setCurrentView((prev) => {
                if (mobile && (prev === "month" || prev === "agenda")) {
                    return "week";
                }
                if (!mobile && prev === "week") {
                    return prev;
                }
                return prev;
            });
        }

        actualizarModoMobile();
        window.addEventListener("resize", actualizarModoMobile);
        return () => window.removeEventListener("resize", actualizarModoMobile);
    }, []);

    async function seleccionarTodosProfesionalesCalendario() {
        try {
            const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`, {
                method: 'GET',
                headers: {Accept: 'application/json'},
                mode: 'cors'
            })
            if (!res.ok) {
                return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
            } else {
                const respustaBackend = await res.json();
                if (respustaBackend && respustaBackend.length > 0) {
                    setListaProfesionales(respustaBackend);
                    if (!id_profesional) {
                        setId_profesional(respustaBackend[0].id_profesional);
                    }
                } else {
                    return toast.error('No hay profesionales o servicios ingresados en el sistema');
                }
            }
        } catch (error) {
            return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
        }
    }

    useEffect(() => {
        seleccionarTodosProfesionalesCalendario();
    }, []);


    function formatearFechaLocal(d) {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        return `${y}-${m}-${day}`
    }

    const manejarFechaHoraInicio = (dateTime) => {
        setfechaInicio(formatearFechaLocal(dateTime))
        setHoraInicio(dateTime.toTimeString().slice(0, 8))
    }

    const manejarFechaHoraFinalizacion = (dateTime) => {
        setfechaFinalizacion(formatearFechaLocal(dateTime))
        setHoraFinalizacion(dateTime.toTimeString().slice(0, 8))
    }


    function convertirAFechaCalendario(fechaISO, hora) {
        const soloFecha = fechaISO.slice(0, 10);
        return new Date(`${soloFecha}T${hora}`);
    }

    function estaDentroHorarioAgenda(start, end) {
        if (!(start instanceof Date) || Number.isNaN(start.getTime())) return false;
        if (!(end instanceof Date) || Number.isNaN(end.getTime())) return false;

        const minutosInicio = start.getHours() * 60 + start.getMinutes();
        const minutosFin = end.getHours() * 60 + end.getMinutes();
        const minimo = HORA_MINIMA_AGENDA * 60;
        const maximo = HORA_MAXIMA_AGENDA * 60;

        return minutosInicio >= minimo && minutosFin <= maximo && end > start;
    }

    // Helper: comprueba si un rango [start, end) se solapa con alguna reserva en dataAgenda
    function isOverlapping(start, end) {
        if (!dataAgenda || dataAgenda.length === 0) return false;

        // Normalizamos a Date para comparar
        for (const cita of dataAgenda) {
            const evStart = convertirAFechaCalendario((cita.fechaInicio ?? "").slice(0, 10), (cita.horaInicio ?? "00:00:00"));
            const evEnd = convertirAFechaCalendario((cita.fechaFinalizacion ?? "").slice(0, 10), (cita.horaFinalizacion ?? "00:00:00"));

            // Si cualquier parte se solapa
            if (start < evEnd && end > evStart) {
                return true;
            }
        }

        return false;
    }


    function formatHoraCorta(date) {
        return format(date, "HH:mm", {locale: es});
    }

    function obtenerTituloReserva(cita) {
        const nombre = (cita?.nombrePaciente ?? "").trim();
        const apellido = (cita?.apellidoPaciente ?? "").trim();
        const inicialApellido = apellido ? `${apellido.charAt(0).toUpperCase()}.` : "";
        return [nombre, inicialApellido].filter(Boolean).join(" ");
    }

    function obtenerTooltipEvento(event) {
        if (event?.tipo === "bloqueo") {
            return event.title || "Bloqueo";
        }
        if (event?.tipo === "reserva") {
            const nombre = (event.resource?.nombrePaciente ?? "").trim();
            const apellido = (event.resource?.apellidoPaciente ?? "").trim();
            const horario = event.start && event.end
                ? `${formatHoraCorta(event.start)} - ${formatHoraCorta(event.end)}`
                : "";
            return [nombre, apellido, horario].filter(Boolean).join(" | ");
        }
        return event?.title || "";
    }

    function expandirBloqueosPorDia(bloqueos) {
        const resultado = [];
        for (const bloqueo of bloqueos) {
            const horaIni = bloqueo.horaInicio ?? "00:00:00";
            const horaFin = bloqueo.horaFinalizacion ?? "23:59:00";
            const fechaIniStr = (bloqueo.fechaInicio ?? "").slice(0, 10);
            const fechaFinStr = (bloqueo.fechaFinalizacion ?? "").slice(0, 10);
            const primerDia = new Date(fechaIniStr + "T00:00:00");
            const ultimoDia = new Date(fechaFinStr + "T00:00:00");
            if (isNaN(primerDia.getTime()) || isNaN(ultimoDia.getTime())) continue;

            let cursor = new Date(primerDia);
            while (cursor <= ultimoDia) {
                const y = cursor.getFullYear();
                const m = String(cursor.getMonth() + 1).padStart(2, "0");
                const d = String(cursor.getDate()).padStart(2, "0");
                const fechaDia = `${y}-${m}-${d}`;
                resultado.push({
                    id_bloqueo: bloqueo.id_bloqueo,
                    title: bloqueo.motivo || "Sin motivo",
                    start: new Date(`${fechaDia}T${horaIni}`),
                    end: new Date(`${fechaDia}T${horaFin}`),
                    allDay: false,
                    tipo: "bloqueo",
                    resource: bloqueo,
                });
                cursor = new Date(y, cursor.getMonth(), cursor.getDate() + 1, 0, 0, 0);
            }
        }
        return resultado;
    }

    async function cargarDataAgenda() {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarReservados`, {
                method: "GET",
                headers: {Accept: "application/json"}
            })

            if (!res.ok) {
                return toast.error('No fue posible cargar las agendas, Contacte a soporte de Medify')
            }

            const data = await res.json();
            setDataAgenda(data);

        } catch (err) {
            return toast.error(err.message)
        }
    }

    async function cargarDataPorProfesional(idProf) {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarPorProfesional`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_profesional: idProf})
            });
            if (!res.ok) return toast.error('No fue posible cargar las agendas del profesional');
            const data = await res.json();
            setDataAgenda(Array.isArray(data) ? data : []);
        } catch (err) {
            return toast.error(err.message);
        }
    }

    async function cargarBloqueosPorProfesional(id_profesional) {
        try {
            const res = await fetch(`${API}/bloqueoAgenda/seleccionarBloqueosPorProfesional`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_profesional})
            });
            if (!res.ok) return;
            const data = await res.json();
            setDataBloqueos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log(err);
        }
    }

    async function refrescarCalendario() {
        if (id_profesional) {
            await cargarDataPorProfesional(id_profesional);
            await cargarBloqueosPorProfesional(id_profesional);
        }
    }

    useEffect(() => { cargarDataAgenda(); }, []);

    useEffect(() => {
        if (id_profesional) {
            cargarDataPorProfesional(id_profesional);
            cargarBloqueosPorProfesional(id_profesional);
        } else {
            cargarDataAgenda();
        }
    }, [id_profesional]);


    async function insertarNuevaReserva(
        nombrePaciente,
        apellidoPaciente,
        rut,
        telefono,
        email,
        fechaInicio,
        horaInicio,
        fechaFinalizacion,
        horaFinalizacion
    ) {
        try {

            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !horaFinalizacion) {
                return toast.error('Debe llenar todos los campos');
            }

            const ahora = new Date();
            const inicio = new Date(`${fechaInicio}T${horaInicio}`);
            const final = new Date(`${fechaFinalizacion}T${horaFinalizacion}`);

            if (inicio < ahora) {
                return toast.error("No es posible agendar en fechas NO vigentes")
            }

            if (final < inicio) {
                return toast.error("No es posible en fechas irreales")
            }

            // Validación local: si el rango se solapa con alguna reserva ya cargada, evitar llamar al servidor
            if (isOverlapping(inicio, final)) {
                return toast.error('La hora seleccionada ya está ocupada (verifique otras horas)');
            }


            if (fechaInicio === fechaFinalizacion) {

                const res = await fetch(`${API}/reservaPacientes/insertarReserva`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    mode: "cors",
                    body: JSON.stringify({
                        nombrePaciente,
                        apellidoPaciente,
                        rut,
                        telefono,
                        email,
                        fechaInicio,
                        horaInicio,
                        fechaFinalizacion,
                        horaFinalizacion,
                        estadoReserva: "reservada"
                    })
                })


                const respuestaBackend = await res.json();

                if (respuestaBackend.message === true) {
                    setNombrePaciente("");
                    setApellidoPaciente("");
                    setTelefono("");
                    setRut("");
                    setEmail("");
                    await refrescarCalendario();
                    return toast.success("Se ha ingresado correctamente el agendamiento")

                } else if (respuestaBackend.message === "conflicto" || respuestaBackend.message.includes("conflicto")) {
                    return toast.error("No puede agendar una hora que ya esta ocupada")

                } else if (respuestaBackend.message === false) {
                    return toast.error('Asegure que no esta ocupada la Hora');

                }


            } else {
                return toast.error("Solo se permite agendar si es en el mismo dia")
            }


        } catch (error) {
            console.log(error);
            return toast.error('Sin respuesta del servidor contacte a soporte.');

        }
    }


    const messages = useMemo(
        () => ({
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            noEventsInRange: "No hay eventos",
        }),
        []
    );

    const vistasDisponibles = esMobile ? ["week", "day"] : ["month", "week", "day", "agenda"];


    useEffect(() => {
        const eventosReservas = (dataAgenda || []).map((cita) => ({
            id_reserva: cita.id_reserva,
            title: obtenerTituloReserva(cita),
            start: convertirAFechaCalendario(cita.fechaInicio, cita.horaInicio),
            end: convertirAFechaCalendario(cita.fechaFinalizacion, cita.horaFinalizacion),
            allDay: false,
            tipo: "reserva",
            resource: cita,
        }));
        const eventosBloqueos = expandirBloqueosPorDia(dataBloqueos || []).map((bloqueo) => ({
            ...bloqueo,
            allDay: false,
        }));

        if (currentView === "month") {
            setEvents([...eventosReservas, ...eventosBloqueos]);
            setBackgroundCalendarEvents([]);
            return;
        }

        setEvents(eventosReservas);
        setBackgroundCalendarEvents(eventosBloqueos);
    }, [dataAgenda, dataBloqueos, currentView]);

    function obtenerPaletaEstadoReserva(estadoReserva = "") {
        const estadoNormalizado = estadoReserva
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        if (estadoNormalizado === "asiste") {
            return {
                backgroundColor: "rgba(34, 211, 238, 0.20)",
                color: "#0f766e",
                accentColor: "#0891b2",
                borderColor: "rgba(6, 182, 212, 0.30)"
            };
        }

        if (estadoNormalizado === "no asiste" || estadoNormalizado === "no asistio" || estadoNormalizado === "no asistste") {
            return {
                backgroundColor: "rgba(244, 114, 182, 0.18)",
                color: "#9d174d",
                accentColor: "#db2777",
                borderColor: "rgba(236, 72, 153, 0.28)"
            };
        }

        if (estadoNormalizado === "finalizado") {
            return {
                backgroundColor: "rgba(251, 146, 60, 0.18)",
                color: "#9a3412",
                accentColor: "#ea580c",
                borderColor: "rgba(249, 115, 22, 0.28)"
            };
        }

        if (estadoNormalizado === "confirmada") {
            return {
                backgroundColor: "rgba(34, 197, 94, 0.22)",
                color: "#14532d",
                accentColor: "#166534",
                borderColor: "rgba(34, 197, 94, 0.30)"
            };
        }

        if (estadoNormalizado === "anulada") {
            return {
                backgroundColor: "rgba(244, 63, 94, 0.18)",
                color: "#881337",
                accentColor: "#881337",
                borderColor: "rgba(225, 29, 72, 0.28)"
            };
        }

        return {
            backgroundColor: "rgba(124, 58, 237, 0.20)",
            color: "#5b21b6",
            accentColor: "#5b21b6",
            borderColor: "rgba(124, 58, 237, 0.28)"
        };
    }

    const eventStyleGetter = (event) => {
        const esBloqueo = event.tipo === "bloqueo";
        const esVistaMes = currentView === "month";
        const paletteReserva = obtenerPaletaEstadoReserva(event.resource?.estadoReserva);

        if (esBloqueo) {
            return {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    height: esVistaMes ? 'auto' : '100%',
                    minHeight: esVistaMes ? '20px' : '0',
                    maxHeight: 'none',
                    whiteSpace: 'normal',
                    overflow: 'hidden',
                    textOverflow: 'clip',
                    lineHeight: esVistaMes ? '1' : '1.3',
                    padding: esVistaMes ? '2px 4px' : '6px 8px',
                    fontSize: esVistaMes ? '0.45rem' : '0.32rem',
                    boxSizing: 'border-box',
                    borderRadius: '0px',
                    backgroundColor: 'rgba(107, 114, 128, 0.28)',
                    color: '#334155',
                    fontWeight: '600',
                    wordBreak: 'break-word',
                    border: '1px solid rgba(107, 114, 128, 0.38)',
                    borderLeft: '4px solid rgba(71, 85, 105, 0.95)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
                },
            };
        }

        return {
            style: {
                display: 'flex',
                alignItems: 'stretch',
                height: esVistaMes ? 'auto' : '100%',
                minHeight: esVistaMes ? '20px' : '0',
                maxHeight: 'none',
                whiteSpace: 'normal',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '1',
                padding: esVistaMes ? '2px 4px' : '0',
                fontSize: esVistaMes ? '0.45rem' : '0.32rem',
                boxSizing: 'border-box',
                borderRadius: '0px',
                backgroundColor: paletteReserva.backgroundColor,
                color: paletteReserva.color,
                fontWeight: '600', wordBreak: 'break-word',
                border: `1px solid ${paletteReserva.borderColor}`,
                borderLeft: `4px solid ${paletteReserva.accentColor}`,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)',
            },
        };
    };

    const backgroundEventStyleGetter = (event) => {
        const esBloqueo = event.tipo === "bloqueo";

        if (esBloqueo) {
            return {
                className: "bloqueo-calendario-bg",
                style: {
                    backgroundColor: "rgba(107, 114, 128, 0.28)",
                    border: "1px solid rgba(107, 114, 128, 0.38)",
                    borderLeft: "4px solid rgba(71, 85, 105, 0.95)",
                    borderRadius: "0px",
                    boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.18)",
                },
            };
        }

        return {style: {}};
    };

    const EventComponent = ({event}) => (
        <div
            title={obtenerTooltipEvento(event)}
            className="truncate text-[6px] leading-none w-full h-full flex items-center gap-1 px-[2px]"
            style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
        >
            {event.tipo === "bloqueo" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )}
            {event.title}
        </div>
    );

    const TitleOnlyEvent = ({event}) => (
        <div title={obtenerTooltipEvento(event)} className="truncate text-[6px] leading-none font-medium w-full flex items-center gap-1" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            {event.tipo === "bloqueo" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )}
            {event.title}
        </div>
    );


    async function actualizarInformacionReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva, id_profesional, id_reserva) {
        try {

            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !fechaFinalizacion || !horaFinalizacion || !estadoReserva || !id_profesional || !id_reserva) {
                toast.error("Debe llenar todos los campos para poder actualizar la reserva");
                return false;
            }

            const res = await fetch(`${API}/reservaPacientes/actualizarReservacion`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({
                    nombrePaciente,
                    apellidoPaciente,
                    rut,
                    telefono,
                    email,
                    fechaInicio,
                    horaInicio,
                    fechaFinalizacion,
                    horaFinalizacion,
                    estadoReserva,
                    id_profesional,
                    id_reserva
                })
            });

            if (!res.ok) {
                toast.error("El servidor no responde");
                return false;
            } else {

                const respuestaBackend = await res.json();
                if (respuestaBackend.message === true) {
                    setNombrePaciente("");
                    setApellidoPaciente("");
                    setTelefono("");
                    setRut("");
                    setEmail("");
                    await refrescarCalendario();
                    toast.success("Se ha actualizado la reserva correctamente");
                    return true;
                }
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message);
            return false;
        }
        return false;
    }


    async function seleccionarReservaEspecifica(id_reserva) {
        try {

            if (!id_reserva) {
                return toast.error("Debe seleccionar una Reserva");
            }

            const res = await fetch(`${API}/reservaPacientes/seleccionarEspecifica`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_reserva})
            });

            if (!res.ok) {
                return toast.error("El servidor no responde")
            }

            const data = await res.json();


            let reserva;

            if (Array.isArray(data)) {
                reserva = data[0];
            } else {
                reserva = data;
            }

            if (!reserva) {
                return toast.error("Sin Data")
            }

            // Seteamos los inputs desde la reserva (objeto)
            setNombrePaciente(reserva.nombrePaciente ?? "");
            setApellidoPaciente(reserva.apellidoPaciente ?? "");
            setRut(reserva.rut ?? "");
            setEmail(reserva.email ?? "");
            setTelefono(reserva.telefono ?? "");

            // Si tu endpoint trae estos campos, los cargamos también
            setfechaInicio((reserva.fechaInicio ?? "").slice(0, 10));
            setHoraInicio(reserva.horaInicio ?? "");
            setfechaFinalizacion((reserva.fechaFinalizacion ?? "").slice(0, 10));
            setHoraFinalizacion(reserva.horaFinalizacion ?? "");
            setEstadoReserva(reserva.estadoReserva ?? "");
            setId_profesional(reserva.id_profesional ?? "");

        } catch (error) {
            console.log(error);
            return toast.error("El servidor no responde")
        }
    }

    useEffect(() => {
        if (id_reserva) {
            seleccionarReservaEspecifica(id_reserva);
        }
    }, [id_reserva]);


    function limpiarData() {
        setNombrePaciente("");
        setApellidoPaciente("");
        setTelefono("");
        setRut("");
        setEmail("");
    }

    async function cambiarEstadoRapido(estadoNuevo) {
        const nombreCompleto = `${nombrePaciente ?? ""} ${apellidoPaciente ?? ""}`.trim();
        if (!id_reserva || !nombreCompleto) {
            return toast.error("Debe seleccionar un paciente para cambiar su estado");
        }

        const actualizado = await actualizarInformacionReserva(
            nombrePaciente,
            apellidoPaciente,
            rut,
            telefono,
            email,
            fechaInicio,
            horaInicio,
            fechaFinalizacion,
            horaFinalizacion,
            estadoNuevo,
            id_profesional,
            id_reserva
        );

        if (actualizado) {
            setEstadoReserva(estadoNuevo);
            await seleccionarReservaEspecifica(id_reserva);
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
            <ToasterClient/>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-1">Visualización</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Calendario General</h1>
                        <p className="text-sm text-slate-500 mt-1">Revisa reservas y actividades de todos los profesionales.</p>
                    </div>
                    <InfoButton informacion={"Este apartado le permite tener una vista rápida y general de todos los horarios agendados y los bloqueos de agenda registrados en el sistema.\n\nPara ingresar nuevos agendamientos o citas, debe dirigirse al módulo de Ingreso de Agendamientos.\n\nPara registrar bloqueos de agenda, debe utilizar el módulo de Bloqueo de Agenda.\n\nEste calendario es únicamente de consulta y visualización."}/>
                </div>

                <div className="mb-6 rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex-1">
                            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 px-3 py-2.5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Paciente</p>
                                <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                                    {id_reserva ? `${nombrePaciente || "Sin"} ${apellidoPaciente || "asignar"}` : "Sin reserva seleccionada"}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Estado actual</p>
                                <p className="mt-1 truncate text-sm font-semibold text-slate-900">{estadoReserva || "--"}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Reserva</p>
                                <p className="mt-1 truncate text-sm font-semibold text-slate-900">{id_reserva ? `#${id_reserva}` : "--"}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => cambiarEstadoRapido("asiste")}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-200/80 border-l-[4px] border-l-cyan-500 bg-cyan-50/80 px-4 py-2.5 text-sm font-semibold text-cyan-800 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)] transition-all duration-150 hover:bg-cyan-100"
                            >
                                Asiste
                            </button>
                            <button
                                type="button"
                                onClick={() => cambiarEstadoRapido("no asiste")}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-pink-200/80 border-l-[4px] border-l-pink-500 bg-pink-50/80 px-4 py-2.5 text-sm font-semibold text-pink-800 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)] transition-all duration-150 hover:bg-pink-100"
                            >
                                No asiste
                            </button>
                            <button
                                type="button"
                                onClick={() => cambiarEstadoRapido("finalizado")}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200/80 border-l-[4px] border-l-orange-500 bg-orange-50/80 px-4 py-2.5 text-sm font-semibold text-orange-800 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)] transition-all duration-150 hover:bg-orange-100"
                            >
                                Finalizado
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Calendario de Reservas</h2>
                            {id_profesional && (
                                <span className="text-xs text-violet-600 font-medium ml-2">
                                    — Agenda de: {listaProfesionales.find(p => p.id_profesional === id_profesional)?.nombreProfesional ?? ""}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="w-64">
                                <SelectDinamic
                                    value={id_profesional}
                                    onChange={(e) => setId_profesional(Number(e.target.value))}
                                    options={listaProfesionales.map(profesional => ({
                                        value: profesional.id_profesional,
                                        label: profesional.nombreProfesional
                                    }))}
                                    placeholder="Selecciona un profesional"
                                />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded bg-violet-600"></span>
                                <span className="text-xs text-slate-500">Reservada</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded bg-green-600"></span>
                                <span className="text-xs text-slate-500">Confirmada</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded bg-rose-800"></span>
                                <span className="text-xs text-slate-500">Anulada</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded bg-cyan-500"></span>
                                <span className="text-xs text-slate-500">Asiste</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded bg-pink-500"></span>
                                <span className="text-xs text-slate-500">No asiste</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded bg-orange-500"></span>
                                <span className="text-xs text-slate-500">Finalizado</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block h-3 w-3 rounded border border-slate-500/60 bg-slate-500/50"></span>
                                <span className="text-xs text-slate-500">Bloqueado</span>
                            </div>
                            <span className="text-xs text-slate-400">Vista: <span className="font-medium text-slate-600 capitalize">{currentView}</span></span>
                        </div>
                    </div>
                    <div className="relative p-4 md:p-6 h-[700px]">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            backgroundEvents={backgroundCalendarEvents}
                            eventPropGetter={eventStyleGetter}
                            backgroundEventPropGetter={backgroundEventStyleGetter}
                            components={{
                                event: EventComponent,
                                day: {event: TitleOnlyEvent},
                                agenda: {event: TitleOnlyEvent}
                            }}
                            startAccessor="start"
                            endAccessor="end"
                            messages={messages}
                            culture="es"
                            date={currentDate}
                            onNavigate={(nextDate) => setCurrentDate(nextDate)}
                            view={currentView}
                            onView={(nextView) => setCurrentView(nextView)}
                            defaultView="week"
                            views={vistasDisponibles}
                            style={{height: "100%"}}
                            selectable
                            popup
                            min={crearHoraLimite(HORA_MINIMA_AGENDA)}
                            max={crearHoraLimite(HORA_MAXIMA_AGENDA)}
                            scrollToTime={crearHoraLimite(HORA_MINIMA_AGENDA)}
                            step={15}
                            timeslots={1}
                            longPressThreshold={esMobile ? 300 : 10}
                            onSelecting={(slot) => {
                                const start = slot.start ?? slot;
                                const end = slot.end ?? slot;
                                if (!estaDentroHorarioAgenda(start, end)) {
                                    toast.error("Solo puedes visualizar y seleccionar entre 09:00 y 20:00 horas.");
                                    return false;
                                }
                                if (isOverlapping(start, end)) {
                                    toast.error('Horario no disponible (solapa con una reserva existente)');
                                    return false;
                                }
                                return true;
                            }}
                            onSelectEvent={(event) => {
                                if (event.tipo === "bloqueo") {
                                    return toast("Bloqueo: " + (event.title || "Sin motivo"), {icon: "🔒"});
                                }
                                if (!event?.id_reserva) {
                                    toast.error("No se encontró el ID de la reserva");
                                    return;
                                }
                                setid_reserva(event.id_reserva);
                                seleccionarReservaEspecifica(event.id_reserva);
                                toast.success(`Reserva: Numero # ${event.id_reserva}`);
                            }}
                            onSelectSlot={(slotInfo) => {
                                const start = slotInfo.start ?? slotInfo;
                                const end = slotInfo.end ?? slotInfo;
                                if (!estaDentroHorarioAgenda(start, end)) {
                                    toast.error("Solo puedes visualizar y seleccionar entre 09:00 y 20:00 horas.");
                                    return;
                                }
                                if (isOverlapping(start, end)) {
                                    toast.error('No puede seleccionar un horario que ya está ocupado');
                                    return;
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
