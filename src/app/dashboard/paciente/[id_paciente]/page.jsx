"use client"
import {useParams, useSearchParams} from "next/navigation";
import {useState, useEffect, useRef} from "react";
import {toast} from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import formatearFecha from "@/FuncionesTranversales/funcionesTranversales.js"
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {useRouter} from "next/navigation";
import {ShadcnInput} from "@/Componentes/shadcnInput";
import {ShadcnSelect} from "@/Componentes/shadcnSelect";
import ShadcnDatePicker from "@/Componentes/shadcnDatePicker";
import * as React from "react";
import {InfoButton} from "@/Componentes/InfoButton";
import {Textarea} from "@/components/ui/textarea";




export default function Paciente(){

    const {id_paciente} = useParams();
    const searchParams = useSearchParams();
    const vieneDeFichas = searchParams.get("desde") === "fichas";
    const [detallePaciente, setDetallePaciente] = useState([])
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const formularioRef = useRef(null);

    function volverAFichas() {
        router.push(`/dashboard/FichasPacientes/${id_paciente}`);
    }




    //PARAMETROS USESTATE PARA INSERCION DE DATOS EN PACIENTES
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [rut, setRut] = useState("");
    const [nacimiento, setNacimiento] = useState("");
    const [sexo, setSexo] = useState("");
    const [prevision, setPrevision] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const[pais, setPais] = useState("");
    const [observacion1, setObservacion1] = useState("");
    const [apoderado, setApoderado] = useState("");
    const [apoderadoRut, setApoderadoRut] = useState("");
    const [medicamentosUsados, setMedicamentosUsados] = useState("");
    const [habitos, setHabitos] = useState("");
    const [comentariosAdicionales, setComentariosAdicionales] = useState("");

    function volverAingreso(){
        router.push("/dashboard/GestionPaciente");
    }


    function convertirFecha(isoString) {
        if (!isoString) return null;

        const date = new Date(isoString);
        return date.toISOString().split("T")[0];
    }


    //FUNCION PARA LA ACTUALIZACION DE DATOS DEL PACIENTE
    async function actualizarDatosPacientes(nombre,apellido,rut,nacimiento,sexo, prevision,telefono,correo,direccion,pais,observacion1,apoderado,apoderado_rut,medicamentosUsados,habitos,comentariosAdicionales,id_paciente ) {

        let prevision_id = 0;

        if (prevision.includes("FONASA")) {
            prevision_id = 1;
        } else if (prevision.includes("ISAPRE")) {
            prevision_id = 2;
        } else if (prevision.includes("CONVENIO")) {
            prevision_id = 3;
        } else if (prevision.includes("SIN PREVISION")) {
            prevision_id = 4;
        }

        try {
            if (!nombre || !apellido || !rut || !nacimiento || !sexo || !prevision_id || !telefono || !correo || !direccion || !pais || !id_paciente) {
                return toast.error("Debe llenar todos los campos para proceder con la actualziacion")
            }

            const res = await fetch(`${API}/pacientes/pacientesActualizar`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({
                    nombre,
                    apellido,
                    rut,
                    nacimiento : convertirFecha(nacimiento),
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
                    comentariosAdicionales,
                    id_paciente})
            })

            if(!res.ok) {
                return toast.error("Debe llenar todos los campos para proceder con la actualziacion, El servidor no esta recibiendo la informacion correcta.")

            } else{

                const resultadoQuery = await res.json();

                if(resultadoQuery.message === true){
                    setNombre("");
                    setApellido("");
                    setNacimiento("");
                    setTelefono("");
                    setCorreo("");
                    setDireccion("");
                    setRut("");
                    setSexo("");
                    setPais("");
                    setObservacion1("");
                    setApoderado("");
                    setApoderadoRut("");
                    setMedicamentosUsados("");
                    setHabitos("");
                    setComentariosAdicionales("");
                    await buscarPacientePorId(id_paciente);
                    return toast.success("Datos del paciente actualizados con Exito!");

                }else{
                    return toast.error("No se han podido Actualizar los datos del paciente. Intente mas tarde.")
                }
            }
        }catch(err) {
            console.log(err);
            return toast.error("Ha ocurrido un problema en el servidor")
        }
    }


    async function buscarPacientePorId(id_paciente){
        try {
            if(!id_paciente){
                return toast.error("No se puede cargar los datos del paciente seleccionado. Debe haber seleccionado el paciente para poder ver el detalle de los datos.");
            }

            const res = await fetch(`${API}/pacientes/pacientesEspecifico`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({id_paciente})
            })

            if(!res.ok){
                return toast.error("No se puede cargar los datos del paciente seleccionado.");
            }

            const dataPaciente = await res.json();
            // Asegurar que siempre guardamos un array para poder mapear sin errores
            setDetallePaciente(Array.isArray(dataPaciente) ? dataPaciente : [dataPaciente]);

        }catch(error){
            console.log(error);
            return toast.error("No se puede cargar los datos del paciente seleccionado. Por favor contacte a soporte de Medify");

        }
    }

    // Ejecutar la búsqueda cuando cambie id_paciente (Next puede resolver el param después del primer render)
    useEffect(() => {
        if (!id_paciente) return;
        buscarPacientePorId(id_paciente)
    }, [id_paciente]);


    useEffect(() => {
        if (detallePaciente.length > 0) {
            const paciente = detallePaciente[0];
            setNombre(paciente.nombre);
            setApellido(paciente.apellido);
            setRut(paciente.rut);
            setNacimiento(paciente.nacimiento);
            setSexo(paciente.sexo);
            setPrevision(previsionDeterminacion(paciente.prevision_id));
            setTelefono(paciente.telefono);
            setCorreo(paciente.correo);
            setDireccion(paciente.direccion);
            setPais(paciente.pais);
            setObservacion1(paciente.observacion1 ?? "");
            setApoderado(paciente.apoderado ?? "");
            setApoderadoRut(paciente.apoderado_rut ?? "");
            setMedicamentosUsados(paciente.medicamentosUsados ?? "");
            setHabitos(paciente.habitos ?? "");
            setComentariosAdicionales(paciente.comentariosAdicionales ?? "");
        }
    }, [detallePaciente]);





    function previsionDeterminacion(id_prevision){
        if(id_prevision === 1) return "FONASA";
        if(id_prevision === 2) return "ISAPRE";
        if(id_prevision === 3) return "CONVENIO";
        if(id_prevision === 4) return "SIN PREVISION";
        return "SIN DEFINIR";
    }



    async function eliminarPaciente(id_paciente){
        try {
            if(!id_paciente){
                return toast.error("No se puede eliminar el paciente si no hay pacientes seleccionados.")
            }

            const res = await fetch(`${API}/pacientes/eliminarPaciente`, {
                method: "POST",
                headers: {Accept: "application/json",
                "Content-Type": "application/json"},
                body: JSON.stringify({id_paciente})
            })

            if(!res.ok){
                return toast.error("No se ha podido eliminar paciente, contacte a soporte de NativeCode (Problema en el servidor)")
            }else{

                const resultadoBackend = await res.json();
                if(resultadoBackend.message === true){
                    toast.success("Se ha eliminado correctamente el paciente de la base de datos");
                    router.push("/dashboard/GestionPaciente");
                    return;
                }else{
                    return toast.error("No se ha podido elimnar al paciente de la base de datos, el mensaje que llega se contepla como false")
                }
            }
        }catch (error) {
            return toast.error('No ha sido posible eliminar al paciente, contacte a soporte ')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white py-6 sm:py-8">
            <ToasterClient/>

            <div className='flex justify-end mr-55'>
                <InfoButton informacion={"⚠️ Consideración importante:\n" +
                    "Si un paciente es eliminado, no será posible acceder a sus fichas clínicas, ya que estas quedarán ocultas en el sistema."}/>
            </div>

            <div className="max-w-5xl mx-auto px-4">
                <header className="mb-5 sm:mb-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Datos del Paciente</h1>
                            <p className="mt-1 text-sm text-slate-600">Información de contacto del Paciente </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {vieneDeFichas && (
                                <button
                                    onClick={volverAFichas}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-lg hover:from-sky-700 hover:to-cyan-600 transition-all duration-150 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                    </svg>
                                    Volver a Fichas
                                </button>
                            )}
                            <ShadcnButton nombre={"Volver a Ingreso"} funcion={()=> volverAingreso()}/>
                            <button
                                type="button"
                                onClick={() => {
                                    setMostrarFormulario(true);
                                    setTimeout(() => {
                                        formularioRef.current?.scrollIntoView({behavior: "smooth", block: "start"});
                                    }, 100);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all duration-150 shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                                Editar datos
                            </button>
                            <button
                                type="button"
                                onClick={() => eliminarPaciente(id_paciente)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all duration-150 shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                Eliminar Paciente
                            </button>
                        </div>
                    </div>
                </header>

                <div className="space-y-3">
                    {detallePaciente.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-5 text-center text-sm text-slate-600 shadow-sm">No hay datos disponibles o se están cargando...</div>
                    ) : (
                        detallePaciente.map(paciente => (
                            <article key={paciente.id_paciente} className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_20px_60px_-30px_rgba(14,116,144,0.35)] ring-1 ring-sky-100/60">
                                <div className="relative overflow-hidden bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-500 px-5 py-6 sm:px-6">
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="absolute -top-10 right-0 h-36 w-36 rounded-full bg-white blur-3xl" />
                                        <div className="absolute bottom-0 left-10 h-24 w-24 rounded-full bg-cyan-200 blur-2xl" />
                                    </div>
                                    <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-lg font-bold text-white backdrop-blur-sm ring-1 ring-white/30">
                                                {paciente.nombre?.charAt(0)}{paciente.apellido?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-100/80">Ficha de paciente</p>
                                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">{paciente.nombre} {paciente.apellido}</h2>
                                                <p className="mt-2 text-sm text-sky-50/90">RUT <span className="font-semibold text-white">{paciente.rut || "---"}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/20 backdrop-blur-sm">
                                                {previsionDeterminacion(paciente.prevision_id)}
                                            </span>
                                            <span className="inline-flex items-center rounded-full bg-sky-950/20 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/10 backdrop-blur-sm">
                                                ID #{paciente.id_paciente}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 p-4 sm:p-6">
                                    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-4 py-3">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Nacimiento</p>
                                            <p className="mt-2 text-sm font-semibold text-slate-800">{formatearFecha(paciente.nacimiento) ?? "---"}</p>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-4 py-3">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Sexo</p>
                                            <p className="mt-2 text-sm font-semibold text-slate-800 break-words whitespace-pre-wrap">{paciente.sexo ?? "---"}</p>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-4 py-3">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Teléfono</p>
                                            <p className="mt-2 text-sm font-semibold text-slate-800 break-words whitespace-pre-wrap">{paciente.telefono ?? "---"}</p>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-4 py-3">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">País</p>
                                            <p className="mt-2 text-sm font-semibold text-slate-800 break-words whitespace-pre-wrap">{paciente.pais ?? "---"}</p>
                                        </div>
                                    </section>

                                    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                                        <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50/70 p-5">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="h-9 w-1 rounded-full bg-gradient-to-b from-sky-500 to-cyan-400" />
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Contacto</p>
                                                    <h3 className="text-lg font-semibold text-slate-900">Información principal</h3>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Correo</p>
                                                    <p className="mt-2 text-sm font-medium text-slate-800 break-words whitespace-pre-wrap">{paciente.correo || "---"}</p>
                                                </div>
                                                <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Dirección</p>
                                                    <p className="mt-2 text-sm font-medium text-slate-800 break-words whitespace-pre-wrap">{paciente.direccion || "---"}</p>
                                                </div>
                                                <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm md:col-span-2">
                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Observación</p>
                                                    <p className="mt-2 text-sm font-medium leading-6 text-slate-800 break-words whitespace-pre-wrap">{paciente.observacion1 || "---"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                                            <div className="mb-4">
                                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Referencia</p>
                                                <h3 className="text-lg font-semibold text-slate-900">Apoderado</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm">
                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Nombre</p>
                                                    <p className="mt-2 text-sm font-medium text-slate-800 break-words whitespace-pre-wrap">{paciente.apoderado || "---"}</p>
                                                </div>
                                                <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm">
                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">RUT Apoderado</p>
                                                    <p className="mt-2 text-sm font-medium text-slate-800 break-words whitespace-pre-wrap">{paciente.apoderado_rut || "---"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Antecedentes</p>
                                            <h3 className="mt-1 text-lg font-semibold text-slate-900">Medicamentos usados</h3>
                                            <p className="mt-3 text-sm leading-6 text-slate-700 break-words whitespace-pre-wrap">{paciente.medicamentosUsados || "---"}</p>
                                        </div>
                                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Rutina</p>
                                            <h3 className="mt-1 text-lg font-semibold text-slate-900">Hábitos</h3>
                                            <p className="mt-3 text-sm leading-6 text-slate-700 break-words whitespace-pre-wrap">{paciente.habitos || "---"}</p>
                                        </div>
                                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Notas</p>
                                            <h3 className="mt-1 text-lg font-semibold text-slate-900">Comentarios adicionales</h3>
                                            <p className="mt-3 text-sm leading-6 text-slate-700 break-words whitespace-pre-wrap">{paciente.comentariosAdicionales || "---"}</p>
                                        </div>
                                    </section>
                                </div>
                            </article>
                        ))
                    )}
                </div>


            </div>

            {/* FORMULARIO DE ACTUALIZACION */}
            {mostrarFormulario ? (
                <div ref={formularioRef} className="mt-6 max-w-5xl mx-auto overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_20px_60px_-30px_rgba(14,116,144,0.28)] ring-1 ring-sky-100/60">
                    <div className="border-b border-sky-100 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-5 py-4 sm:px-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-600">Edición</p>
                                <h2 className="mt-1 text-lg font-semibold text-slate-900">Actualizar Datos del Paciente</h2>
                                <p className="mt-1 text-sm text-slate-500">Ajusta los datos demográficos y clínicos del paciente.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMostrarFormulario(false)}
                                className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                                Cerrar
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-5 sm:p-6">
                        <section>
                            <div className="mb-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Identidad</p>
                                <h3 className="text-base font-semibold text-slate-900">Datos básicos</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                        <div className="">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Nombre</label>
                            <div className="mt-1">
                                <ShadcnInput
                                    value={nombre}
                                    placeholder={"Ej: Jose Nicolas "}
                                    onChange={(e) => setNombre(e.target.value)} className="bg-slate-50/70 border-slate-200 focus:border-sky-400 focus:ring-sky-200" />
                            </div>
                        </div>


                        <div className="">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Apellido</label>
                            <div className="mt-1">
                                <ShadcnInput
                                    value={apellido}
                                    placeholder={"Ej: Gonzalez Garrido "}
                                    onChange={(e) => setApellido(e.target.value)} className="bg-slate-50/70 border-slate-200 focus:border-sky-400 focus:ring-sky-200" />
                            </div>
                        </div>

                        <div className="">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Número Identificación (RUT)</label>
                            <div className="mt-1">
                                <ShadcnInput
                                    value={rut}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                                        setRut(value);
                                    }}
                                    placeholder="12345678K (Sin puntos ni guion)"
                                    className="w-full"
                                />
                            </div>
                        </div>


                        <div className="">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Sexo</label>
                            <div className="mt-1">
                                <ShadcnInput
                                    value={sexo}
                                    placeholder={"Ej: Femenino"}
                                    onChange={(e) => setSexo(e.target.value)} className="bg-slate-50/70 border-slate-200 focus:border-sky-400 focus:ring-sky-200" />
                            </div>
                        </div>


                        <div className="">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Seleccione Previsión</label>
                            <div className="mt-1 [&_button]:w-full [&_button]:justify-between [&_button]:rounded-md [&_button]:border-slate-200 [&_button]:bg-slate-50/70 [&_button]:text-sm [&_button]:text-slate-700 [&_button]:shadow-none">
                                <ShadcnSelect nombreDefault={"Seleccione Previsión"}
                                              value1={"FONASA"}
                                              value2={"ISAPRE"}
                                              value3={"CONVENIO"}
                                              value4={"SIN PREVISION"}
                                              onChange={(value) => setPrevision(value)}/>
                            </div>
                        </div>


                        <div className="">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Teléfono</label>
                            <div className="mt-1">
                                <ShadcnInput
                                    value={telefono}
                                    placeholder={"Ej: +569 99764369"}
                                    onChange={(e) => setTelefono(e.target.value)} className="bg-slate-50/70 border-slate-200 focus:border-sky-400 focus:ring-sky-200" />
                            </div>
                        </div>




                        <div className="">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Correo</label>
                            <div className="mt-1">
                                <ShadcnInput
                                    value={correo}
                                    placeholder={"CorreoDelPaciente@gmail.com"}
                                    onChange={(e) => setCorreo(e.target.value)} className="bg-slate-50/70 border-slate-200 focus:border-sky-400 focus:ring-sky-200" />
                            </div>
                        </div>



                        <div className="">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Dirección</label>
                            <div className="mt-1">
                                <ShadcnInput
                                    placeholder={"Avenida España 123 / Concepcion"}
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)} className="bg-slate-50/70 border-slate-200 focus:border-sky-400 focus:ring-sky-200" />
                            </div>
                        </div>

                        <div className="">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">País del Paciente</label>
                            <div className="mt-1">
                                <ShadcnInput
                                    placeholder={"Colombia"}
                                    value={pais}
                                    onChange={(e) => setPais(e.target.value)} className="bg-slate-50/70 border-slate-200 focus:border-sky-400 focus:ring-sky-200" />
                            </div>
                        </div>


                        <div className="sm:col-span-2 xl:col-span-3">
                            <div className="mt-1">
                                <ShadcnDatePicker
                                    label="Fecha de nacimiento"
                                    value={nacimiento}
                                    onChange={(fecha) => setNacimiento(fecha)}
                                />
                            </div>
                        </div>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                                <div className="mb-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Referencia</p>
                                    <h3 className="text-base font-semibold text-slate-900">Apoderado</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Apoderado</label>
                                        <div className="mt-1">
                                            <ShadcnInput
                                                value={apoderado}
                                                placeholder={"Nombre completo del apoderado"}
                                                onChange={(e) => setApoderado(e.target.value)} className="bg-white border-slate-200 focus:border-sky-400 focus:ring-sky-200" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">RUT Apoderado</label>
                                        <div className="mt-1">
                                            <ShadcnInput
                                                value={apoderadoRut}
                                                placeholder={"11222333K"}
                                                onChange={(e) => setApoderadoRut(e.target.value)} className="bg-white border-slate-200 focus:border-sky-400 focus:ring-sky-200" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50/60 p-5">
                                <div className="mb-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Resumen clínico</p>
                                    <h3 className="text-base font-semibold text-slate-900">Observaciones y antecedentes</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Observación 1</label>
                                        <div className="mt-1">
                                            <Textarea value={observacion1} onChange={(e) => setObservacion1(e.target.value)} className="min-h-[110px] resize-y bg-white/90 border-slate-200 focus:border-sky-400 focus:ring-sky-200" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Medicamentos Usados</label>
                                        <div className="mt-1">
                                            <Textarea value={medicamentosUsados} onChange={(e) => setMedicamentosUsados(e.target.value)} className="min-h-[110px] resize-y bg-white/90 border-slate-200 focus:border-sky-400 focus:ring-sky-200" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Hábitos</label>
                                        <div className="mt-1">
                                            <Textarea value={habitos} onChange={(e) => setHabitos(e.target.value)} className="min-h-[110px] resize-y bg-white/90 border-slate-200 focus:border-sky-400 focus:ring-sky-200" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Comentarios Adicionales</label>
                                        <div className="mt-1">
                                            <Textarea value={comentariosAdicionales} onChange={(e) => setComentariosAdicionales(e.target.value)} className="min-h-[130px] resize-y bg-white/90 border-slate-200 focus:border-sky-400 focus:ring-sky-200" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-center pt-2 sm:justify-end">

                            <button
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-sky-700 to-blue-600 text-white font-semibold shadow-md hover:from-sky-800 hover:to-blue-700 transition focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
                                type={"button"}
                                onClick={()=> actualizarDatosPacientes(nombre,apellido,rut,nacimiento,sexo, prevision,telefono,correo,direccion,pais,observacion1,apoderado,apoderadoRut,medicamentosUsados,habitos,comentariosAdicionales,id_paciente )}
                            >Actualizar</button>

                        </div>
                    </div>
                </div>
            ) : null}


        </div>
    )
}
