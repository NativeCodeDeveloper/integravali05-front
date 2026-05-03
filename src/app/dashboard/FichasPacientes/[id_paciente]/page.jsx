"use client"
import {useParams} from "next/navigation";
import {useState, useEffect} from "react";
import {toast} from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import formatearFecha from "@/FuncionesTranversales/funcionesTranversales.js"
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {useRouter} from "next/navigation";
import {ShadcnInput} from "@/Componentes/shadcnInput";
import {ShadcnSelect} from "@/Componentes/shadcnSelect";
import ShadcnDatePicker from "@/Componentes/shadcnDatePicker";
import * as React from "react";
import {CheckboxIcon} from "@radix-ui/react-icons";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {InfoButton} from "@/Componentes/InfoButton";


function parsearDatosDinamicos(datos) {
    if (!datos) return null
    let parsed = datos
    if (typeof datos === "string") {
        try { parsed = JSON.parse(datos) } catch { return null }
    }
    if (!parsed || typeof parsed !== "object") return null
    return parsed
}

function agruparPorCategoria(datos) {
    const categoriasMap = {}

    Object.keys(datos).forEach(key => {
        if (key === "_plantillaNombre") return
        const entry = datos[key]
        if (!entry || typeof entry !== "object" || !entry.nombreCategoria) return

        const catNombre = entry.nombreCategoria
        if (!categoriasMap[catNombre]) {
            categoriasMap[catNombre] = {
                nombre: catNombre,
                orden: entry.categoriaOrden || 0,
                campos: []
            }
        }
        categoriasMap[catNombre].campos.push({
            nombre: entry.nombreCampo,
            valor: entry.valor,
            orden: entry.campoOrden || 0
        })
    })

    return Object.values(categoriasMap)
        .sort((a, b) => a.orden - b.orden)
        .map(cat => ({
            ...cat,
            campos: cat.campos.sort((a, b) => a.orden - b.orden)
        }))
}

export default function Paciente() {

    const {id_paciente} = useParams();
    const [detallePaciente, setDetallePaciente] = useState([])
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    function nuevaFichaClinica() {
        router.push(`/dashboard/NuevaFicha/${id_paciente}`);
    }

    function editarPaciente() {
        router.push(`/dashboard/paciente/${id_paciente}?desde=fichas`);
    }


    function verOdontogramas() {
        router.push(`/dashboard/odontogramasPaciente/${id_paciente}`);
    }

    function editarFichaClinica(id_ficha) {
        router.push(`/dashboard/EdicionFicha/${id_ficha}`);
    }

    function agendarPaciente() {
        const paciente = detallePaciente[0];
        if (!paciente) return;
        const params = new URLSearchParams({
            nombre: paciente.nombre || "",
            apellido: paciente.apellido || "",
            rut: paciente.rut || "",
            telefono: paciente.telefono || "",
            email: paciente.correo || "",
        });
        router.push(`/dashboard/calendario?${params.toString()}`);
    }

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [rut, setRut] = useState("");
    const [nacimiento, setNacimiento] = useState("");
    const [sexo, setSexo] = useState("");
    const [prevision, setPrevision] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [pais, setPais] = useState("");

    const [checked, setChecked] = useState(true);

    const [tipoAtencion, setTipoAtencion] = useState("");
    const [motivoConsulta, setMotivoConsulta] = useState("");
    const [signosVitales, setSignosVitales] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [anotacionConsulta, setAnotacionConsulta] = useState("");
    const [anamnesis, setAnamnesis] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [indicaciones, setIndicaciones] = useState("");
    const [archivosAdjuntos, setArchivosAdjuntos] = useState("");
    const [fechaConsulta, setFechaConsulta] = useState("");
    const [estadoFicha, setEstadoFicha] = useState("");
    const [consentimientoFirmado, setConsentimientoFirmado] = useState("");

    const [listaFichas, setListaFichas] = useState([]);
    const [filtroProfesional, setFiltroProfesional] = useState("");

    async function eliminarFicha(id_ficha) {
        try {
            if (!id_ficha) {
                return toast.error("Debe seleccionar al menos una ficha clinica");
            }

            const res = await fetch(`${API}/ficha/eliminarFichaClinica`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_ficha}),
                mode: "cors",
                cache: "no-cache"
            })

            if (!res.ok) {
                return toast.error("No se puedo eliminar la ficha , contacte a soporte informatico");
            } else {
                const resultadoBackend = await res.json();
                if (resultadoBackend.message === true) {
                    await listarFichasClinicasPaciente(id_paciente)
                    return toast.success("Se ha eliminado la ficha con exito!")
                } else {
                    return toast.error("No se ha podido eliminar la ficha por favor intente mas tarde")
                }
            }
        } catch (error) {
            return toast.error("Ha ocurrido un error contacte a soporte tecnico");
        }
    }

    async function listarFichasClinicasPaciente(id_paciente) {
        try {
            if (!id_paciente) {
                return toast.error("No se ha seleccionado ningun Id, si el problema persiste contcate a soporte de Medify")
            } else {
                const res = await fetch(`${API}/ficha/seleccionarFichasPaciente`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({id_paciente}),
                    mode: "cors"
                })

                if (!res.ok) {
                    return toast.error("Ha ocurrido un error Contacte a soporte de Medify")
                }

                const dataFichasClinicas = await res.json();
                setListaFichas(dataFichasClinicas);
            }
        } catch (e) {
            console.log(e)
            return toast.error("Ha ocurrido un error en el servidor: " + e)
        }
    }

    async function buscarPorProfesional() {
        if (!filtroProfesional.trim()) {
            return toast.error("Ingrese el nombre del profesional para buscar")
        }
        try {
            const res = await fetch(`${API}/ficha/seleccionar_similitud_nombre_profesional`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({observaciones: filtroProfesional.trim()}),
                mode: "cors"
            })

            if (!res.ok) {
                setListaFichas([])
                return toast.error("No se encontraron fichas con ese profesional")
            }

            const data = await res.json()
            if (Array.isArray(data) && data.length > 0) {
                setListaFichas(data)
                toast.success(`Se encontraron ${data.length} fichas`)
            } else {
                setListaFichas([])
                toast.error("No se encontraron fichas con ese profesional")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error al buscar fichas por profesional")
        }
    }

    function limpiarFiltro() {
        setFiltroProfesional("")
        listarFichasClinicasPaciente(id_paciente)
    }

    function volverAFichas() {
        router.push("/dashboard/FichaClinica");
    }

    async function actualizarDatosPacientes(nombre, apellido, rut, nacimiento, sexo, prevision, telefono, correo, direccion, pais, id_paciente) {

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
            prevision_id = 0;
        }

        try {
            if (!nombre || !apellido || !rut || !nacimiento || !sexo || !prevision_id || !telefono || !correo || !direccion || !pais || !id_paciente) {
                return toast.error("Debe llenar todos los campos para proceder con la actualziacion")
            }

            const res = await fetch(`${API}/pacientes/pacientesActualizar`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                mode: "cors",
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
                    id_paciente
                })
            })

            if (!res.ok) {
                return toast.error("Debe llenar todos los campos para proceder con la actualziacion")
            } else {
                const resultadoQuery = await res.json();
                if (resultadoQuery.message === true) {
                    setNombre("");
                    setApellido("");
                    setNacimiento("");
                    setTelefono("");
                    setCorreo("");
                    setDireccion("");
                    setRut("");
                    setSexo("");
                    setPais("");
                    await buscarPacientePorId(id_paciente);
                    return toast.success("Datos del paciente actualizados con Exito!");
                } else {
                    return toast.error("No se han podido Actualizar los datos del paciente. Intente mas tarde.")
                }
            }
        } catch (err) {
            console.log(err);
            return toast.error("Ha ocurrido un problema en el servidor")
        }
    }

    async function buscarPacientePorId(id_paciente) {
        try {
            if (!id_paciente) {
                return toast.error("No se puede cargar los datos del paciente seleccionado. Debe haber seleccionado el paciente para poder ver el detalle de los datos.");
            }
            const res = await fetch(`${API}/pacientes/pacientesEspecifico`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_paciente})
            })

            if (!res.ok) {
                return toast.error("No se puede cargar los datos del paciente seleccionado.");
            }

            const dataPaciente = await res.json();
            setDetallePaciente(Array.isArray(dataPaciente) ? dataPaciente : [dataPaciente]);

        } catch (error) {
            console.log(error);
            return toast.error("No se puede cargar los datos del paciente seleccionado. Por favor contacte a soporte de Medify");
        }
    }

    useEffect(() => {
        if (!id_paciente) return;
        buscarPacientePorId(id_paciente)
        listarFichasClinicasPaciente(id_paciente)
    }, [id_paciente]);

    function calcularEdad(fechaNacimiento) {
        if (!fechaNacimiento) return '-';
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }

    function previsionDeterminacion(id_prevision) {
        if (id_prevision === 1) return "FONASA";
        if (id_prevision === 2) return "ISAPRE";
        if (id_prevision === 3) return "CONVENIO";
        if (id_prevision === 4) return "SIN PREVISION";
        return "SIN DEFINIR";
    }

    const pacienteActual = detallePaciente[0];
    const totalFichas = listaFichas.length;



    function irAReceta(id_paciente) {
        router.push(`/dashboard/recetaPacientes/${id_paciente}`);
    }



    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_32%),radial-gradient(circle_at_right,_rgba(6,182,212,0.12),_transparent_28%),linear-gradient(180deg,_#f1f5f9_0%,_#f8fafc_55%,_#f1f5f9_100%)]">
            <ToasterClient/>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                {/* Header */}
                <div className="mb-8 rounded-[28px] border border-slate-300/80 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700">Historial del paciente</p>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                                Carpeta cl&iacute;nica de {pacienteActual ? `${pacienteActual.nombre} ${pacienteActual.apellido}` : "paciente"}
                            </h1>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">Paciente</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {pacienteActual ? `${pacienteActual.nombre} ${pacienteActual.apellido}` : "Cargando..."}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-teal-200 bg-teal-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-700">Rut</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{pacienteActual?.rut || "-"}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">Fichas</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{totalFichas}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <InfoButton informacion={'En este apartado se mostrarán las fichas clínicas del paciente, ordenadas desde la más reciente a la más antigua, incluyendo tanto las fichas como sus anotaciones asociadas.\n\nPara editar una ficha clínica, debe seleccionarse el botón Editar, lo que lo llevará al formulario correspondiente donde podrá modificar la información de la ficha seleccionada.\n\nEn caso de eliminar una ficha clínica, deberá presionar el botón Eliminar. Esta acción removerá la ficha seleccionada del sistema.\n\nSi desea crear una nueva ficha clínica, debe seleccionar el botón Nueva Ficha, el cual lo dirigirá al formulario de ingreso para registrar una nueva ficha clínica.'}/>
                            <span className="text-sm text-slate-500">Panel cl&iacute;nico del paciente seleccionado</span>
                        </div>
                        <button
                            onClick={() => volverAFichas()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-150 hover:border-slate-300 hover:bg-slate-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                            Volver
                        </button>
                    </div>
                </div>

                {/* Tarjeta paciente */}
                {detallePaciente.length === 0 ? (
                    <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400 shadow-sm">
                        Cargando datos del paciente...
                    </div>
                ) : (
                    detallePaciente.map(paciente => (
                        <div key={paciente.id_paciente} className="mb-8 overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                            <div className="bg-[linear-gradient(135deg,#0f172a_0%,#312e81_58%,#0891b2_100%)] px-5 md:px-6 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
                                        <span className="text-sm font-bold tracking-wide text-white">
                                            {paciente.nombre?.charAt(0)}{paciente.apellido?.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">
                                            {paciente.nombre} {paciente.apellido}
                                        </h2>
                                        <p className="text-sm text-slate-200">RUT: {paciente.rut}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                                        Previsi&oacute;n: {previsionDeterminacion(paciente.prevision_id)}
                                    </span>
                                    <span className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
                                        Edad: {calcularEdad(paciente.nacimiento)} a&ntilde;os
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2 md:p-6 xl:grid-cols-3">
                                <div className="rounded-2xl border border-slate-300 bg-slate-100/80 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Nacimiento</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900 break-words whitespace-pre-wrap">{formatearFecha(paciente.nacimiento)}</p>
                                </div>
                                <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">Sexo</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900 break-words whitespace-pre-wrap">{paciente.sexo || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-700">Tel&eacute;fono</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900 break-words whitespace-pre-wrap">{paciente.telefono || '-'}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-300 bg-slate-100/80 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Correo</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900 break-all whitespace-pre-wrap">{paciente.correo || '-'}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-300 bg-slate-100/80 px-4 py-3 md:col-span-2 xl:col-span-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Direcci&oacute;n</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900 break-words whitespace-pre-wrap">{paciente.direccion || '-'}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-300 bg-slate-100/80 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Pa&iacute;s</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900 break-words whitespace-pre-wrap">{paciente.pais || '-'}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-300 bg-slate-100/80 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Apoderado</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900 break-words whitespace-pre-wrap">{paciente.apoderado || '-'}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-300 bg-slate-100/80 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">RUT Apoderado</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900 break-words whitespace-pre-wrap">{paciente.apoderado_rut || '-'}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-300 bg-slate-100/80 px-4 py-3 xl:col-span-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Medicamentos Usados</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900 break-words whitespace-pre-wrap">{paciente.medicamentosUsados || '-'}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-300 bg-slate-100/80 px-4 py-3 xl:col-span-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">H&aacute;bitos</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900 break-words whitespace-pre-wrap">{paciente.habitos || '-'}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-300 bg-slate-100/80 px-4 py-3 xl:col-span-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Observaci&oacute;n</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900 break-words whitespace-pre-wrap">{paciente.observacion1 || '-'}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-300 bg-slate-100/80 px-4 py-3 xl:col-span-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Comentarios Adicionales</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900 break-words whitespace-pre-wrap">{paciente.comentariosAdicionales || '-'}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Barra de acciones */}
                <div className="mb-6 overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                    <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(49,46,129,0.95)_100%)] px-5 py-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-200">Registro cl&iacute;nico</p>
                                    <h2 className="text-xl font-bold text-white">Fichas registradas</h2>
                                </div>
                            </div>
                            <span className="inline-flex w-fit items-center justify-center rounded-full border border-violet-300/20 bg-white/10 px-3 py-1.5 text-sm font-bold text-white">
                                {totalFichas} fichas
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 px-5 py-4">
                        <button
                            onClick={editarPaciente}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,23,42,0.28)] transition-all duration-150 hover:from-slate-900 hover:to-slate-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            Editar Paciente
                        </button>
                        <button
                            onClick={agendarPaciente}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-700 to-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(67,56,202,0.32)] transition-all duration-150 hover:from-indigo-800 hover:to-violet-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Agendar ahora
                        </button>
                        <button
                            onClick={() => listarFichasClinicasPaciente(id_paciente)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-150 hover:border-slate-300 hover:bg-slate-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                            Cargar Fichas
                        </button>
                        <button
                            onClick={() => nuevaFichaClinica(id_paciente)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-700 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(55,48,163,0.28)] transition-all duration-150 hover:from-indigo-800 hover:to-teal-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                            </svg>
                            Nueva Ficha
                        </button>



                        <button
                            onClick={()=> irAReceta(id_paciente)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(14,165,233,0.24)] transition-all duration-150 hover:from-cyan-600 hover:to-sky-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"/>
                            </svg>
                            Generar Receta Medica
                        </button>
                    </div>
                </div>

                {/* Filtro por profesional */}
                <div className="mb-6 overflow-hidden rounded-[24px] border border-slate-300 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.10)]">
                    <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                        <label className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">Filtrar por Profesional</label>
                    </div>
                    <div className="flex items-center gap-2 p-5">
                        <input
                            type="text"
                            value={filtroProfesional}
                            onChange={(e) => setFiltroProfesional(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && buscarPorProfesional()}
                            placeholder="Ej: Dra. Andrea, Dr. Perez..."
                            className="flex-1 h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                        />
                        <button
                            onClick={buscarPorProfesional}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-700 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:from-indigo-800 hover:to-teal-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            Buscar
                        </button>
                        {filtroProfesional && (
                            <button
                                onClick={limpiarFiltro}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-slate-100">
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

                {/* Listado de fichas */}
                <div className="space-y-4">
                    {listaFichas.length === 0 ? (
                        <div className="rounded-[24px] border border-dashed border-slate-200 bg-white py-16 text-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p className="text-sm font-medium text-slate-400">No hay fichas cargadas</p>
                            <p className="text-xs text-slate-300 mt-1">No hay fichas cl&iacute;nicas disponibles para este paciente</p>
                        </div>
                    ) : (
                        listaFichas.map((ficha) => (
                            <div key={ficha.id_ficha} className="overflow-hidden rounded-[24px] border border-slate-300 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(15,23,42,0.10)]">

                                {/* Cabecera ficha */}
                                <div className="flex flex-col gap-3 border-b border-slate-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(241,245,249,0.8)_100%)] px-5 py-4 md:px-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-200 text-indigo-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                                </svg>
                                            </div>
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
                                                <span className="text-base font-bold text-slate-900">Ficha Cl&iacute;nica &#8470; {ficha.id_ficha}</span>
                                                <span className="hidden text-slate-300 sm:inline">|</span>
                                                <span className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                    <span className="text-sm font-semibold text-teal-800">{formatearFecha(ficha.fechaConsulta)}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-[52px] flex items-center gap-2 sm:ml-0">
                                        <button
                                            onClick={() => editarFichaClinica(ficha.id_ficha)}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-300 bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-800 transition-colors duration-150 hover:bg-indigo-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => eliminarFicha(ficha.id_ficha)}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-800 transition-colors duration-150 hover:bg-rose-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                            Eliminar
                                        </button>
                                        </div>
                                    </div>
                                    {/* Chips: Plantilla + Profesional */}
                                    <div className="ml-[52px] flex flex-wrap items-center gap-2 sm:ml-0">
                                        {(() => {
                                            const datos = parsearDatosDinamicos(ficha.datosDinamicos)
                                            const plantillaNombre = datos?._plantillaNombre
                                            return plantillaNombre ? (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-300 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                                                    <span className="text-indigo-500">Plantilla:</span> {plantillaNombre}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-300 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                                                    <span className="text-indigo-500">Motivo Consulta:</span> {ficha.tipoAtencion || '-'}
                                                </span>
                                            )
                                        })()}
                                        <span className="inline-flex items-center gap-1 rounded-full border border-teal-300 bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
                                            <span className="text-teal-600">Profesional:</span> {ficha.observaciones || '-'}
                                        </span>
                                    </div>
                                </div>

                                {/* Cuerpo ficha */}
                                <div className="px-5 md:px-6 py-4">
                                    {(() => {
                                        const datos = parsearDatosDinamicos(ficha.datosDinamicos)
                                        if (datos && datos._plantillaNombre) {
                                            const categorias = agruparPorCategoria(datos)
                                            return (
                                                <div className="space-y-4">
                                                    {categorias.map(categoria => (
                                                        <div key={categoria.nombre}>
                                                            <p className="text-[11px] font-semibold text-indigo-700 uppercase tracking-[0.18em] mb-2">{categoria.nombre}</p>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                {categoria.campos.map((campo, idx) => (
                                                                    <div key={idx} className="flex flex-col gap-0.5 px-4 py-3 bg-slate-100/80 rounded-2xl border border-slate-300">
                                                                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em]">{campo.nombre}</span>
                                                                        <span className="text-sm font-medium text-slate-900 whitespace-pre-line">{campo.valor}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {categorias.length === 0 && (
                                                        <p className="text-sm text-slate-400">Sin datos registrados.</p>
                                                    )}
                                                </div>
                                            )
                                        }
                                        return (
                                            <p className="text-sm text-slate-400">Ficha sin plantilla asociada.</p>
                                        )
                                    })()}
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    )
}
