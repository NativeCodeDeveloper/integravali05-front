"use client"
import {useState, useEffect} from "react";
import ShadcnInput from "@/Componentes/shadcnInput2";
import ToasterClient from "@/Componentes/ToasterClient";
import toast from "react-hot-toast";
import formatearFecha from "@/FuncionesTranversales/funcionesTranversales";
import {useRouter} from "next/navigation";
import {Calendar28} from "@/Componentes/shadcnCalendarSelector";
import {InfoButton} from "@/Componentes/InfoButton";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {SelectDinamic} from "@/Componentes/SelectDinamic";


export default function AgendaCitas() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [dataLista, setdataLista] = useState([]);
    const [nombrePaciente, setnombrePaciente] = useState("");
    const [rut, setrut] = useState("");
    const [fechaInicio, setfechaInicio] = useState(null);
    const [fechaFinalizacion, setfechaFinalizacion] = useState(null);
    const [estadoReserva, setestadoReserva] = useState("");
    const [listaProfesionales, setListaProfesionales] = useState([]);
    const [id_profesional, setId_profesional] = useState("");



    async function buscarPorProfesional(id_profesional) {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarPorProfesional`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_profesional}),
                mode: "cors"
            });

            const respuestaBackend = await res.json();

            if (respuestaBackend.length > 0) {
                setdataLista(respuestaBackend);
                return toast.success("Reservas con el profesional encontradas!")
            }


        } catch (error) {
            console.log(error);
            return toast.error("No ha sido posible buscar, contacte a soporte Tecnico de Medify");
        }
    }

    useEffect(() => {
        buscarPorProfesional(id_profesional)
    },[id_profesional])




    async function seleccionarTodosProfesionalesAgendaLista() {
        try {
            const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`, {
                method: 'GET',
                headers: {Accept: 'application/json'},
                mode: 'cors'
            })

            if (!res.ok) {
                return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');

            }else{
                const respustaBackend = await res.json();

                if(respustaBackend){
                    setListaProfesionales(respustaBackend);

                }else{
                    return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
                }
            }
        }catch (error) {
            return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
        }
    }

    useEffect(() => {
        seleccionarTodosProfesionalesAgendaLista();
    }, []);


    function verDetalleAgenda(id_reserva) {
        router.push(`/dashboard/AgendaDetalle/${id_reserva}`);
    }

    async function buscarEntreFechas(fechaInicio, fechaFinalizacion) {
        try {
            if (!fechaInicio || !fechaFinalizacion) {
                return toast.error("Debe seleccionar un rango de fechas para filtrar")
            }

            const start = new Date(fechaInicio);
            const end = new Date(fechaFinalizacion);

            if (start > end) {
                return toast.error("La fecha de inicio no puede ser posterior a la fecha de término.");
            }

            const res = await fetch(`${API}/reservaPacientes/buscarEntreFechas`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({fechaInicio, fechaFinalizacion}),
                mode: "cors"
            });

            if (!res.ok) {
                return toast.error("Error al buscar citas. Por favor, intente de nuevo.");
            } else {
                const respuestaBackend = await res.json();

                if (respuestaBackend && Array.isArray(respuestaBackend) && respuestaBackend.length > 0) {
                    setdataLista(respuestaBackend);
                    return toast.success(`Se encontraron ${respuestaBackend.length} citas en el período seleccionado.`);
                } else {
                    setdataLista([]);
                    return toast.success("No se encontraron citas en el período seleccionado.");
                }
            }
        } catch (error) {
            console.log(error);
            return toast.error("Error inesperado al buscar citas. Por favor, contacte a soporte técnico.");
        }
    }

    async function buscarPorRut(rut) {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarRut`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({rut}),
                mode: "cors"
            });

            if (!res.ok) {
                return toast.error("Debe ingresar datos para filtrar.");
            } else {
                const respuestaBackend = await res.json();

                if (respuestaBackend.length > 0) {
                    setdataLista(respuestaBackend);
                    return toast.success("Similitud de RUT encontrada")
                } else {
                    return toast.error("No se han encontrado similitudes")
                }
            }
        } catch (error) {
            console.log(error);
            return toast.error("No ha sido posible buscar, contacte a soporte Tecnico de Medify");
        }
    }

    async function buscarPorNombres(nombrePaciente) {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarNombre`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({nombrePaciente}),
                mode: "cors"
            });

            if (!res.ok) {
                return toast.error("Debe ingresar datos para filtrar.");
            } else {
                const respuestaBackend = await res.json();

                if (respuestaBackend.length > 0) {
                    setdataLista(respuestaBackend);
                    return toast.success("Similitud de nombre encontrada")
                } else {
                    return toast.error("No se han encontrado similitudes de nombres")
                }
            }
        } catch (error) {
            console.log(error);
            return toast.error("No ha sido posible buscar, contacte a soporte Tecnico de Medify");
        }
    }

    async function listarTablaCitas() {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarReservados`, {
                method: "GET",
                headers: {Accept: "application/json"},
                mode: "cors"
            });

            const respuestaBackend = await res.json();
            if (respuestaBackend) {
                setdataLista(respuestaBackend);
            }
        } catch (err) {
            console.log(err);
            return toast.error(err.message);
        }
    }

    useEffect(() => {
        listarTablaCitas();
    }, []);

    async function filtrarEstados(estadoReserva) {
        try {
            if (!estadoReserva) {
                return toast.error("Debe seleccionar un estado de reserva.");
            }

            const res = await fetch(`${API}/reservaPacientes/seleccionarSegunEstado`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({estadoReserva}),
                mode: "cors",
                cache: "no-cache"
            })

            if (!res.ok) {
                return toast.error("Debe seleccionar un estado de reserva.");
            } else {
                const dataBackend = await res.json();
                if (dataBackend.length > 0) {
                    setdataLista(dataBackend);
                } else {
                    return toast.error("No se han encontrado similitudes con el estado seleccionado")
                }
            }
        } catch (error) {
            console.log(error);
            return toast.error(error.message);
        }
    }

    useEffect(() => {
        if (!estadoReserva) return;
        filtrarEstados(estadoReserva)
    }, [estadoReserva]);

    function badgeEstado(estado) {
        if (!estado) return '-';
        const lower = estado.toLowerCase();
        if (lower === 'confirmada') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (lower === 'anulada') return 'bg-red-50 text-red-600 border-red-200';
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
            <ToasterClient/>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 mb-1">Agenda</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                            Listado de Reservaciones
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Filtra por nombre, RUT o rango de fechas para revisar las citas</p>
                    </div>
                    <InfoButton informacion={'En este apartado podrá visualizar el listado completo de todas las reservaciones realizadas. Podrá filtrarlas por estado, similitud de nombre, similitud de RUT y por rango de fechas.\n\nAl seleccionar una reservación, podrá cambiar su estado y establecer comunicación mediante correo electrónico con el usuario que realizó el agendamiento.'}/>
                </div>

                <div className="space-y-6">

                    {/* Filtros de búsqueda */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Filtros de Búsqueda</h2>
                        </div>

                        <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Columna izquierda: Nombre, RUT, Mostrar todos */}
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Buscar por Nombre</label>
                                    <div className="flex gap-2">
                                        <ShadcnInput
                                            value={nombrePaciente}
                                            placeholder="Ej: Nicolas Andres..."
                                            onChange={(e) => setnombrePaciente(e.target.value)}
                                            className="w-full"
                                        />
                                        <button
                                            onClick={() => buscarPorNombres(nombrePaciente)}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-500 rounded-lg hover:from-violet-700 hover:to-indigo-600 transition-all duration-150 shadow-sm flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                            </svg>
                                            Buscar
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Buscar por RUT</label>
                                    <div className="flex gap-2">
                                        <ShadcnInput
                                            value={rut}
                                            placeholder="12.345.678-9"
                                            onChange={(e) => setrut(e.target.value)}
                                            className="w-full"
                                        />
                                        <button
                                            onClick={() => buscarPorRut(rut)}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-500 rounded-lg hover:from-violet-700 hover:to-indigo-600 transition-all duration-150 shadow-sm flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                            </svg>
                                            Buscar
                                        </button>
                                    </div>
                                    <div className="mt-5">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Profesional</label>
                                        <SelectDinamic
                                            value={id_profesional}
                                            onChange={(e) => setId_profesional(e.target.value)}
                                            options={listaProfesionales.map(profesional => ({
                                                value: profesional.id_profesional,
                                                label: profesional.nombreProfesional
                                            }))}
                                            placeholder="Selecciona un profesional"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => listarTablaCitas()}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-150">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                    </svg>
                                    Mostrar Todos
                                </button>
                            </div>

                            {/* Columna derecha: Filtro por fechas */}
                            <div className="bg-slate-50 rounded-xl border border-slate-100 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-700">Buscar entre fechas</h3>
                                    <span className="text-[11px] text-slate-400 uppercase tracking-wider">Desde / Hasta</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Calendar28
                                        nombre={"Fecha de Inicio"}
                                        value={fechaInicio}
                                        onChange={(date) => setfechaInicio(date)}
                                    />
                                    <Calendar28
                                        nombre={"Fecha de Término"}
                                        value={fechaFinalizacion}
                                        onChange={(date) => setfechaFinalizacion(date)}
                                    />
                                </div>

                                <button
                                    onClick={() => buscarEntreFechas(fechaInicio, fechaFinalizacion)}
                                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-500 rounded-lg hover:from-violet-700 hover:to-indigo-600 transition-all duration-150 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                    Filtrar por Fechas
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de reservaciones */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Reservaciones</h2>
                                <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
                                    {dataLista.length}
                                </span>
                            </div>

                            <div className="w-full sm:w-auto">
                                <Select value={estadoReserva} onValueChange={(value) => setestadoReserva(value)}>
                                    <SelectTrigger className="h-9 w-full sm:w-[200px] bg-white border border-slate-200 text-slate-700 text-sm rounded-lg shadow-sm">
                                        <SelectValue placeholder="Filtrar por estado"/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                                        <SelectGroup>
                                            <SelectItem value="reservada">Reservada</SelectItem>
                                            <SelectItem value="anulada">Anulada</SelectItem>
                                            <SelectItem value="confirmada">Confirmada</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableCaption className="font-medium text-slate-400 text-xs py-4">Listado de reservaciones registradas</TableCaption>
                                <TableHeader>
                                    <TableRow className="bg-[linear-gradient(135deg,#0f172a_0%,#312e81_60%,#0891b2_100%)] hover:bg-[linear-gradient(135deg,#0f172a_0%,#312e81_60%,#0891b2_100%)]">
                                        <TableHead className="text-center font-semibold text-white text-xs uppercase tracking-wider px-3 py-3">Fecha</TableHead>
                                        <TableHead className="text-center font-semibold text-white text-xs uppercase tracking-wider px-3 py-3">Paciente</TableHead>
                                        <TableHead className="text-center font-semibold text-white text-xs uppercase tracking-wider px-3 py-3">Profesional</TableHead>
                                        <TableHead className="text-center font-semibold text-white text-xs uppercase tracking-wider px-3 py-3">RUT</TableHead>
                                        <TableHead className="text-center font-semibold text-white text-xs uppercase tracking-wider px-3 py-3">Estado</TableHead>
                                        <TableHead className="text-center font-semibold text-white text-xs uppercase tracking-wider px-3 py-3">Detalle</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dataLista.map((data, i) => (
                                        <TableRow
                                            key={data.id_reserva}
                                            className={"hover:bg-violet-50/50 transition-colors duration-100 " + (i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50')}>
                                            <TableCell className="text-center whitespace-nowrap px-3 py-2.5">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-50 border border-violet-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                    <span className="text-sm font-semibold text-violet-700">{formatearFecha(data.fechaInicio)}</span>
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center font-medium text-slate-800 text-sm px-3 py-2.5 whitespace-nowrap">
                                                {data.nombrePaciente + " " + data.apellidoPaciente}
                                            </TableCell>
                                            <TableCell className="text-center font-medium text-slate-800 text-sm px-3 py-2.5 whitespace-nowrap">
                                                {data.nombreProfesional}
                                            </TableCell>
                                            <TableCell className="text-center text-slate-600 text-sm px-3 py-2.5 font-mono whitespace-nowrap">{data.rut}</TableCell>
                                            <TableCell className="text-center px-3 py-2.5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeEstado(data.estadoReserva)}`}>
                                                    {data.estadoReserva}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center px-3 py-2.5">
                                                <button
                                                    onClick={() => verDetalleAgenda(data.id_reserva)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors duration-150">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                                    </svg>
                                                    Ver
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
