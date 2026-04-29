"use client"

import React, {useEffect, useState} from "react";
import {toast, Toaster} from "react-hot-toast";
import {InfoButton} from "@/Componentes/InfoButton";

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml"
];
const VARIANT_CARD = "card";
const VARIANT_FULL = "full";

export default function Publicaciones() {
    const [file, setfile] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [newDescripcion, setNewDescripcion] = useState("");
    const [newFile, setNewFile] = useState(null);
    const [newPreview, setNewPreview] = useState(null);
    const [isInserting, setIsInserting] = useState(false);
    const [descripcionPublicaciones, setDescripcionPublicaciones] = useState("");
    const [listaPublicaciones, setListaPublicaciones] = useState([]);
    const [id_publicaciones, setId_publicaciones] = useState("");

    const API = process.env.NEXT_PUBLIC_API_URL;
    const CLOUDFLARE_HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_HASH;
    const selectedPublication = listaPublicaciones.find((publicacion) => String(publicacion.id_publicaciones) === String(id_publicaciones));
    const selectedAllowsMultiple = Number(id_publicaciones) === 10;

    async function downscaleImage(file, maxW = 1600, maxH = 1600, quality = 0.82) {
        const img = document.createElement("img");
        const objectUrl = URL.createObjectURL(file);
        try {
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = objectUrl;
            });
            const {width, height} = img;
            const scale = Math.min(maxW / width, maxH / height, 1);
            const targetW = Math.max(1, Math.round(width * scale));
            const targetH = Math.max(1, Math.round(height * scale));
            const canvas = document.createElement("canvas");
            canvas.width = targetW;
            canvas.height = targetH;
            canvas.getContext("2d").drawImage(img, 0, 0, targetW, targetH);

            return await new Promise((resolve) =>
                canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality)
            );
        } finally {
            URL.revokeObjectURL(objectUrl);
        }
    }

    function validarImagen(file) {
        if (!file) return "Debe seleccionar una imagen.";
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Solo se permiten imagenes JPG, PNG, WEBP, GIF o SVG.";
        return "";
    }

    async function prepararImagen(file) {
        const error = validarImagen(file);
        if (error) throw new Error(error);

        let toUpload = file;
        if (toUpload.size > MAX_UPLOAD_SIZE) {
            const compressed = await downscaleImage(toUpload);
            if (compressed && compressed.size < toUpload.size) {
                toUpload = new File([compressed], `${file.name || "image"}.jpg`, {type: "image/jpeg"});
            }
        }

        if (!ALLOWED_IMAGE_TYPES.includes(toUpload.type)) {
            throw new Error("El archivo comprimido no es un tipo de imagen valido para Cloudflare.");
        }

        if (toUpload.size > MAX_UPLOAD_SIZE) {
            throw new Error("La imagen excede 10 MB incluso tras compresion. Sube una imagen de menor resolucion o peso.");
        }

        return toUpload;
    }

    async function subirImagen(file) {
        const toUpload = await prepararImagen(file);
        const formData = new FormData();
        formData.append("image", toUpload);

        const res = await fetch(`${API}/cloudflare/subirimagenes`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("Error subiendo imagen a Cloudflare:", res.status, errText);
            throw new Error("Error subiendo imagen a Cloudflare.");
        }

        const data = await res.json();
        if (data?.ok === false || !data?.imageId) {
            throw new Error("Cloudflare no devolvio un identificador de imagen.");
        }

        return data.imageId;
    }

    async function actualizarPublicaciones(
        descripcionPublicaciones,
        imagenPublicaciones_primera,
        imagenPublicaciones_segunda,
        imagenPublicaciones_tercera,
        id_publicaciones
    ) {
        if (!descripcionPublicaciones || !id_publicaciones || !imagenPublicaciones_primera) {
            throw new Error("Debe seleccionar una publicacion, escribir una descripcion y subir al menos una imagen.");
        }

        const res = await fetch(`${API}/publicaciones/actualizarPublicacion`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                descripcionPublicaciones,
                imagenPublicaciones_primera,
                imagenPublicaciones_segunda,
                imagenPublicaciones_tercera,
                id_publicaciones
            }),
            mode: "cors",
            cache: "no-cache"
        });

        const resultado = await res.json();
        if (!res.ok) throw new Error("No fue posible actualizar la publicacion seleccionada.");
        if (resultado.message === "sindato") throw new Error("Debe llenar los campos obligatorios.");
        if (resultado.message !== "true") throw new Error("El servidor no confirmo la actualizacion.");
    }

    async function eliminarPublicacion(id_publicaciones) {
        try {
            if (!id_publicaciones) {
                return toast.error("Debe seleccionar una publicacion para eliminar.");
            }

            const res = await fetch(`${API}/publicaciones/eliminarPublicacion`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_publicaciones}),
                mode: "cors",
                cache: "no-cache"
            });

            const resultado = await res.json();
            if (!res.ok) return toast.error("No se ha podido eliminar la publicacion.");
            if (resultado.message === "sindato") return toast.error("Debe seleccionar la publicacion que desea eliminar.");

            if (resultado.message === true) {
                await listarPublicaciones();
                return toast.success("Publicacion eliminada correctamente.");
            }

            return toast.error("No se pudo confirmar la eliminacion.");
        } catch (error) {
            return toast.error(error?.message || "No se ha podido eliminar la publicacion.");
        }
    }

    async function listarPublicaciones() {
        try {
            const res = await fetch(`${API}/publicaciones/seleccionarPublicaciones`, {
                method: "GET",
                headers: {Accept: "application/json"},
                mode: "cors",
                cache: "no-cache"
            });

            if (!res.ok) {
                setListaPublicaciones([]);
                return [];
            }

            const publicaciones = await res.json();
            const lista = Array.isArray(publicaciones) ? publicaciones : [];
            setListaPublicaciones(lista);
            return lista;
        } catch (err) {
            console.error("Problema al consultar publicaciones:", err);
            setListaPublicaciones([]);
            return [];
        }
    }

    useEffect(() => {
        listarPublicaciones();
    }, []);

    useEffect(() => {
        return () => {
            if (newPreview) URL.revokeObjectURL(newPreview);
        };
    }, [newPreview]);

    async function insertarPublicacion(
        descripcionPublicaciones,
        imagenPublicaciones_primera,
        imagenPublicaciones_segunda,
        imagenPublicaciones_tercera
    ) {
        if (!descripcionPublicaciones || !imagenPublicaciones_primera) {
            throw new Error("Descripcion e imagen son obligatorias.");
        }

        const res = await fetch(`${API}/publicaciones/insertarPublicacion`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                descripcionPublicaciones,
                imagenPublicaciones_primera,
                imagenPublicaciones_segunda,
                imagenPublicaciones_tercera
            }),
            mode: "cors",
            cache: "no-store"
        });

        if (!res.ok) throw new Error("No fue posible guardar la publicacion.");

        const data = await res.json();
        if (data.message !== "true") throw new Error("El servidor no confirmo el guardado.");
    }

    function handlePublicationSelect(event) {
        const value = event.target.value;
        setId_publicaciones(value);
        const publication = listaPublicaciones.find((item) => String(item.id_publicaciones) === String(value));
        setDescripcionPublicaciones(publication?.descripcionPublicaciones || "");

        if (Number(value) !== 10 && file.length > 1) {
            setfile(file.slice(0, 1));
            toast("Esta publicacion admite una sola imagen. Se mantuvo la primera seleccionada.");
        }
    }

    function handleFileChange(event) {
        const files = Array.from(event.target.files || []);

        if (id_publicaciones && Number(id_publicaciones) !== 10) {
            if (files.length > 1) {
                toast("Solo se permite 1 imagen para esta publicacion. Se usara la primera seleccionada.");
            }
            setfile(files.slice(0, 1));
            return;
        }

        if (files.length > 3) {
            toast("Has seleccionado mas de 3 imagenes. Se usaran las primeras 3.");
        }
        setfile(files.slice(0, 3));
    }

    function handleNewFileChange(event) {
        const selectedFile = event.target.files?.[0] || null;
        setNewFile(selectedFile);

        if (newPreview) URL.revokeObjectURL(newPreview);
        setNewPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
    }

    async function handleUpdateSubmit(event) {
        event.preventDefault();

        if (!id_publicaciones) return toast.error("Selecciona una publicacion para actualizar.");
        if (!descripcionPublicaciones.trim()) return toast.error("Escribe una descripcion para la publicacion.");
        if (!file.length) return toast.error("Selecciona al menos una imagen.");

        try {
            setIsUploading(true);
            const filesToUpload = selectedAllowsMultiple ? file.slice(0, 3) : file.slice(0, 1);
            const uploadedIds = [];

            for (const selectedFile of filesToUpload) {
                uploadedIds.push(await subirImagen(selectedFile));
            }

            await actualizarPublicaciones(
                descripcionPublicaciones.trim(),
                uploadedIds[0] || "",
                uploadedIds[1] || "",
                uploadedIds[2] || "",
                id_publicaciones
            );
            await listarPublicaciones();
            setfile([]);
            setDescripcionPublicaciones("");
            setId_publicaciones("");
            toast.success("Publicacion actualizada correctamente.");
        } catch (error) {
            toast.error(error?.message || "No fue posible actualizar la publicacion.");
        } finally {
            setIsUploading(false);
        }
    }

    async function handleInsertSubmit(event) {
        event.preventDefault();

        if (!newDescripcion.trim() || !newFile) {
            return toast.error("Descripcion e imagen son obligatorias para insertar.");
        }

        try {
            setIsInserting(true);
            const imageId = await subirImagen(newFile);
            await insertarPublicacion(newDescripcion.trim(), imageId, "", "");
            await listarPublicaciones();
            setNewDescripcion("");
            setNewFile(null);
            if (newPreview) {
                URL.revokeObjectURL(newPreview);
                setNewPreview(null);
            }
            toast.success("Publicacion insertada correctamente.");
        } catch (error) {
            toast.error(error?.message || "Error al insertar publicacion.");
        } finally {
            setIsInserting(false);
        }
    }

    function cfToSrc(imageId, variant = VARIANT_CARD) {
        if (!imageId) return "";
        if (imageId.startsWith("http")) return imageId;
        if (!CLOUDFLARE_HASH) return "";
        return `https://imagedelivery.net/${CLOUDFLARE_HASH}/${imageId}/${variant}`;
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_32%),radial-gradient(circle_at_right,_rgba(6,182,212,0.12),_transparent_28%),linear-gradient(180deg,_#f1f5f9_0%,_#f8fafc_55%,_#f1f5f9_100%)] px-4 py-8">
            <Toaster position="top-right" reverseOrder={false} />

            <div className="mx-auto max-w-7xl space-y-8">
                <header className="relative overflow-hidden rounded-[32px] border border-slate-300/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur-sm md:p-8">
                    <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-teal-400/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700">Gestion de contenido</p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                                Publicaciones del carrusel
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                Administra las piezas visuales que aparecen bajo la portada. Carga imagenes optimizadas, actualiza descripciones y conserva una grilla limpia para el sitio publico.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3">
                                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-700">Publicaciones</p>
                                <p className="mt-1 text-2xl font-black text-slate-950">{listaPublicaciones.length}</p>
                            </div>
                            <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3">
                                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700">Formato</p>
                                <p className="mt-1 text-sm font-bold text-slate-950">Cloudflare Images</p>
                            </div>
                            <InfoButton informacion={'Este apartado está diseñado exclusivamente para la carga de imágenes que serán visualizadas en el carrusel ubicado debajo de la portada de la página principal.\n\nLa carga se realiza de una imagen por vez al crear. Al actualizar, la publicación especial ID 10 admite hasta 3 imágenes; el resto admite una imagen.\n\nPara un mejor rendimiento y compatibilidad, se sugiere utilizar formatos PNG, JPG o WEBP con peso menor a 10 MB.'}/>
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <article className="overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                        <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#0f172a_0%,#312e81_58%,#0f766e_100%)] px-5 py-5">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-100">Actualizar existente</p>
                            <h2 className="mt-1 text-xl font-black text-white">Reemplazar imagen y descripcion</h2>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="space-y-5 p-5 md:p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Publicacion</label>
                                    <select
                                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                        value={id_publicaciones}
                                        onChange={handlePublicationSelect}
                                        disabled={isUploading}
                                    >
                                        <option value="" disabled>Selecciona una publicacion</option>
                                        {listaPublicaciones.map((publicacion) => (
                                            <option value={publicacion.id_publicaciones} key={publicacion.id_publicaciones}>
                                                #{publicacion.id_publicaciones} - {publicacion.descripcionPublicaciones}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Limite</p>
                                    <p className="mt-1 text-sm font-bold text-slate-900">{selectedAllowsMultiple ? "Hasta 3 imagenes" : "1 imagen"}</p>
                                </div>
                            </div>

                            {selectedPublication && (
                                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-700">Seleccion actual</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{selectedPublication.descripcionPublicaciones}</p>
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Nueva descripcion</label>
                                <input
                                    type="text"
                                    name="descripcionPublicaciones"
                                    value={descripcionPublicaciones}
                                    onChange={(e) => setDescripcionPublicaciones(e.target.value)}
                                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    placeholder="Ej: Resultados, experiencia del centro, tecnologia..."
                                    disabled={isUploading}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Imagenes de reemplazo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple={selectedAllowsMultiple}
                                    onChange={handleFileChange}
                                    className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm shadow-sm transition file:mr-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-indigo-700 file:to-teal-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-indigo-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    disabled={isUploading}
                                />
                                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                                    {file.length > 0 ? file.map((selectedFile) => (
                                        <span key={`${selectedFile.name}-${selectedFile.size}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600">
                                            {selectedFile.name}
                                        </span>
                                    )) : (
                                        <span>JPG, PNG, WEBP, GIF o SVG. Maximo 10 MB antes de compresion.</span>
                                    )}
                                </div>
                            </div>

                            {isUploading && (
                                <div className="flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-300 border-t-transparent" />
                                    Subiendo imagen a la nube...
                                </div>
                            )}

                            <button
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-700 to-teal-600 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-800 hover:to-teal-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
                                type="submit"
                                disabled={isUploading}
                            >
                                {isUploading ? "Actualizando..." : "Actualizar publicacion"}
                            </button>
                        </form>
                    </article>

                    <article className="overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                        <div className="border-b border-slate-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(241,245,249,0.8)_100%)] px-5 py-5">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-700">Nueva pieza</p>
                            <h2 className="mt-1 text-xl font-black text-slate-950">Insertar publicacion</h2>
                        </div>

                        <form onSubmit={handleInsertSubmit} className="space-y-5 p-5 md:p-6">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Descripcion</label>
                                <input
                                    type="text"
                                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    placeholder="Descripcion visible de la publicacion"
                                    value={newDescripcion}
                                    onChange={(e) => setNewDescripcion(e.target.value)}
                                    disabled={isInserting}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Imagen principal</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleNewFileChange}
                                    className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm shadow-sm transition file:mr-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-indigo-700 file:to-teal-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-indigo-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    disabled={isInserting}
                                />
                            </div>

                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                                {newPreview ? (
                                    <img src={newPreview} alt="Vista previa de nueva publicacion" className="h-64 w-full object-cover" />
                                ) : (
                                    <div className="flex h-64 items-center justify-center px-6 text-center text-sm font-medium text-slate-400">
                                        La vista previa aparecera aqui al seleccionar una imagen.
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isInserting}
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-700 to-teal-600 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-800 hover:to-teal-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
                            >
                                {isInserting ? "Insertando..." : "Insertar publicacion"}
                            </button>
                        </form>
                    </article>
                </section>

                <section aria-labelledby="publications-title" className="space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700">Inventario visual</p>
                            <h2 id="publications-title" className="text-2xl font-black tracking-tight text-slate-950">Publicaciones cargadas</h2>
                        </div>
                        <p className="text-sm text-slate-500">Revisa imagen, descripcion y estado de eliminacion.</p>
                    </div>

                    {listaPublicaciones.length === 0 ? (
                        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/90 p-12 text-center text-sm text-slate-500 shadow-sm">
                            Aun no hay publicaciones registradas.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {listaPublicaciones.map((publicacion) => {
                                const isProtected = Number(publicacion.id_publicaciones) === 10;
                                const imageSrc = cfToSrc(publicacion.imagenPublicaciones_primera, VARIANT_FULL);

                                return (
                                    <article key={publicacion.id_publicaciones} className="group overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.10)] transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_22px_55px_rgba(15,23,42,0.14)]">
                                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                            {imageSrc ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={publicacion.descripcionPublicaciones || "Publicacion"}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-300">
                                                    Sin imagen
                                                </div>
                                            )}
                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent" />
                                            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/55 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                                                #{publicacion.id_publicaciones}
                                            </span>
                                            {isProtected && (
                                                <span className="absolute right-4 top-4 rounded-full border border-teal-200/30 bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-50 backdrop-blur">
                                                    Protegida
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-4 p-5">
                                            <h3 className="line-clamp-2 text-base font-bold leading-6 text-slate-950" title={publicacion.descripcionPublicaciones}>
                                                {publicacion.descripcionPublicaciones || "Sin descripcion"}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setId_publicaciones(String(publicacion.id_publicaciones));
                                                        setDescripcionPublicaciones(publicacion.descripcionPublicaciones || "");
                                                        window.scrollTo({top: 0, behavior: "smooth"});
                                                    }}
                                                    className="inline-flex items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (isProtected) {
                                                            toast.error("No se puede eliminar la publicacion con id 10.");
                                                            return;
                                                        }
                                                        if (!confirm("Deseas eliminar esta publicacion?")) return;
                                                        await eliminarPublicacion(publicacion.id_publicaciones);
                                                    }}
                                                    className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-2 text-sm font-bold shadow-sm transition ${isProtected ? "cursor-not-allowed bg-slate-200 text-slate-500" : "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"}`}
                                                    disabled={isProtected}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
