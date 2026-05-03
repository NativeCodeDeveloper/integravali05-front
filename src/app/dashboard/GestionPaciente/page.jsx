"use client"

import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {useState, useEffect} from "react";
import ToasterClients from "@/Componentes/ToasterClient";
import ShadcnInput from "@/Componentes/shadcnInput2";
import {ShadcnSelect} from "@/Componentes/shadcnSelect";
import ShadcnButton from "@/Componentes/shadcnButton2";
import {toast} from "react-hot-toast";
import * as React from "react"
import ShadcnDatePicker from "@/Componentes/shadcnDatePicker";
import {useRouter} from "next/navigation";
import {UserIcon} from "@heroicons/react/24/outline";
import {InfoButton} from "@/Componentes/InfoButton";
import {Textarea} from "@/components/ui/textarea";


export default function GestionPaciente() {

    const API = process.env.NEXT_PUBLIC_API_URL;
    const [listaPacientes, setListaPacientes] = useState([]);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [rut, setRut] = useState("");
    const [nacimiento, setNacimiento] = useState("");
    const [sexo, setSexo] = useState("");
    const [prevision, setPrevision] = useState("FONASA");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [pais, setPais] = useState("");
    const [observacion1, setObservacion1] = useState("");
    const [apoderado, setApoderado] = useState("");
    const [apoderadoRut, setApoderadoRut] = useState("");
    const [medicamentosUsados, setMedicamentosUsados] = useState("");
    const [habitos, setHabitos] = useState("");
    const [comentariosAdicionales, setComentariosAdicionales] = useState("");

    const [nombreBuscado, setNombreBuscado] = useState("");
    const [rutBuscado, setRutBuscado] = useState("");

    const router = useRouter();

    function verDetallePaciente(id_paciente) {
        router.push(`/dashboard/paciente/${id_paciente}`);
    }

    async function buscarRutSimilar(rutBuscado) {
        try {
            if (!rutBuscado) {
                toast.error("Debe ingresar previamente un RUT para buscar similitudes.")
            }

            let rut = rutBuscado;

            const res = await fetch(`${API}/pacientes/contieneRut`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({rut}),
                mode: "cors"
            })
            if (!res.ok) {
                return res.json();
            } else {
                const dataRutSimilar = await res.json()

                if (Array.isArray(dataRutSimilar) && dataRutSimilar.length > 0) {
                    setListaPacientes(dataRutSimilar)
                    return toast.success("Similitud encontrada!")
                } else {
                    return toast.error("No se han encontrado similitudes.")
                }
            }
        } catch (err) {
            console.log(err);
            return toast.error("Ha ocurrido un problema en el servidor")
        }
    }

    async function buscarNombreSimilar(nombreBuscado) {
        try {
            let nombre = nombreBuscado.trim();

            if (!nombreBuscado) {
                toast.error("Debe ingresar previamente un nombre para buscar similitudes.")
            }

            const res = await fetch(`${API}/pacientes/contieneNombre`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({nombre}),
                mode: "cors",
                cache: "no-cache"
            })

            if (!res.ok) {
                return res.json();
            } else {
                const dataSimilar = await res.json();

                if (Array.isArray(dataSimilar) && dataSimilar.length > 0) {
                    setListaPacientes(dataSimilar);
                    return toast.success("Similitud encontrada!")
                } else {
                    return toast.error("No se han encontrado similitudes.")
                }
            }
        } catch (err) {
            console.log(err);
            return toast.error("Ha habido un problema en el servidor por favor contacte a soporte de Medify");
        }
    }

    async function insertarPaciente(nombre, apellido, rut, nacimiento, sexo, prevision, telefono, correo, direccion, pais, observacion1, apoderado, apoderado_rut, medicamentosUsados, habitos, comentariosAdicionales) {
        try {
            let prevision_id = null;

            if (prevision.includes("FONASA")) {
                prevision_id = 1;
            } else if (prevision.includes("ISAPRE")) {
                prevision_id = 2;
            } else if (prevision.includes("CONVENIO")) {
                prevision_id = 3;
            } else if (prevision.includes("SIN PREVISION")) {
                prevision_id = 4;
            } else {
                return toast.error("Debe seleccionar al menos una previsión");
            }

            if (!nombre || !apellido || !rut || !nacimiento || !sexo || !prevision_id || !telefono || !correo || !direccion || !pais) {
                return toast.error("Debe llenar todos los campos para ingresar un nuevo paciente en las bases de datos.")
            }

            const res = await fetch(`${API}/pacientes/pacientesInsercion`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    rut,
                    nacimiento,
                    sexo,
                    prevision_id,
                    telefono,
                    correo,
                    direccion,
                    pais,
                    observacion1,
                    apoderado,
                    apoderado_rut,
                    medicamentosUsados,
                    habitos,
                    comentariosAdicionales
                }),
                mode: "cors"
            })

            if (!res.ok) {
                return toast.error("Problema al Ingresar nuevo paciente en el servidor. Por favor contacte a soporte Tecnico de Medify")
            } else {
                const respuestaBackend = await res.json();

                if (respuestaBackend.message === true) {
                    setNombre("");
                    setApellido("");
                    setRut("");
                    setTelefono("");
                    setCorreo("");
                    setDireccion("");
                    setPais("");
                    setObservacion1("");
                    setApoderado("");
                    setApoderadoRut("");
                    setMedicamentosUsados("");
                    setHabitos("");
                    setComentariosAdicionales("");
                    await listarPacientes();
                    return toast.success("Paciente ingresado correctamente.");
                }
            }
        } catch (err) {
            console.error(err);
            return toast.error("Problema al Ingresar nuevo paciente en el servidor. Por favor contacte a soporte Tecnico de Medify")
        }
    }

    async function listarPacientes() {
        try {
            const res = await fetch(`${API}/pacientes`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
                mode: "cors"
            })

            if (!res.ok) {
                return toast.error("Ha ocurrido un error listando los pacientes . contacte a soporte IT de Medify")
            } else {
                const dataPacientes = await res.json()
                setListaPacientes(dataPacientes);
            }
        } catch (error) {
            console.log(error);
            return toast.success("Ha ocurrido un error contacte a soporte de Medify");
        }
    }

    useEffect(() => {
        listarPacientes();
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
            <ToasterClients/>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700 mb-1">Administración</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                            Gestión de Pacientes
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Registra pacientes rápidamente para abrir su ficha clínica</p>
                    </div>
                    <InfoButton informacion={"Este módulo de la aplicación está diseñado para registrar el libro de ficha clínica de un paciente. Cuando un paciente acude por primera vez a una sesión o consulta, debe ser ingresado una única vez en este apartado. De esta forma, el sistema almacenará sus datos demográficos, permitiendo posteriormente comenzar con la documentación de sus fichas clínicas.\n\nEs importante considerar que la agenda de un paciente no está directamente relacionada con su ingreso en el sistema. Un paciente puede estar agendado para una atención, pero no contará con ficha clínica hasta que sea registrado previamente en esta sección.\n\nPara editar la información de un paciente, en la tabla inferior se debe seleccionar el ícono de la persona ubicado bajo el título \"Ver datos\". Al seleccionarlo, se podrá acceder a la información del paciente para modificarla o eliminarla, según sea necesario.\n"}/>
                </div>

                <div className="space-y-6">

                    {/* Formulario de ingreso */}
                    <div className="bg-white border border-slate-300 rounded-[24px] shadow-[0_18px_50px_rgba(15,23,42,0.12)] overflow-hidden">
                        <div className="border-b border-slate-200 bg-slate-100/80 px-5 py-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                            </svg>
                            <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">Ingreso de Paciente</h2>
                        </div>

                        <div className="p-5 md:p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre <span className="text-red-500">*</span></label>
                                    <ShadcnInput
                                        value={nombre}
                                        placeholder={"Ej: Andrea Ignacia"}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className="w-full"/>
                                    <p className="mt-1 text-[11px] text-slate-400">Campo obligatorio</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Apellido <span className="text-red-500">*</span></label>
                                    <ShadcnInput
                                        value={apellido}
                                        placeholder={"Ej: Varela Garrido"}
                                        onChange={(e) => setApellido(e.target.value)}
                                        className="w-full"/>
                                    <p className="mt-1 text-[11px] text-slate-400">Campo obligatorio</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Número Identificación (RUT) <span className="text-red-500">*</span></label>
                                    <ShadcnInput
                                        value={rut}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                                            setRut(value);
                                        }}
                                        placeholder="12345678K (Sin puntos ni guion)"
                                        className="w-full"
                                    />
                                    <p className="mt-1 text-[11px] text-slate-400">Campo obligatorio</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Sexo <span className="text-red-500">*</span></label>
                                    <ShadcnInput
                                        value={sexo}
                                        placeholder={"Ej: Femenino"}
                                        onChange={(e) => setSexo(e.target.value)}
                                        className="w-full"/>
                                    <p className="mt-1 text-[11px] text-slate-400">Campo obligatorio</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Previsión <span className="text-red-500">*</span></label>
                                    <div className="w-full [&_button]:w-full [&_button]:h-10 [&_button]:justify-between [&_button]:rounded-md [&_button]:border-slate-200 [&_button]:bg-white [&_button]:px-3 [&_button]:text-sm [&_button]:text-slate-700 [&_button]:shadow-none">
                                        <ShadcnSelect
                                            nombreDefault={"Seleccione Previsión"}
                                            value1={"FONASA"}
                                            value2={"ISAPRE"}
                                            value3={"CONVENIO"}
                                            value4={"SIN PREVISION"}
                                            onChange={(value) => setPrevision(value)}
                                        />
                                    </div>
                                    <p className="mt-1 text-[11px] text-slate-400">Campo obligatorio</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono <span className="text-red-500">*</span></label>
                                    <ShadcnInput
                                        value={telefono}
                                        placeholder={"Ej: +569 99764369"}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        className="w-full"/>
                                    <p className="mt-1 text-[11px] text-slate-400">Campo obligatorio</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo <span className="text-red-500">*</span></label>
                                    <ShadcnInput
                                        value={correo}
                                        placeholder={"CorreoDelPaciente@gmail.com"}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        className="w-full"/>
                                    <p className="mt-1 text-[11px] text-slate-400">Campo obligatorio</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Dirección <span className="text-red-500">*</span></label>
                                    <ShadcnInput
                                        placeholder={"Avenida España 123 / Concepcion"}
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        className="w-full"/>
                                    <p className="mt-1 text-[11px] text-slate-400">Campo obligatorio</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">País <span className="text-red-500">*</span></label>
                                    <ShadcnInput
                                        value={pais}
                                        placeholder={"Ej: Argentina"}
                                        onChange={(e) => setPais(e.target.value)}
                                        className="w-full"/>
                                    <p className="mt-1 text-[11px] text-slate-400">Campo obligatorio</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha de Nacimiento <span className="text-red-500">*</span></label>
                                    <ShadcnDatePicker
                                        label=""
                                        value={nacimiento}
                                        onChange={(fecha) => setNacimiento(fecha)}
                                    />
                                    <p className="mt-1 text-[11px] text-slate-400">Campo obligatorio</p>
                                </div>

                                <div className="sm:col-span-2 xl:col-span-3 pt-2">
                                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Apoderado</label>
                                            <ShadcnInput
                                                value={apoderado}
                                                placeholder={"Nombre completo del apoderado"}
                                                onChange={(e) => setApoderado(e.target.value)}
                                                className="w-full"/>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">RUT Apoderado</label>
                                            <ShadcnInput
                                                value={apoderadoRut}
                                                placeholder={"11222333K"}
                                                onChange={(e) => setApoderadoRut(e.target.value)}
                                                className="w-full"/>
                                        </div>

                                        <div className="md:col-span-2 xl:col-span-3">
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Observación 1</label>
                                            <Textarea
                                                value={observacion1}
                                                onChange={(e) => setObservacion1(e.target.value)}
                                                placeholder="Observación clínica o administrativa"
                                                className="min-h-[96px] resize-y"/>
                                        </div>

                                        <div className="md:col-span-2 xl:col-span-3">
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Medicamentos Usados</label>
                                            <Textarea
                                                value={medicamentosUsados}
                                                onChange={(e) => setMedicamentosUsados(e.target.value)}
                                                placeholder="Medicamentos actuales o de uso frecuente"
                                                className="min-h-[96px] resize-y"/>
                                        </div>

                                        <div className="md:col-span-2 xl:col-span-3">
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Hábitos</label>
                                            <Textarea
                                                value={habitos}
                                                onChange={(e) => setHabitos(e.target.value)}
                                                placeholder="Hábitos del paciente relevantes para la atención"
                                                className="min-h-[96px] resize-y"/>
                                        </div>

                                        <div className="md:col-span-2 xl:col-span-3">
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Comentarios Adicionales</label>
                                            <Textarea
                                                value={comentariosAdicionales}
                                                onChange={(e) => setComentariosAdicionales(e.target.value)}
                                                placeholder="Comentarios adicionales sin límite visual corto"
                                                className="min-h-[120px] resize-y"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:col-span-2 xl:col-span-3 flex justify-end pt-2">
                                    <button
                                        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-700 to-teal-600 rounded-xl hover:from-indigo-800 hover:to-teal-700 transition-all duration-150 shadow-md hover:shadow-lg"
                                        type={"button"}
                                        onClick={() => insertarPaciente(nombre, apellido, rut, nacimiento, sexo, prevision, telefono, correo, direccion, pais, observacion1, apoderado, apoderadoRut, medicamentosUsados, habitos, comentariosAdicionales)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                                        </svg>
                                        Ingresar Paciente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Búsqueda */}
                    <div className="bg-white border border-slate-300 rounded-[24px] shadow-[0_18px_50px_rgba(15,23,42,0.12)] overflow-hidden">
                        <div className="border-b border-slate-200 bg-slate-100/80 px-5 py-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">Búsqueda de Pacientes</h2>
                        </div>

                        <div className="p-5 md:p-6">
                            <p className="text-xs text-slate-400 mb-4">Busca por nombre o RUT para evitar duplicados</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Buscar por Nombre</label>
                                    <div className="flex gap-2">
                                        <ShadcnInput
                                            placeholder="Ej: Nicolas Andres..."
                                            value={nombreBuscado}
                                            onChange={(e) => setNombreBuscado(e.target.value)}
                                            className="w-full"
                                        />
                                        <button
                                            onClick={() => buscarNombreSimilar(nombreBuscado)}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-700 to-teal-600 rounded-xl hover:from-indigo-800 hover:to-teal-700 transition-all duration-150 shadow-sm flex-shrink-0">
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
                                            value={rutBuscado}
                                            placeholder={"12.345.678-9"}
                                            onChange={(e) => setRutBuscado(e.target.value)}
                                            className="w-full"
                                        />
                                        <button
                                            onClick={() => buscarRutSimilar(rutBuscado)}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-700 to-teal-600 rounded-xl hover:from-indigo-800 hover:to-teal-700 transition-all duration-150 shadow-sm flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                            </svg>
                                            Buscar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de pacientes */}
                    <div className="bg-white border border-slate-300 rounded-[24px] shadow-[0_18px_50px_rgba(15,23,42,0.12)] overflow-hidden">
                        <div className="border-b border-slate-200 bg-slate-100/80 px-5 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">Listado de Pacientes</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                                    {listaPacientes.length}
                                </span>
                                <button
                                    onClick={() => listarPacientes()}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-150">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                    </svg>
                                    Mostrar Todos
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableCaption className="font-medium text-slate-400 text-xs py-4">Listado de pacientes registrados en el sistema</TableCaption>
                                <TableHeader>
                                    <TableRow className="bg-[linear-gradient(135deg,#0f172a_0%,#312e81_58%,#0891b2_100%)]">
                                        <TableHead className="w-[80px] text-center font-semibold text-white text-xs uppercase tracking-wider px-3 py-3">Ver</TableHead>
                                        <TableHead className="text-left font-semibold text-white text-xs uppercase tracking-wider px-3 py-3">Nombre</TableHead>
                                        <TableHead className="text-left font-semibold text-white text-xs uppercase tracking-wider px-3 py-3">Apellido</TableHead>
                                        <TableHead className="text-left font-semibold text-white text-xs uppercase tracking-wider px-3 py-3">RUT</TableHead>
                                        <TableHead className="text-right font-semibold text-white text-xs uppercase tracking-wider px-3 py-3">Teléfono</TableHead>
                                        <TableHead className="text-center font-semibold text-white text-xs uppercase tracking-wider px-3 py-3">Agendar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {listaPacientes.map((paciente, i) => (
                                        <TableRow
                                            key={paciente.id_paciente}
                                            className={"hover:bg-indigo-50/50 transition-colors duration-100 " + (i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50')}>
                                            <TableCell className="text-center px-3 py-2.5">
                                                <button
                                                    onClick={() => verDetallePaciente(paciente.id_paciente)}
                                                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-150">
                                                    <UserIcon className="w-4 h-4"/>
                                                </button>
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-800 text-sm px-3 py-2.5">{paciente.nombre}</TableCell>
                                            <TableCell className="text-slate-600 text-sm px-3 py-2.5">{paciente.apellido}</TableCell>
                                            <TableCell className="text-slate-600 text-sm px-3 py-2.5 font-mono">{paciente.rut}</TableCell>
                                            <TableCell className="text-right text-slate-600 text-sm px-3 py-2.5">{paciente.telefono}</TableCell>
                                            <TableCell className="text-center px-3 py-2.5">
                                                <button
                                                    onClick={() => {
                                                        const params = new URLSearchParams({
                                                            nombre: paciente.nombre || "",
                                                            apellido: paciente.apellido || "",
                                                            rut: paciente.rut || "",
                                                            telefono: paciente.telefono || "",
                                                            email: paciente.correo || "",
                                                        });
                                                        router.push(`/dashboard/calendario?${params.toString()}`);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors duration-150">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                    Agendar paciente
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
