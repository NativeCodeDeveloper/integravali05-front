"use client"

import {useEffect, useState} from "react"
import {useParams, useRouter} from "next/navigation"
import {toast} from "react-hot-toast"
import ToasterClient from "@/Componentes/ToasterClient"

export default function FichasClinicasCategorias() {

    const API = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const {id_plantilla} = useParams()

    // =============================================
    // ESTADOS
    // =============================================
    const [categorias, setCategorias] = useState([])
    const [nombrePlantilla, setNombrePlantilla] = useState("")
    const [mostrarInfo, setMostrarInfo] = useState(false)

    // Modal nueva categoría
    const [modalCategoria, setModalCategoria] = useState(false)
    const [nuevaCategoriaNombre, setNuevaCategoriaNombre] = useState("")
    const [nuevaCategoriaOrden, setNuevaCategoriaOrden] = useState("")

    // Modal editar categoría
    const [modalEditarCategoria, setModalEditarCategoria] = useState(false)
    const [categoriaEditando, setCategoriaEditando] = useState(null)
    const [editCategoriaNombre, setEditCategoriaNombre] = useState("")
    const [editCategoriaOrden, setEditCategoriaOrden] = useState("")
    const [id_categoria,setId_categoria] = useState(null);

    // =============================================
    // HANDLERS
    // =============================================
    function abrirModalNuevaCategoria() {
        setNuevaCategoriaNombre("")
        setNuevaCategoriaOrden("")
        setModalCategoria(true)
    }

    function abrirModalEditarCategoria(categoria) {
        setCategoriaEditando(categoria)
        setId_categoria(categoria.id_categoria)
        setEditCategoriaNombre(categoria.nombre)
        setEditCategoriaOrden(categoria.orden)
        setModalEditarCategoria(true)
    }

    async function limpiar_actualizar(){
        setNuevaCategoriaNombre("");
        setNuevaCategoriaOrden("");
        setEditCategoriaNombre("");
        setEditCategoriaOrden("");
        await listarCategorias_especificas_idPlantilla(id_plantilla);

    }

function irACamposFicha(id_cat){
        router.push(`/dashboard/fichaCampo/${id_cat}`);
}
    async function listarCategorias_especificas_idPlantilla(id_plantilla) {
        try {
            if (!id_plantilla) {
                return toast.error(`No se ha cargar categorias de la plantilla especifica porque no se ha seleccionado ninguna plantilla.`);
            }

            const res = await fetch(`${API}/fichaCategoria/listarPorPlantilla`, {
                method: "POST",
                headers: {Accept: "application/json",
                "Content-Type": "application/json"},
                body: JSON.stringify({
                    id_plantilla
                }),
                mode: "cors"
            });

            const respuestaBackedData = await res.json()
            if (Array.isArray(respuestaBackedData)&& respuestaBackedData.length > 0) {
                setCategorias(respuestaBackedData)
            }else{
                setCategorias([]);
            }
        }catch (error) {
            return toast.error(`Ha ocurrido un problema en servidor contacte a soporte : ${ error.message }`);
        }
    }

    useEffect(() => {
        listarCategorias_especificas_idPlantilla(id_plantilla)
    }, [id_plantilla])




   async function insertarNuevaCategoria(
        id_plantilla,
        nombre,
        orden

    ) {
        try {
            if (!id_plantilla || !nombre || !orden) {
                return toast.error(`Debe ingresar todos los datos para una nueva categoria para esta plantilla`);
            }
            const res = await fetch(`${API}/fichaCategoria/insertarCategoria`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    id_plantilla,
                    nombre,
                    orden
                }),
                mode: "cors"
            });

            if (!res.ok) {
                return toast.error(`Ha ocurrido un problema en servidor contacte a soporte. Respuesta inadecuada del servidor.`);
            }

            const respuestaBackedData = await res.json()
            if (respuestaBackedData.message === true) {
                setModalCategoria(false)
                await limpiar_actualizar();
                return toast.success(`Se ha ingresado nueva categoria con exito`);
            }else if (respuestaBackedData.message === false) {
                return toast.error(`No se estan enviando los datos correctos al servidor`);
            }else{
                return toast.error(`Ha ocurrido un problema en servidor contacte a soporte`);
            }
        }catch (error) {
            return toast.error(`Ha ocurrido un problema en servidor contacte a soporte : ${ error.message }`);
        }
    }

    async function editarCategoria_plantilla_especifica(
            id_categoria,
            nombre,
            orden
    ) {
            try {
                if (!id_categoria || !nombre || !orden) {
                    return toast.error(`Debe ingresar todos los datos para una nueva categoria para esta plantilla`);
                }
                const res = await fetch(`${API}/fichaCategoria/actualizarCategoria`, {
                    method: "POST",
                    headers: {Accept: "application/json",
                        "Content-Type": "application/json"},
                    body: JSON.stringify({
                        id_categoria,
                        nombre,
                        orden
                    }),
                    mode: "cors"
                });

                if (!res.ok) {
                    return toast.error(`Ha ocurrido un problema en servidor contacte a soporte. Respuesta inadecuada del servidor.`);
                }

                const respuestaBackedData = await res.json()
                if (respuestaBackedData.message === true) {
                    setModalEditarCategoria(false);
                    await limpiar_actualizar();
                    return toast.success(`Se ha actualizado categoria con exito`);
                }else if (respuestaBackedData.message === false) {
                    return toast.error(`No se estan enviando los datos correctos al servidor`);
                }else{
                    return toast.error(`Ha ocurrido un problema en servidor contacte a soporte`);
                }
            }catch (error) {
                return toast.error(`Ha ocurrido un problema en servidor contacte a soporte : ${ error.message }`);
            }
    }

   async function eliminarCategoriaEspecifica(id_categoria) {
        try {
            if (!id_categoria ) {
                return toast.error(`Debe seleccionar al menos una categoria para poder eliminarla`);
            }
            const res = await fetch(`${API}/fichaCategoria/eliminarCategoria`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    id_categoria
                }),
                mode: "cors"
            });

            if (!res.ok) {
                return toast.error(`Ha ocurrido un problema en servidor contacte a soporte. Respuesta inadecuada del servidor.`);
            }

            const respuestaBackedData = await res.json()
            if (respuestaBackedData.message === true) {
                setModalEditarCategoria(false);
                await limpiar_actualizar();
                return toast.success(`Se ha eliminado la categoria con exito`);
            }else if (respuestaBackedData.message === false) {
                return toast.error(`No se estan enviando los datos correctos al servidor`);
            }else{
                return toast.error(`Ha ocurrido un problema en servidor contacte a soporte`);
            }
        }catch (error) {
            return toast.error(`Ha ocurrido un problema en servidor contacte a soporte : ${ error.message }`);
        }
    }

    function seleccionarCategoria(categoria) {
        // TODO: Navegar a la página de campos de esta categoría
        console.log("Seleccionar categoría:", categoria.id_categoria, categoria.nombre)
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
                        onClick={() => router.push("/dashboard/fichasClinicasPlantillas")}
                        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 mb-5 transition-colors duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                        Volver a Plantillas
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 mb-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-700">Categor&iacute;as</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                                {nombrePlantilla || "Plantilla"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1.5 max-w-lg leading-relaxed">
                                Administra las categor&iacute;as (secciones) de esta plantilla. Cada categor&iacute;a agrupa campos relacionados.
                            </p>
                        </div>

                        <button
                            onClick={abrirModalNuevaCategoria}
                            className="group inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-700 to-teal-600 rounded-xl hover:from-indigo-800 hover:to-teal-700 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 self-start sm:self-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                            </svg>
                            Nueva Categor&iacute;a
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
                        &#191;Qu&eacute; son las categor&iacute;as?
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform duration-200 ${mostrarInfo ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>

                    {mostrarInfo && (
                        <div className="mt-3 bg-white/90 backdrop-blur-sm border border-indigo-200/80 rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.06)] p-5 sm:p-6">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 flex items-start justify-center pt-0.5">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-800 mb-2">&#191;Qu&eacute; es una categor&iacute;a?</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                        Las categor&iacute;as son las <strong className="text-slate-700">secciones</strong> que componen una plantilla de ficha cl&iacute;nica. Funcionan como agrupadores para organizar los campos que el profesional deber&aacute; completar.
                                    </p>

                                    <div className="bg-slate-50 rounded-xl border border-slate-300 p-4 mb-3">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">Ejemplo para una plantilla &quot;Dermatolog&iacute;a&quot;</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-lg bg-indigo-600 text-[11px] font-bold text-white">1</span>
                                                <span className="text-sm text-slate-700 font-medium">Evaluaci&oacute;n</span>
                                                <span className="text-xs text-slate-400">&#8594; Motivo de consulta, Antecedentes...</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-lg bg-indigo-600 text-[11px] font-bold text-white">2</span>
                                                <span className="text-sm text-slate-700 font-medium">Diagn&oacute;stico</span>
                                                <span className="text-xs text-slate-400">&#8594; Impresi&oacute;n diagn&oacute;stica, Indicaciones...</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-lg bg-indigo-600 text-[11px] font-bold text-white">3</span>
                                                <span className="text-sm text-slate-700 font-medium">Tratamiento</span>
                                                <span className="text-xs text-slate-400">&#8594; Medicamentos, Pr&oacute;xima cita...</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        El <strong className="text-slate-500">orden</strong> define en qu&eacute; posici&oacute;n aparecer&aacute; la categor&iacute;a cuando el profesional complete la ficha. Luego, dentro de cada categor&iacute;a podr&aacute;s agregar los campos espec&iacute;ficos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ========== LISTA DE CATEGORÍAS ========== */}
                <div className="space-y-3 sm:space-y-4">

                    {/* Empty state */}
                    {categorias.length === 0 && (
                        <div className="bg-white/80 backdrop-blur-sm border border-slate-300 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] p-10 sm:p-14 text-center">
                            <div className="mx-auto mb-5 flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-100 border border-indigo-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                </svg>
                            </div>
                            <p className="text-slate-600 text-sm font-medium">No hay categor&iacute;as creadas todav&iacute;a</p>
                            <p className="text-slate-400 text-xs mt-1.5">Haz clic en &quot;Nueva Categor&iacute;a&quot; para crear la primera secci&oacute;n de esta plantilla.</p>
                        </div>
                    )}

                    {categorias.map((categoria) => (
                        <div
                            key={categoria.id_categoria}
                            className="bg-white/80 backdrop-blur-sm border border-slate-300 rounded-2xl shadow-[0_4px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.07)] transition-all duration-200 overflow-hidden"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 sm:py-5 gap-4">

                                {/* Info de la categoría */}
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                    <div className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 shadow-sm shadow-indigo-500/20">
                                        <span className="text-sm font-bold text-white">{categoria.orden}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm sm:text-base font-semibold text-slate-800 truncate">{categoria.nombre}</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">Orden: {categoria.orden}</p>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 pl-14 sm:pl-0">
                                    <button
                                        onClick={() => irACamposFicha(categoria.id_categoria)}
                                        className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-3 sm:px-4 text-xs font-semibold text-white bg-gradient-to-r from-indigo-700 to-teal-600 rounded-lg hover:from-indigo-800 hover:to-teal-700 active:scale-[0.97] transition-all duration-150 shadow-sm shadow-indigo-500/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                        <span>Seleccionar</span>
                                    </button>

                                    <button
                                        onClick={() => abrirModalEditarCategoria(categoria)}
                                        className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-300 active:scale-[0.97] transition-all duration-150"
                                        title="Editar categor&iacute;a"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                        <span className="hidden sm:inline">Editar</span>
                                    </button>

                                    <button
                                        onClick={() => eliminarCategoriaEspecifica(categoria.id_categoria)}
                                        className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 text-xs font-medium text-red-500 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 active:scale-[0.97] transition-all duration-150"
                                        title="Eliminar categor&iacute;a"
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

            {/* ========== MODAL: NUEVA CATEGORÍA ========== */}
            {modalCategoria && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalCategoria(false)}/>
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
                                    <h3 className="text-lg font-semibold text-white">Nueva Categor&iacute;a</h3>
                                </div>
                                <p className="text-sm text-white/70">Agrega una secci&oacute;n a la plantilla</p>
                            </div>
                        </div>
                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Nombre de la categor&iacute;a</label>
                                <input
                                    type="text"
                                    value={nuevaCategoriaNombre}
                                    onChange={(e) => setNuevaCategoriaNombre(e.target.value)}
                                    placeholder="Ej: Evaluaci&oacute;n, Diagn&oacute;stico, Anamnesis..."
                                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-400"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Orden</label>
                                <input
                                    type="number"
                                    value={nuevaCategoriaOrden}
                                    onChange={(e) => setNuevaCategoriaOrden(e.target.value)}
                                    placeholder="Ej: 1, 2, 3..."
                                    min="1"
                                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-200 bg-slate-100/50">
                            <button
                                onClick={() => setModalCategoria(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all duration-150"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={()=> insertarNuevaCategoria(id_plantilla,nuevaCategoriaNombre, nuevaCategoriaOrden)}
                                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-700 to-teal-600 rounded-xl hover:from-indigo-800 hover:to-teal-700 active:scale-[0.97] transition-all duration-150 shadow-sm shadow-indigo-500/25"
                            >
                                Crear Categor&iacute;a
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== MODAL: EDITAR CATEGORÍA ========== */}
            {modalEditarCategoria && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalEditarCategoria(false)}/>
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
                                    <h3 className="text-lg font-semibold text-white">Editar Categor&iacute;a</h3>
                                </div>
                                <p className="text-sm text-white/70">Modifica el nombre u orden de la categor&iacute;a</p>
                            </div>
                        </div>
                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Nombre de la categor&iacute;a</label>
                                <input
                                    type="text"
                                    value={editCategoriaNombre}
                                    onChange={(e) => setEditCategoriaNombre(e.target.value)}
                                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-400"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Orden</label>
                                <input
                                    type="number"
                                    value={editCategoriaOrden}
                                    onChange={(e) => setEditCategoriaOrden(e.target.value)}
                                    min="1"
                                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-200 bg-slate-100/50">
                            <button
                                onClick={() => setModalEditarCategoria(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all duration-150"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={()=> editarCategoria_plantilla_especifica(id_categoria, editCategoriaNombre,editCategoriaOrden)}
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
