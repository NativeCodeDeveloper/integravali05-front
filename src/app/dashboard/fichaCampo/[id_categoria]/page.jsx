"use client"

import {useEffect, useState} from "react"
import {useParams, useRouter} from "next/navigation"
import {toast} from "react-hot-toast"
import ToasterClient from "@/Componentes/ToasterClient"

export default function FichaCampo() {

    const API = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const {id_categoria} = useParams()

    // =============================================
    // ESTADOS
    // =============================================
    const [campos, setCampos] = useState([])
    const [nombreCategoria, setNombreCategoria] = useState("")
    const [mostrarInfo, setMostrarInfo] = useState(false)

    // Modal nuevo campo
    const [modalCampo, setModalCampo] = useState(false)
    const [nuevoCampoNombre, setNuevoCampoNombre] = useState("")
    const [nuevoCampoOrden, setNuevoCampoOrden] = useState("")
    const [nuevoCampoRequerido, setNuevoCampoRequerido] = useState(false)

    // Modal editar campo
    const [modalEditarCampo, setModalEditarCampo] = useState(false)
    const [campoEditando, setCampoEditando] = useState(null)
    const [editCampoNombre, setEditCampoNombre] = useState("")
    const [editCampoOrden, setEditCampoOrden] = useState("")
    const [editCampoRequerido, setEditCampoRequerido] = useState(false)
    const[id_campo, setId_campo] = useState(null)

    // =============================================
    // HANDLERS
    // =============================================
    function abrirModalNuevoCampo() {
        setNuevoCampoNombre("")
        setNuevoCampoOrden("")
        setNuevoCampoRequerido(false)
        setModalCampo(true)
    }

    function abrirModalEditarCampo(campo) {
        setCampoEditando(campo)
        setEditCampoNombre(campo.nombre)
        setEditCampoOrden(campo.orden)
        setId_campo(campo.id_campo)
        setEditCampoRequerido(campo.requerido === 1)
        setModalEditarCampo(true)
    }

    async function limpiar(){
        setCampoEditando(null)
        setEditCampoNombre("")
        setEditCampoOrden(null)
        setId_campo(null)
        setModalEditarCampo(false)


        setNuevoCampoNombre("")
        setNuevoCampoOrden("")
        setNuevoCampoRequerido(false)
        setModalCampo(false)
      await listarCampos_categoria_especificos(id_categoria)
        return;
    }

    async function insertarCampo(id_categoria,nombre,requeridoBoOlean,orden) {
        try {
       if(!id_categoria || !nombre  || !orden) return toast.error(`Debe ingresar toda la informacion para poder insertar un nuevo campo`);
       let requerido = 0;

       if(requeridoBoOlean === true){
           requerido = 1;
       }

       if(requeridoBoOlean === false){
           requerido = "0";
       }

       const res = await fetch(`${API}/fichaCampo/insertarCampo`, {
           method: "POST",
           headers: {
               Accept: "application/json",
               "Content-Type" : "application/json"
           },
           body: JSON.stringify({
               id_categoria,
               nombre,
               requerido,
               orden
           })
       });

       if (!res.ok) {
           return toast.error(`Ha ocurrido un error en el servidor. Respuesta inadecuada del servidor.`);
       }

       const respuestaBackend = await res.json();

       if (respuestaBackend.message === true) {
           await limpiar();
           return toast.success(`Campo ingresado correctamente`);
       }else if (respuestaBackend.message === false) {
           return toast.error(`No se han enviado los datos en el orden correcto. Contacte a soporte`);
       }else{
           return toast.error(`Ha ocurrido un error en el servidor.`);
       }
        }catch(error) {
       console.log(error);
       return toast.error(`Ha ocurrido un error en el servidor.`);
   }
    }

    async function listarCampos_categoria_especificos(id_categoria){
        try {
            if(!id_categoria){
                return toast.error(`No se ha seleccionado ninguna categoria. Vuelva al inicio de la configuracion.`);
            }

            const res = await fetch(`${API}/fichaCampo/listarPorCategoria`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    id_categoria
                })
            });

            const respuestaBackend_data = await res.json();
            if (Array.isArray(respuestaBackend_data)&&respuestaBackend_data.length > 0) {
                setCampos(respuestaBackend_data)
            }else{
                setCampos([])
            }
        }catch(error) {
            console.log(error);
            return toast.error(`Ha ocurrido un error en el servidor.`);
        }
    }


    async function obtenerNombreCategoria(id_categoria){
        try {
            const res = await fetch(`${API}/fichaCategoria/obtenerPorId`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({ id_categoria })
            });
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setNombreCategoria(data[0].nombre)
            }
        }catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listarCampos_categoria_especificos(id_categoria)
        obtenerNombreCategoria(id_categoria)
    },[id_categoria])


    async function eliminarCampo(id_campo) {
        try {
            if(!id_campo){
                return toast.error(`Debe seleccionar un campo especifico parta que ese sea eliminado`);
            }

            const res = await fetch(`${API}/fichaCampo/eliminarCampo`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    id_campo
                })
            });

            const respuestaBackend = await res.json();

            if (respuestaBackend.message === true) {
                await limpiar();
                return toast.success(`Campo eliminado correctamente`);
            }else if (respuestaBackend.message === false) {
                return toast.error(`No se han enviado los datos en el orden correcto. Contacte a soporte`);
            }else{
                return toast.error(`Ha ocurrido un error en el servidor.`);
            }
        }catch(error) {
            console.log(error);
            return toast.error(`Ha ocurrido un error en el servidor.`);
        }
    }






    async function editarCampo(id_campo,nombre,requeridoBoOlean,orden) {
        try {
            if(!id_campo || !nombre  || !orden) return toast.error(`Debe ingresar toda la informacion para poder insertar un nuevo campo`);
            let requerido = 0;

            if(requeridoBoOlean === true){
                requerido = 1;
            }

            if(requeridoBoOlean === false){
                requerido = "0";
            }

            const res = await fetch(`${API}/fichaCampo/actualizarCampo`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    id_campo,
                    nombre,
                    requerido,
                    orden
                })
            });

            if (!res.ok) {
                return toast.error(`Ha ocurrido un error en el servidor. Respuesta inadecuada del servidor.`);
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend.message === true) {
                await limpiar();
                return toast.success(`Campo actualizado correctamente`);
            }else if (respuestaBackend.message === false) {
                return toast.error(`No se han enviado los datos en el orden correcto. Contacte a soporte`);
            }else{
                return toast.error(`Ha ocurrido un error en el servidor.`);
            }
        }catch(error) {
            console.log(error);
            return toast.error(`Ha ocurrido un error en el servidor.`);
        }
    }

    // =============================================
    // RENDER
    // =============================================
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_32%),radial-gradient(circle_at_right,_rgba(6,182,212,0.12),_transparent_28%),linear-gradient(180deg,_#f1f5f9_0%,_#f8fafc_55%,_#f1f5f9_100%)] relative overflow-hidden">
            <ToasterClient />

            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-indigo-100/40 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 -left-48 h-80 w-80 rounded-full bg-teal-100/30 blur-3xl" />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                {/* ========== HEADER ========== */}
                <div className="mb-8 sm:mb-10">

                    {/* Botón volver */}
                    <button
                        onClick={() => router.back()}
                        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 mb-5 transition-colors duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                        Volver a Categor&iacute;as
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 mb-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-700">Campos</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                                {nombreCategoria || "Categor\u00eda"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1.5 max-w-lg leading-relaxed">
                                Define los campos que el profesional deber&aacute; completar en esta secci&oacute;n de la ficha cl&iacute;nica.
                            </p>
                        </div>

                        <button
                            onClick={abrirModalNuevoCampo}
                            className="group inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-700 to-teal-600 rounded-xl hover:from-indigo-800 hover:to-teal-700 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 self-start sm:self-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                            </svg>
                            Nuevo Campo
                        </button>
                    </div>
                </div>

                {/* ========== BOTON INFORMATIVO ========== */}
                <div className="mb-6">
                    <button
                        onClick={() => setMostrarInfo(!mostrarInfo)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 active:scale-[0.98] transition-all duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        &#191;Qu&eacute; son los campos?
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform duration-200 ${mostrarInfo ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>

                    {mostrarInfo && (
                        <div className="mt-3 bg-white/90 backdrop-blur-sm border border-indigo-200/80 rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.06)] p-5 sm:p-6">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 flex items-start justify-center pt-0.5">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-800 mb-2">&#191;Qu&eacute; es un campo?</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                        Los campos son los <strong className="text-slate-700">datos espec&iacute;ficos</strong> que el profesional deber&aacute; completar dentro de cada categor&iacute;a al llenar la ficha cl&iacute;nica. Son los cuadros de texto que ver&aacute; el doctor.
                                    </p>

                                    <div className="bg-slate-50 rounded-xl border border-slate-300 p-4 mb-3">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">Ejemplo para la categor&iacute;a &quot;Evaluaci&oacute;n&quot;</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-lg bg-indigo-600 text-[11px] font-bold text-white">1</span>
                                                <span className="text-sm text-slate-700 font-medium">Motivo de consulta</span>
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200/60">Requerido</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-lg bg-indigo-600 text-[11px] font-bold text-white">2</span>
                                                <span className="text-sm text-slate-700 font-medium">Antecedentes</span>
                                                <span className="text-xs text-slate-400">Opcional</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-lg bg-indigo-600 text-[11px] font-bold text-white">3</span>
                                                <span className="text-sm text-slate-700 font-medium">S&iacute;ntomas asociados</span>
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200/60">Requerido</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Marca un campo como <strong className="text-slate-500">obligatorio</strong> si el profesional debe completarlo s&iacute; o s&iacute;. El <strong className="text-slate-500">orden</strong> define la posici&oacute;n en que aparece dentro de la categor&iacute;a.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ========== LISTA DE CAMPOS ========== */}
                <div className="space-y-3 sm:space-y-4">

                    {/* Empty state */}
                    {campos.length === 0 && (
                        <div className="bg-white/80 backdrop-blur-sm border border-slate-300 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] p-10 sm:p-14 text-center">
                            <div className="mx-auto mb-5 flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-100 border border-indigo-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7"/>
                                </svg>
                            </div>
                            <p className="text-slate-600 text-sm font-medium">No hay campos creados todav&iacute;a</p>
                            <p className="text-slate-400 text-xs mt-1.5">Haz clic en &quot;Nuevo Campo&quot; para agregar el primer campo a esta categor&iacute;a.</p>
                        </div>
                    )}

                    {campos.map((campo) => (
                        <div
                            key={campo.id_campo}
                            className="bg-white/80 backdrop-blur-sm border border-slate-300 rounded-2xl shadow-[0_4px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.07)] transition-all duration-200 overflow-hidden"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 sm:py-5 gap-4">

                                {/* Info del campo */}
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                    <div className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 shadow-sm shadow-indigo-500/20">
                                        <span className="text-sm font-bold text-white">{campo.orden}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <h3 className="text-sm sm:text-base font-semibold text-slate-800 truncate">{campo.nombre}</h3>
                                            {campo.requerido === 1 ? (
                                                <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200/60">
                                                    <span className="h-1 w-1 rounded-full bg-amber-400" />
                                                    Requerido
                                                </span>
                                            ) : (
                                                <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-50 text-slate-400 border border-slate-200/60">
                                                    Opcional
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-0.5">Orden: {campo.orden}</p>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 pl-14 sm:pl-0">
                                    <button
                                        onClick={() => abrirModalEditarCampo(campo)}
                                        className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-300 active:scale-[0.97] transition-all duration-150"
                                        title="Editar campo"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                        <span className="hidden sm:inline">Editar</span>
                                    </button>

                                    <button
                                        onClick={() => eliminarCampo(campo.id_campo)}
                                        className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 text-xs font-medium text-red-500 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 active:scale-[0.97] transition-all duration-150"
                                        title="Eliminar campo"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                        <span className="hidden sm:inline">Eliminar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ========== MODAL: NUEVO CAMPO ========== */}
            {modalCampo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalCampo(false)}/>
                    <div className="relative bg-white rounded-2xl shadow-[0_24px_80px_rgba(15,23,42,0.18)] w-full max-w-md overflow-hidden border border-slate-300/50">
                        {/* Header */}
                        <div className="relative px-6 py-5 bg-[linear-gradient(135deg,#0f172a_0%,#312e81_58%,#0891b2_100%)] overflow-hidden">
                            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/10" />
                            <div className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5" />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-white/20 backdrop-blur-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Nuevo Campo</h3>
                                </div>
                                <p className="text-sm text-white/70">Agrega un campo de texto a la categor&iacute;a</p>
                            </div>
                        </div>
                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Nombre del campo</label>
                                <input
                                    type="text"
                                    value={nuevoCampoNombre}
                                    onChange={(e) => setNuevoCampoNombre(e.target.value)}
                                    placeholder="Ej: Motivo de consulta, Antecedentes..."
                                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-400"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Orden</label>
                                <input
                                    type="number"
                                    value={nuevoCampoOrden}
                                    onChange={(e) => setNuevoCampoOrden(e.target.value)}
                                    placeholder="Ej: 1, 2, 3..."
                                    min="1"
                                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-400"
                                />
                            </div>
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Campo obligatorio</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">El profesional deber&aacute; completar este campo</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-3">
                                    <input
                                        type="checkbox"
                                        checked={nuevoCampoRequerido}
                                        onChange={(e) => setNuevoCampoRequerido(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-[22px] bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500/20 rounded-full peer peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:shadow-sm after:transition-all duration-200 peer-checked:bg-indigo-600"/>
                                </label>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-200 bg-slate-100/50">
                            <button
                                onClick={() => setModalCampo(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all duration-150"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => insertarCampo(id_categoria,nuevoCampoNombre,nuevoCampoRequerido,nuevoCampoOrden)}
                                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-700 to-teal-600 rounded-xl hover:from-indigo-800 hover:to-teal-700 active:scale-[0.97] transition-all duration-150 shadow-sm shadow-indigo-500/25"
                            >
                                Crear Campo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== MODAL: EDITAR CAMPO ========== */}
            {modalEditarCampo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalEditarCampo(false)}/>
                    <div className="relative bg-white rounded-2xl shadow-[0_24px_80px_rgba(15,23,42,0.18)] w-full max-w-md overflow-hidden border border-slate-300/50">
                        {/* Header */}
                        <div className="relative px-6 py-5 bg-[linear-gradient(135deg,#0f172a_0%,#312e81_58%,#0891b2_100%)] overflow-hidden">
                            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/10" />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-white/20 backdrop-blur-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Editar Campo</h3>
                                </div>
                                <p className="text-sm text-white/70">Modifica el nombre, orden o si es obligatorio</p>
                            </div>
                        </div>
                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Nombre del campo</label>
                                <input
                                    type="text"
                                    value={editCampoNombre}
                                    onChange={(e) => setEditCampoNombre(e.target.value)}
                                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-400"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Orden</label>
                                <input
                                    type="number"
                                    value={editCampoOrden}
                                    onChange={(e) => setEditCampoOrden(e.target.value)}
                                    min="1"
                                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-400"
                                />
                            </div>
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Campo obligatorio</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">El profesional deber&aacute; completar este campo</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-3">
                                    <input
                                        type="checkbox"
                                        checked={editCampoRequerido}
                                        onChange={(e) => setEditCampoRequerido(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-[22px] bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500/20 rounded-full peer peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:shadow-sm after:transition-all duration-200 peer-checked:bg-indigo-600"/>
                                </label>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-200 bg-slate-100/50">
                            <button
                                onClick={() => setModalEditarCampo(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all duration-150"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={()=>editarCampo(id_campo,editCampoNombre,editCampoRequerido,editCampoOrden)}
                                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-700 to-teal-600 rounded-xl hover:from-indigo-800 hover:to-teal-700 active:scale-[0.97] transition-all duration-150 shadow-sm shadow-indigo-500/25"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
