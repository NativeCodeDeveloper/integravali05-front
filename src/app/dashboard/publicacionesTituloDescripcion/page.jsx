'use client'
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ButtonDinamic } from "@/Componentes/ButtonDinamic";
import { subirImagenCloudflare } from "@/FuncionesTranversales/FuncionesCloudflare";
import ToasterClient from "@/Componentes/ToasterClient";

export default function PublicacionesTituloDescripcion() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const CARD = "card";
    const CLOUDFLARE_ACCOUNT_HASH = "aCBUhLfqUcxA2yhIBn1fNQ";

    const [dataPublicaciones, setDataPublicaciones] = useState([]);
    const [dataPublicacionesEspecifica, setDataPublicacionesEspecifica] = useState([]);

    // PARTE 1: Estados del formulario y de la imagen
    const [publicacionesTitulo, setPublicacionesTitulo] = useState("");
    const [publicacionesDescripcion, setPublicacionesDescripcion] = useState("");
    const [imagenArchivo, setImagenArchivo] = useState(null);
    const [vistaPreviaLocal, setVistaPreviaLocal] = useState(null);
    const [imageIdSubida, setImageIdSubida] = useState("");
    const [cargandoGuardado, setCargandoGuardado] = useState(false);
    const [publicacionEditando, setPublicacionEditando] = useState(null);
    const formularioRef = useRef(null);

    async function seleccionarPublicacionesTituloDetalle() {
        try {
            const res = await fetch(`${API}/publicacionesTituloDetalle/seleccionarPublicacionesTituloDetalle`, {
                method: "GET",
                headers: { Accept: "application/json" },
                mode: "cors",
            });

            if (!res.ok) {
                return toast.error("No fue posible cargar las publicaciones contacte al administrador del sistema.");
            }

            const respuestaBackend = await res.json();
            setDataPublicaciones(Array.isArray(respuestaBackend) ? respuestaBackend : []);
        } catch (err) {
            return toast.error("No fue posible cargar las publicaciones contacte al administrador del sistema.");
        }
    }

    useEffect(() => {
        seleccionarPublicacionesTituloDetalle();
    }, []);

    useEffect(() => {
        return () => {
            if (vistaPreviaLocal) {
                URL.revokeObjectURL(vistaPreviaLocal);
            }
        };
    }, [vistaPreviaLocal]);

    async function seleccionarPublicacionesTituloDetallePorID(id_publicacionesTituloDescripcion) {
        try {
            const res = await fetch(`${API}/publicacionesTituloDetalle/seleccionarEspecificoPublicacionesTituloDetalle`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({ id_publicacionesTituloDescripcion }),
            });

            if (!res.ok) {
                return toast.error("No fue posible cargar las publicaciones contacte al administrador del sistema.");
            }

            const respuestaBackend = await res.json();
            setDataPublicacionesEspecifica(Array.isArray(respuestaBackend) ? respuestaBackend : []);
        } catch (err) {
            return toast.error("No fue posible cargar las publicaciones contacte al administrador del sistema.");
        }
    }

    // PARTE 2: Capturar imagen local y mostrar vista previa
    function capturarImagen(event) {
        const file = event.target.files?.[0] ?? null;

        if (vistaPreviaLocal) {
            URL.revokeObjectURL(vistaPreviaLocal);
        }

        setImagenArchivo(file);
        setImageIdSubida("");

        if (file) {
            setVistaPreviaLocal(URL.createObjectURL(file));
        } else {
            setVistaPreviaLocal(null);
        }
    }

    async function insertarPublicacionesTituloDetalle(imagenId) {
        try {
            const res = await fetch(`${API}/publicacionesTituloDetalle/insertarPublicacionesTituloDetalle`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({
                    publicacionesTitulo,
                    publicacionesDescripcion,
                    publicacionesTituloDescripcionImagen: imagenId,
                }),
            });

            if (!res.ok) {
                throw new Error("No se pudo guardar la publicación.");
            }

            const respuestaBackend = await res.json();
            if (respuestaBackend?.message !== true) {
                throw new Error("El servidor no confirmó el guardado.");
            }

        }catch (e) {
            return toast.error("No fue posible cargar la publicacion");
        }
    }

    // PARTE 3: Flujo completo -> subir a Cloudflare y luego guardar en BD
    async function guardarPublicacionConImagen() {
        if (!publicacionesTitulo || !publicacionesDescripcion || !imagenArchivo) {
            return toast.error("Debes completar titulo, descripcion e imagen.");
        }

        try {
            setCargandoGuardado(true);

            // Funcion externa reutilizable: recibe file y devuelve imageId
            const imagenId = await subirImagenCloudflare(imagenArchivo);
            if (!imagenId) {
                throw new Error("No fue posible obtener imageId desde Cloudflare.");
            }

            setImageIdSubida(imagenId);
            await insertarPublicacionesTituloDetalle(imagenId);
            await seleccionarPublicacionesTituloDetalle();
            toast.success("Publicación guardada correctamente.");
        } catch (error) {
            toast.error(error?.message || "No fue posible guardar la publicación.");
        } finally {
            setCargandoGuardado(false);
        }
    }

    function limpiarFormulario() {
        setPublicacionesTitulo("");
        setPublicacionesDescripcion("");
        setImagenArchivo(null);
        setImageIdSubida("");
        setPublicacionEditando(null);

        if (vistaPreviaLocal) {
            URL.revokeObjectURL(vistaPreviaLocal);
        }
        setVistaPreviaLocal(null);
    }

    function cargarParaEditar(publicacion) {
        setPublicacionEditando(publicacion);
        setPublicacionesTitulo(publicacion.publicacionesTitulo);
        setPublicacionesDescripcion(publicacion.publicacionesDescripcion);
        setImagenArchivo(null);
        setImageIdSubida("");

        if (vistaPreviaLocal) {
            URL.revokeObjectURL(vistaPreviaLocal);
        }
        setVistaPreviaLocal(null);

        formularioRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    async function actualizarPublicacion() {
        if (!publicacionesTitulo || !publicacionesDescripcion) {
            return toast.error("Debes completar titulo y descripcion.");
        }

        try {
            setCargandoGuardado(true);

            let imagenFinal = publicacionEditando.publicacionesTituloDescripcionImagen;

            if (imagenArchivo) {
                const nuevaImagenId = await subirImagenCloudflare(imagenArchivo);
                if (!nuevaImagenId) {
                    throw new Error("No fue posible obtener imageId desde Cloudflare.");
                }
                imagenFinal = nuevaImagenId;
            }

            const res = await fetch(`${API}/publicacionesTituloDetalle/actualizarPublicacionesTituloDetalle`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({
                    publicacionesTitulo,
                    publicacionesDescripcion,
                    publicacionesTituloDescripcionImagen: imagenFinal,
                    id_publicacionesTituloDescripcion: publicacionEditando.id_publicacionesTituloDescripcion,
                }),
            });

            if (!res.ok) {
                throw new Error("No se pudo actualizar la publicacion.");
            }

            const respuestaBackend = await res.json();
            if (respuestaBackend?.message !== true) {
                throw new Error("El servidor no confirmo la actualizacion.");
            }

            await seleccionarPublicacionesTituloDetalle();
            limpiarFormulario();
            setDataPublicacionesEspecifica([]);
            toast.success("Publicacion actualizada correctamente.");
        } catch (error) {
            toast.error(error?.message || "No fue posible actualizar la publicacion.");
        } finally {
            setCargandoGuardado(false);
        }
    }



    async function eliminarPublicacion(id_publicacionesTituloDescripcion) {
        try {
            const res = await fetch(`${API}/publicacionesTituloDetalle/eliminarPublicacionesTituloDetalle`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({ id_publicacionesTituloDescripcion }),
            });

            if (!res.ok) {
                return toast.error("No fue posible eliminar la publicacion contacte al administrador del sistema.");
            }

            const respuestaBackend = await res.json();
            if (respuestaBackend.message === true) {
                setDataPublicacionesEspecifica([]);
                await seleccionarPublicacionesTituloDetalle();
                return toast.success('Publicacion eliminada correctamente.');
            }else{
                return toast.error('No ha sido posible eliminar la publicacion intente mas tarde');
            }

        } catch (err) {
            return toast.error("No fue posible cargar las publicaciones contacte al administrador del sistema.");
        }
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_32%),radial-gradient(circle_at_right,_rgba(6,182,212,0.12),_transparent_28%),linear-gradient(180deg,_#f1f5f9_0%,_#f8fafc_55%,_#f1f5f9_100%)] px-4 py-6 sm:px-6 lg:px-10 space-y-8">
            <ToasterClient/>
            {/* Header */}
            <div className="rounded-[28px] border border-slate-300/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700">Gestión de contenido</p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Publicaciones Tratamientos</h1>
                <p className="text-sm text-slate-500">Crea y administra las publicaciones de tratamientos clínicos.</p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Formulario de creación / edición */}
            <div ref={formularioRef} className="rounded-[24px] border border-slate-300 bg-white p-4 sm:p-6 md:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.12)] space-y-6 max-w-3xl">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
                        {publicacionEditando ? "Editar publicacion" : "Nueva publicación"}
                    </h2>
                    <p className="text-xs text-slate-400">
                        {publicacionEditando
                            ? "Modifica los campos y guarda los cambios."
                            : "Completa los campos para crear una nueva publicación con imagen."}
                    </p>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Título</label>
                        <input
                            value={publicacionesTitulo}
                            onChange={(e) => setPublicacionesTitulo(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                            placeholder="Título de la publicación"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descripción</label>
                        <textarea
                            value={publicacionesDescripcion}
                            onChange={(e) => setPublicacionesDescripcion(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 resize-none"
                            placeholder="Descripción de la publicación"
                            rows={4}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Imagen</label>
                        <div className="flex items-center gap-3">
                            <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 max-w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="truncate">{imagenArchivo ? imagenArchivo.name : "Seleccionar imagen"}</span>
                                <input type="file" accept="image/*" onChange={capturarImagen} className="hidden" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Vista previa local */}
                {vistaPreviaLocal && (
                    <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vista previa local</p>
                        </div>
                        <img
                            src={vistaPreviaLocal}
                            alt="Vista previa local"
                            className="h-36 sm:h-48 w-full max-w-md rounded-xl object-cover border border-slate-200 shadow-sm"
                        />
                    </div>
                )}

                {/* Imagen subida a Cloudflare */}
                {imageIdSubida && (
                    <div className="space-y-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Imagen subida correctamente</p>
                        </div>
                        <img
                            src={`https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${imageIdSubida}/${CARD}`}
                            alt="Imagen cargada en Cloudflare"
                            className="h-36 sm:h-48 w-full max-w-md rounded-xl object-cover border border-slate-200 shadow-sm"
                        />
                    </div>
                )}

                <div className="h-px bg-slate-100" />

                <div className="flex flex-wrap items-center gap-3 pt-1">
                    <ButtonDinamic className="rounded-xl bg-gradient-to-r from-indigo-700 to-teal-600 shadow-md shadow-indigo-500/20 hover:from-indigo-800 hover:to-teal-700" onClick={publicacionEditando ? actualizarPublicacion : guardarPublicacionConImagen}>
                        {cargandoGuardado
                            ? (publicacionEditando ? "Actualizando..." : "Guardando...")
                            : (publicacionEditando ? "Actualizar publicacion" : "Guardar publicación")}
                    </ButtonDinamic>
                    {publicacionEditando && (
                        <ButtonDinamic className="rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100" onClick={limpiarFormulario}>Cancelar</ButtonDinamic>
                    )}
                    <ButtonDinamic className="rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100" onClick={limpiarFormulario}>Limpiar</ButtonDinamic>
                </div>
            </div>

            {/* Detalle de publicación seleccionada */}
            {dataPublicacionesEspecifica.length > 0 && (
                <div className="space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700">Detalle de publicación</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {dataPublicacionesEspecifica.map((publicacion) => {
                            return (
                                <div key={publicacion.id_publicacionesTituloDescripcion} className="rounded-2xl border border-slate-300 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.10)] overflow-hidden transition hover:border-indigo-200 hover:shadow-md">
                                    <img
                                        src={`https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${publicacion.publicacionesTituloDescripcionImagen}/${CARD}`}
                                        alt={publicacion.publicacionesTitulo}
                                        className="h-40 sm:h-48 w-full object-cover"
                                    />
                                    <div className="p-4 sm:p-5 space-y-3">
                                        <h3 className="text-base font-semibold text-slate-800 tracking-tight break-words">{publicacion.publicacionesTitulo}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed break-words">{publicacion.publicacionesDescripcion}</p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                onClick={() => cargarParaEditar(publicacion)}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 hover:border-indigo-300 hover:text-indigo-800"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => eliminarPublicacion(publicacion.id_publicacionesTituloDescripcion)}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 hover:border-red-300 hover:text-red-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Listado de publicaciones */}
            <div className="rounded-[24px] border border-slate-300 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)] overflow-hidden">
                <div className="px-4 sm:px-6 py-5 border-b border-slate-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(241,245,249,0.8)_100%)]">
                    <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Publicaciones existentes</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Selecciona una publicación para ver su detalle.</p>
                </div>

                {/* Vista mobile: cards */}
                <div className="block md:hidden divide-y divide-slate-100">
                    {dataPublicaciones.map((item) => (
                        <div key={item.id_publicacionesTituloDescripcion} className="flex items-start gap-3 p-4">
                            <img
                                src={`https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${item.publicacionesTituloDescripcionImagen}/${CARD}`}
                                alt={item.publicacionesTituloDescripcionImagen}
                                className="h-16 w-16 shrink-0 rounded-lg object-cover border border-slate-200 shadow-sm"
                            />
                            <div className="min-w-0 flex-1 space-y-1.5">
                                <p className="text-sm font-medium text-slate-700 break-words">{item.publicacionesTitulo}</p>
                                <p className="text-xs text-slate-500 line-clamp-2 break-words">{item.publicacionesDescripcion}</p>
                                <ButtonDinamic className="rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100" onClick={() => seleccionarPublicacionesTituloDetallePorID(item.id_publicacionesTituloDescripcion)}>
                                    Seleccionar
                                </ButtonDinamic>
                            </div>
                        </div>
                    ))}
                    {dataPublicaciones.length === 0 && (
                        <p className="py-6 text-center text-xs text-slate-400">No hay publicaciones registradas.</p>
                    )}
                </div>

                {/* Vista desktop: tabla */}
                <div className="hidden md:block">
                    <Table>
                        <TableCaption className="py-4 text-xs text-slate-400">Lista de publicaciones de tratamientos</TableCaption>
                        <TableHeader>
                            <TableRow className="bg-gradient-to-r from-indigo-700 to-teal-600 hover:from-indigo-700 hover:to-teal-600">
                                <TableHead className="text-xs font-semibold uppercase tracking-wide text-white">Imagen</TableHead>
                                <TableHead className="text-xs font-semibold uppercase tracking-wide text-white">Título</TableHead>
                                <TableHead className="text-xs font-semibold uppercase tracking-wide text-white">Descripción</TableHead>
                                <TableHead className="text-xs font-semibold uppercase tracking-wide text-white">Acción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataPublicaciones.map((item) => (
                                <TableRow key={item.id_publicacionesTituloDescripcion} className="hover:bg-indigo-50/60 transition-colors">
                                    <TableCell className="py-3">
                                        <img
                                            src={`https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${item.publicacionesTituloDescripcionImagen}/${CARD}`}
                                            alt={item.publicacionesTituloDescripcionImagen}
                                            width={100}
                                            height={100}
                                            className="h-16 w-20 rounded-lg object-cover border border-slate-200 shadow-sm"
                                        />
                                    </TableCell>
                                    <TableCell className="text-sm font-medium text-slate-700">{item.publicacionesTitulo}</TableCell>
                                    <TableCell className="text-sm text-slate-500 max-w-xs truncate">{item.publicacionesDescripcion}</TableCell>
                                    <TableCell>
                                        <ButtonDinamic className="rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100" onClick={() => seleccionarPublicacionesTituloDetallePorID(item.id_publicacionesTituloDescripcion)}>
                                            Seleccionar
                                        </ButtonDinamic>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
