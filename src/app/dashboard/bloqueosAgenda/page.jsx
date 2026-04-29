'use client'
import {useState, useEffect} from "react";
import toast from "react-hot-toast";
import {SelectDinamic} from "@/Componentes/SelectDinamic";
import {InputTextDinamic} from "@/Componentes/InputTextDinamic";
import ShadcnFechaHora from "@/Componentes/ShadcnFechaHora";
import * as React from "react";
import ToasterClient from "@/Componentes/ToasterClient";
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



export default function BloqueosAgendas() {
const API = process.env.NEXT_PUBLIC_API_URL;
const [listaProfesionales, setListaProfesionales] = useState([]);
const [id_profesional, setId_profesional] = useState("");
    const [fechaInicio, setfechaInicio] = useState("");
    const [fechaFinalizacion, setfechaFinalizacion] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFinalizacion, setHoraFinalizacion] = useState("");
    const [motivo, setMotivo] = useState("");
    const [listaBloqueos, setListaBloqueos] = useState([]);



    function formatearFechaTabla(fechaISO) {
        if (!fechaISO) return "";
        const partes = fechaISO.slice(0, 10).split("-");
        if (partes.length !== 3) return fechaISO;
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function formatearFechaLocal(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    }

    const manejarFechaHoraInicio = (dateTime) => {
        setfechaInicio(formatearFechaLocal(dateTime));
        setHoraInicio(dateTime.toTimeString().slice(0, 8));
    };

    const manejarFechaHoraFinalizacion = (dateTime) => {
        setfechaFinalizacion(formatearFechaLocal(dateTime));
        setHoraFinalizacion(dateTime.toTimeString().slice(0, 8));
    };

    function convertirAFechaCalendario(fechaISO, hora) {
        const soloFecha = fechaISO.slice(0, 10);
        return new Date(`${soloFecha}T${hora}`);
    }



    async function buscarPorProfesionalBloqueo() {
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
        buscarPorProfesionalBloqueo()
    },[])



    async function insertarBloqueoHorario(id_profesional,fechaInicio,horaInicio,fechaFinalizacion,horaFinalizacion,motivo) {
        try {

        if(!fechaInicio ||!fechaFinalizacion||!horaInicio||!horaFinalizacion||!motivo || !id_profesional){
            return toast.error("Deben completarse todos los campos para ingresar el bloqueo al sistema.")
        }

        const res = await fetch(`${API}/bloqueoAgenda/InsertarBloqueo`,{
            method: 'POST',
            headers: {Accept: 'application/json',
            'Content-Type': 'application/json'},
            body: JSON.stringify({id_profesional,fechaInicio,horaInicio,fechaFinalizacion,horaFinalizacion,motivo}),
            mode: 'cors'
        })

            if (!res.ok) {
                return toast.error("No se ha podido insertar bloqueo al sistema. Intente mas tarde.")
            }else{

                const respuestaBackend = await res.json();
                if(respuestaBackend.message ===true){
                    setMotivo("");
                    setId_profesional("");
                    setfechaInicio("");
                    setfechaFinalizacion("");
                    setHoraInicio("");
                    setHoraFinalizacion("");
                    await verTodosLosBloqueos();
                    return toast.success('Se ha ingresado con exito el bloqueo al sistema. ')
                }else {
                    return toast.error("No se ha podido insertar bloqueo al sistema. Intente mas tarde.")
                }

            }

        }catch (error) {
            return toast.error("No se ha podido insertar el bloqueo de horario. Contacte a soporte TI de nativecode ")
        }
    }

    async function verTodosLosBloqueos(){
        try {
            const res = await fetch(`${API}/bloqueoAgenda/seleccionarTodos`, {
                method: 'GET',
                headers: {Accept: 'application/json'},
                mode: 'cors'
            })

            const respuestaBackend = await res.json();
            setListaBloqueos(respuestaBackend);


        }catch (error) {
            return toast.error('No fue posible cargar los datos de los bloqueos')
        }
    }

    useEffect(() => {
        verTodosLosBloqueos()
    },[])




    async function eliminarBloqueo(id_bloqueo) {
        try {
            if(!id_bloqueo){
                return toast.error('Debe seleccionar el bloqueo que desea eliminar.');
            }
            const res = await fetch(`${API}/bloqueoAgenda/eliminarBloqueo`,{
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json'},
                body: JSON.stringify({id_bloqueo}),
                mode: 'cors'
            })

            if (!res.ok) {
                return toast.error("No se ha podido eliminar el bloqueo del sistema. Intente mas tarde.")
            }else{

                const respuestaBackend = await res.json();
                if(respuestaBackend.message ===true){
                    await verTodosLosBloqueos();
                    return toast.success('Se ha eliminado con exito el bloqueo del sistema. ')
                }else {
                    return toast.error("No se ha podido insertar bloqueo al sistema. Intente mas tarde.")
                }
            }
        }catch (error) {
            return toast.error("No se ha podido eliminar el bloqueo de horario. Contacte a soporte TI de nativecode ")
        }
    }


    async function filtrarPorProfesional(id_profesional) {
        try {
            const res = await fetch(`${API}/bloqueoAgenda/seleccionarBloqueosPorProfesional`,{
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json'},
                body: JSON.stringify({id_profesional}),
                mode: 'cors'
            })
                const respuestaBackend = await res.json();
                setListaBloqueos(respuestaBackend);

        }catch (error) {
            return toast.error("No se ha podido seleccionar el listado de bloqueos de horarios. Contacte a soporte TI de nativecode ")
        }
    }

    useEffect(() => {
        filtrarPorProfesional(id_profesional)
    },[id_profesional])

    return (
        <div>

            {/* PANTALLAS EN CELULARES */}
            <div className="block md:hidden min-h-screen bg-slate-50 px-4 py-5">
                <ToasterClient/>

                <div className="max-w-7xl mx-auto mb-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-semibold text-slate-900">Bloqueo de Agenda por Profesionales</h1>
                        <InfoButton informacion={"En este apartado puede ingresar los períodos en los que un profesional específico no atenderá. Los bloqueos pueden abarcar horas, días completos, semanas, meses o cualquier rango de tiempo que necesite.\n\nPara ingresar un bloqueo, debe completar todos los campos del formulario: seleccionar el profesional, definir el rango de fechas y horas, e indicar el motivo del bloqueo.\n\nPara desbloquear un horario, busque el bloqueo en la tabla inferior y presione el botón Eliminar.\n\nImportante: los bloqueos no son editables. Si necesita modificar un bloqueo existente, debe eliminarlo e ingresarlo nuevamente con los datos correctos."}/>
                    </div>
                    <div className="h-px w-full bg-slate-200 mt-3"></div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 gap-4">
                    {/* Card del Formulario */}
                    <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                        <div className="relative p-4">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">Nuevo Bloqueo de Agenda</h2>
                                    <p className="text-xs text-slate-400">Bloquea un rango horario para un profesional</p>
                                </div>
                            </div>

                            <div className="h-px w-full bg-slate-100 my-4"></div>

                            <div className="space-y-4">
                                {/* Paso 1: Profesional */}
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold">1</span>
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Profesional</label>
                                    </div>
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

                                {/* Paso 2: Rango de fechas */}
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold">2</span>
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Rango de fechas y horas</label>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs text-slate-500 mb-1 block">Desde</label>
                                            <ShadcnFechaHora onChange={manejarFechaHoraInicio} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 mb-1 block">Hasta</label>
                                            <ShadcnFechaHora onChange={manejarFechaHoraFinalizacion} />
                                        </div>
                                    </div>
                                </div>

                                {/* Paso 3: Motivo */}
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-[10px] font-bold">3</span>
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Motivo del bloqueo</label>
                                    </div>
                                    <InputTextDinamic
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
                                        placeholder="Ej: Vacaciones, licencia médica, capacitación..."
                                    />
                                </div>

                                <div className="pt-1">
                                    <button
                                        onClick={() => insertarBloqueoHorario(id_profesional,fechaInicio,horaInicio,fechaFinalizacion,horaFinalizacion,motivo)}
                                        className="w-full group relative py-2.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 shadow-md"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Ingresar Bloqueo
                                        </span>
                                    </button>




                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card de la Tabla */}
                    <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="relative p-4">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    Bloqueos Activos
                                </h2>
                            </div>

                            <div>
                                <Table className="text-xs">
                                    <TableCaption className="text-xs text-slate-500">Lista de bloqueos por Profesionales</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-xs text-slate-600">Profesional</TableHead>
                                            <TableHead className="text-xs text-slate-600">Motivo</TableHead>
                                            <TableHead className="text-xs text-slate-600">Fecha Inicio</TableHead>
                                            <TableHead className="text-xs text-slate-600">Hora Inicio</TableHead>
                                            <TableHead className="text-xs text-slate-600">Fecha Fin</TableHead>
                                            <TableHead className="text-xs text-slate-600">Hora Fin</TableHead>
                                            <TableHead className="text-xs text-slate-600">Accion</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {listaBloqueos.map((bloqueo) => (
                                            <TableRow key={bloqueo.id_bloqueo}>
                                                <TableCell className="py-1">{bloqueo.nombreProfesional}</TableCell>
                                                <TableCell className="py-1">{bloqueo.motivo}</TableCell>
                                                <TableCell className="py-1">{formatearFechaTabla(bloqueo.fechaInicio)}</TableCell>
                                                <TableCell className="py-1">{bloqueo.horaInicio}</TableCell>
                                                <TableCell className="py-1">{formatearFechaTabla(bloqueo.fechaFinalizacion)}</TableCell>
                                                <TableCell className="py-1">{bloqueo.horaFinalizacion}</TableCell>
                                                <TableCell className="py-1">
                                                    <button
                                                        onClick={() => eliminarBloqueo(bloqueo.id_bloqueo)}
                                                        className="bg-red-600 hover:bg-red-500 text-white text-xs font-medium py-1 px-3 rounded-lg transition-colors"
                                                    >
                                                        Eliminar
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

            {/* PANTALLA EN COMPUTADORES DE ESCRITORIO */}
            <div className="hidden md:block min-h-screen bg-slate-50 px-8 py-8">
                <ToasterClient/>

                <div className="max-w-7xl mx-auto mb-7">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-semibold text-slate-900">Bloqueo de Agenda por Profesionales</h1>
                        <InfoButton informacion={"En este apartado puede ingresar los períodos en los que un profesional específico no atenderá. Los bloqueos pueden abarcar horas, días completos, semanas, meses o cualquier rango de tiempo que necesite.\n\nPara ingresar un bloqueo, debe completar todos los campos del formulario: seleccionar el profesional, definir el rango de fechas y horas, e indicar el motivo del bloqueo.\n\nPara desbloquear un horario, busque el bloqueo en la tabla inferior y presione el botón Eliminar.\n\nImportante: los bloqueos no son editables. Si necesita modificar un bloqueo existente, debe eliminarlo e ingresarlo nuevamente con los datos correctos."}/>
                    </div>
                    <div className="h-px w-full bg-slate-200 mt-4"></div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6">
                    {/* Card del Formulario */}
                    <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                        <div className="relative p-6">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Nuevo Bloqueo de Agenda</h2>
                                    <p className="text-sm text-slate-400">Bloquea un rango horario para un profesional</p>
                                </div>
                            </div>

                            <div className="h-px w-full bg-slate-100 my-5"></div>

                            <div className="space-y-5">
                                {/* Paso 1: Profesional */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[11px] font-bold">1</span>
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Profesional</label>
                                    </div>
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

                                {/* Paso 2: Rango de fechas */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-[11px] font-bold">2</span>
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Rango de fechas y horas</label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Desde</label>
                                            <ShadcnFechaHora onChange={manejarFechaHoraInicio} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Hasta</label>
                                            <ShadcnFechaHora onChange={manejarFechaHoraFinalizacion} />
                                        </div>
                                    </div>
                                </div>

                                {/* Paso 3: Motivo */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-[11px] font-bold">3</span>
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Motivo del bloqueo</label>
                                    </div>
                                    <InputTextDinamic
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
                                        placeholder="Ej: Vacaciones, licencia médica, capacitación..."
                                    />
                                </div>

                                <div className="pt-1 flex justify-end gap-3">
                                    <button
                                        onClick={() => verTodosLosBloqueos()}
                                        className="group relative py-2.5 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 shadow-md"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            </svg>
                                            Cargar Todos los Bloqueos
                                        </span>
                                    </button>



                                    <button
                                        onClick={() => insertarBloqueoHorario(id_profesional,fechaInicio,horaInicio,fechaFinalizacion,horaFinalizacion,motivo)}
                                        className="group relative py-2.5 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 shadow-md"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Ingresar Bloqueo
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card de la Tabla */}
                    <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="relative p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    Bloqueos Activos
                                </h2>
                            </div>

                            <div>
                                <Table className="text-xs">
                                    <TableCaption className="text-xs text-slate-500">Lista de bloqueos por Profesionales</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-xs text-slate-600">Profesional</TableHead>
                                            <TableHead className="text-xs text-slate-600">Motivo</TableHead>
                                            <TableHead className="text-xs text-slate-600">Fecha Inicio</TableHead>
                                            <TableHead className="text-xs text-slate-600">Hora Inicio</TableHead>
                                            <TableHead className="text-xs text-slate-600">Fecha Fin</TableHead>
                                            <TableHead className="text-xs text-slate-600">Hora Fin</TableHead>
                                            <TableHead className="text-xs text-slate-600">Accion</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {listaBloqueos.map((bloqueo) => (
                                            <TableRow key={bloqueo.id_bloqueo}>
                                                <TableCell className="py-1">{bloqueo.nombreProfesional}</TableCell>
                                                <TableCell className="py-1">{bloqueo.motivo}</TableCell>
                                                <TableCell className="py-1">{formatearFechaTabla(bloqueo.fechaInicio)}</TableCell>
                                                <TableCell className="py-1">{bloqueo.horaInicio}</TableCell>
                                                <TableCell className="py-1">{formatearFechaTabla(bloqueo.fechaFinalizacion)}</TableCell>
                                                <TableCell className="py-1">{bloqueo.horaFinalizacion}</TableCell>
                                                <TableCell className="py-1">
                                                    <button
                                                        onClick={() => eliminarBloqueo(bloqueo.id_bloqueo)}
                                                        className="bg-red-600 hover:bg-red-500 text-white text-xs font-medium py-1 px-3 rounded-lg transition-colors"
                                                    >
                                                        Eliminar
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

        </div>
    )


}
