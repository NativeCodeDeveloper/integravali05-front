'use client';
import {useEffect, useState} from "react";
import ToasterClient from "@/Componentes/ToasterClient";
import {toast} from "react-hot-toast";
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {ShadcnInput} from "@/Componentes/shadcnInput";
import {InfoButton} from "@/Componentes/InfoButton";
import * as React from "react";



export default function CarruselPortada() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const PORTADA = 'portada';
    const CARD = 'card';

    const [dataPublicacionesCarrusel, setdataPublicacionesCarrusel] = useState([]);
    const [imagen, setimagen] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState(null);
    const [tituloPortadaCarrusel,settituloPortadaCarrusel] = useState("");
    const [descripcionPublicacionesPortada, setdescripcionPublicacionesPortada] = useState("");
    const [id_publicacionesPortada, setid_publicacionesPortada] = useState(null);
    const [imagenAnterior, setimagenAnterior] = useState(null);



    function capturarImagen(event){
        const file = event.target.files?.[0] ?? null;
        if(vistaPrevia){
          URL.revokeObjectURL(vistaPrevia);
        }
        setimagen(file)
        if(file){
            const url = URL.createObjectURL(file);
            setVistaPrevia(url);
        }else{
            setVistaPrevia(null)
        }
    }


    async function subirPortadaClick(){
        if(!tituloPortadaCarrusel || !descripcionPublicacionesPortada || !imagen){
          return toast.error("Debe completar toda la informacion para subir la portada");
        }

        const imagenId = await subirImagenCloudflare(imagen);
        await insertarPortada(tituloPortadaCarrusel,descripcionPublicacionesPortada,imagenId);
        await seleccionarPortadas();
    }



    async function actualizaroPortadaClick(){
        if(!tituloPortadaCarrusel || !descripcionPublicacionesPortada || !id_publicacionesPortada){
            return toast.error("Debe completar toda la informacion para subir la portada");
        }

        let imagenId  = await subirImagenCloudflare(imagen);

        if(!imagenId){
            imagenId = imagenAnterior;
            await actualizarPortada(tituloPortadaCarrusel,descripcionPublicacionesPortada,imagenId,id_publicacionesPortada);
            await seleccionarPortadas();

        }else {
            await actualizarPortada(tituloPortadaCarrusel,descripcionPublicacionesPortada,imagenId,id_publicacionesPortada);
            await seleccionarPortadas();

        }
    }




    async function subirImagenCloudflare(){
        const formData = new FormData();
        formData.append('image', imagen);

        const res = await fetch(`${API}/cloudflare/subirimagenes`, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        return data.imageId;
    }

    async function seleccionarPortadas() {
        try {
            const res = await fetch(`${API}/carruselPortada/seleccionarCarruselPortada`, {
                method: "GET",
                headers: {Accept: "application/json,"},
                mode: "cors",
            })

            if(!res.ok) {
                return toast.error('No ha sido posible cargar las imagenes del carrusel porfavor contacte a soporte de NativeCode');

            }else{

                const dataCarrusel = await res.json();
                setdataPublicacionesCarrusel(dataCarrusel);
            }
        }catch (error) {
            return toast.error('No ha sido posible cargar las imagenes del carrusel porfavor contacte a soporte de NativeCode');
        }
    }

    useEffect(() => {
        seleccionarPortadas()
    },[])


    async function insertarPortada(tituloPortadaCarrusel,descripcionPublicacionesPortada,imagenPortada){
        try {

            if(!tituloPortadaCarrusel || !descripcionPublicacionesPortada || !imagenPortada){
                return toast.error('No ha sido posible insertar la imagen del carrusel porfavor contacte a soporte de NativeCode');
            }


            const res = await fetch(`${API}/carruselPortada/insertarCarruselPortada`, {
                method: "POST",
                headers: {Accept: "application/json",
                "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({
                    tituloPortadaCarrusel,
                    descripcionPublicacionesPortada,
                    imagenPortada})
            })

            if(!res.ok) {
                return toast.error('No ha sido posible insertar la imagen del carrusel porfavor contacte a soporte de NativeCode');
            }else{
                const respuestaBackend = await res.json();
                if (respuestaBackend.message === true) {
                    limpiarDataInputs();
                    return toast.success('Imagen Subida Correctamente');
                }else if(respuestaBackend.message === false){
                    return toast.error('No se ha podido subir la imagen intente mas tarde!');
                }else {
                    return toast.error('No ha sido posible insertar la imagen del carrusel porfavor contacte a soporte de NativeCode');
                }
            }

        }catch (error) {
            return toast.error('No ha sido posible insertar la imagen del carrusel porfavor contacte a soporte de NativeCode');

        }
    }

    async function eliminarPortada(id_publicacionesPortada){
        try {
            if(!id_publicacionesPortada){
                return toast.error('Debe seleccionar la imagen de la portada que desea eliminar.');
            }

            const res = await fetch(`${API}/carruselPortada/eliminarCarruselPortada`, {
                method: "POST",
                headers: {Accept: "application/json",
                "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_publicacionesPortada})
            })

            if(!res.ok) {
                return toast.error('No ha sido posible eliminar la imagen del carrusel porfavor contacte a soporte de NativeCode');
            }else {
                const respuestaBackend = await res.json();
                if (respuestaBackend.message === true) {
                    await seleccionarPortadas();
                    return toast.success('Imagen eliminada correctamente del carrusel.');
                }else if(respuestaBackend.message === false){
                    return toast.error('No ha sido posible eliminar la imagen del carrusel porfavor intente mas tarde!');
                }else{
                    return toast.error('No ha sido posible eliminar la imagen del carrusel porfavor contacte a soporte de NativeCode');
                }
            }

        }catch (error) {
            return toast.error('No ha sido posible eliminar la imagen del carrusel porfavor contacte a soporte de NativeCode');

        }
    }




    async function seleccionarPortada(id_publicacionesPortada){
        try {
            if(!id_publicacionesPortada){
                return toast.error('Debe seleccionar la imagen de la portada que desea editar.');
            }

            const res = await fetch(`${API}/carruselPortada/seleccionarCarruselPortadaporId`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_publicacionesPortada})
            })

            if(!res.ok) {
                return toast.error('No ha sido posible seleccionar la imagen del carrusel porfavor contacte a soporte de NativeCode');
            }else {

                const respuestaBackendData = await res.json();
                settituloPortadaCarrusel(respuestaBackendData[0].tituloPortadaCarrusel)
                setdescripcionPublicacionesPortada(respuestaBackendData[0].descripcionPublicacionesPortada)
                setid_publicacionesPortada(respuestaBackendData[0].id_publicacionesPortada)
                setimagenAnterior(respuestaBackendData[0].imagenPortada)
                setVistaPrevia(`https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${respuestaBackendData[0].imagenPortada}/${CARD}`)


                return toast.success('Imagen seleccionada');

            }
        }catch (error) {
            return toast.error('No ha sido posible seleccionar la imagen del carrusel porfavor contacte a soporte de NativeCode');

        }
    }




    async function actualizarPortada(tituloPortadaCarrusel,descripcionPublicacionesPortada,imagenPortada,id_publicacionesPortada){
        try {

            if(!tituloPortadaCarrusel || !descripcionPublicacionesPortada  || !id_publicacionesPortada){
                return toast.error('Para editar una portada existente debe seleccionar una portada y llenar todas los campos includia la imagen.');
            }


            const res = await fetch(`${API}/carruselPortada/actualizarCarruselPortada`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({
                    tituloPortadaCarrusel,
                    descripcionPublicacionesPortada,
                    imagenPortada,
                    id_publicacionesPortada})
            })

            if(!res.ok) {
                return toast.error('Problema al enviar datos al servidor contacte a soporte de NativeCode SpA');

            }else{
                const respuestaBackend = await res.json();

                if (respuestaBackend.message === true) {
                    limpiarDataInputs();
                    return toast.success('Imagen actualizada Correctamente');

                }else if(respuestaBackend.message === false){

                    return toast.error('No se ha podido actualizar la imagen intente mas tarde!');

                }else {

                    return toast.error('retorna algo difrrnte a lo qiue envia en el controller');

                }
            }

        }catch (error) {
            return toast.error('server error');

        }
    }


    function limpiarDataInputs(){
        settituloPortadaCarrusel("");
        setdescripcionPublicacionesPortada("");
        setVistaPrevia(null);
        setid_publicacionesPortada(0);
    }


    return(

        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_32%),radial-gradient(circle_at_right,_rgba(6,182,212,0.12),_transparent_28%),linear-gradient(180deg,_#f1f5f9_0%,_#f8fafc_55%,_#f1f5f9_100%)] text-slate-900">
            <ToasterClient />




            <div className="mx-auto w-full max-w-6xl px-6 py-10">

                <div className='flex justify-end'>

                    <InfoButton informacion={'Este apartado corresponde a la subida de las imágenes de portada que se mostrarán en el carrusel principal del sitio.\n' +
                        '\n' +
                        '💡 Recomendación de calidad de imagen:\n' +
                        '\t•\tPara asegurar una visualización óptima y correcta proporción en diferentes dispositivos, te recomendamos subir las imágenes en el formato de 2021 × 748 píxeles.\n' +
                        '\t•\tLas imágenes con esta dimensión se verán más nítidas y evitarán estiramientos o recortes no deseados en el carrusel.\n' +
                        '\n' +
                        '🎯 Resumen de requisitos:\n' +
                        '\t•\t📷 Destino: Carrusel de portada\n' +
                        '\t•\t📏 Tamaño recomendado: 2021 × 748 px\n' +
                        '\t•\t🖼️ Formato de archivo sugerido: JPG o PNG '}/>

                </div>

                <div className="rounded-[28px] border border-slate-300/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700">Administracion</p>
                    <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
                        Imagenes del Carrusel de Portada
                    </h1>
                    <p className="text-sm text-slate-600">
                        Administra tus portadas: sube, previsualiza, selecciona, edita o elimina.
                    </p>
                </div>

                {id_publicacionesPortada > 0 && (
                    <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                        <h1 className="text-green-900">El ID de la portada Seleccionada para la edicion es : <span className="font-semibold">{id_publicacionesPortada}</span></h1>
                    </div>
                )}

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Form */}
                    <div className="lg:col-span-5">
                        <div className="rounded-[24px] border border-slate-300 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                            <div className="flex flex-col gap-5">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-900">Titulo de la Portada</label>
                                    <div className="rounded-xl border border-slate-200 bg-white focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                                        <ShadcnInput
                                            value={tituloPortadaCarrusel}
                                            onChange={(e) => settituloPortadaCarrusel(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-900">Descripcion de la Portada</label>
                                    <div className="rounded-xl border border-slate-200 bg-white focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                                        <ShadcnInput
                                            value={descripcionPublicacionesPortada}
                                            onChange={(e) => setdescripcionPublicacionesPortada(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-900">Imagen (Solo 1 Imagen)</label>
                                    <input
                                        type='file'
                                        accept="image/*"
                                        className='w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-indigo-700 file:to-teal-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-indigo-300'
                                        onChange={capturarImagen}
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Recomendado: PNG o JPG. Mantén consistencia de tamaño para una mejor estética.
                                    </p>
                                </div>

                                <div className='flex flex-col gap-3  sm:items-center sm:justify-between'>
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <ShadcnButton
                                            nombre={'Subir Imagen'}
                                            funcion={()=>subirPortadaClick()}
                                            className="rounded-xl bg-gradient-to-r from-indigo-700 to-teal-600 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-800 hover:to-teal-700"/>

                                        <ShadcnButton
                                            nombre={'Limpiar Informacion'}
                                            funcion={()=>limpiarDataInputs()}
                                            className="rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"/>

                                    </div>

                                    {id_publicacionesPortada > 0 && (
                                        <ShadcnButton
                                            nombre={'Actualizar Datos'}
                                            funcion={()=> actualizaroPortadaClick()}
                                            className="rounded-xl bg-gradient-to-r from-indigo-700 to-teal-600 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-800 hover:to-teal-700"/>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* Preview */}
                        <div className="mt-6">
                            {vistaPrevia && (
                                <div className="overflow-hidden rounded-[24px] border border-slate-300 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                                    <div className="flex items-center justify-between border-b border-slate-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(241,245,249,0.8)_100%)] px-4 py-3">
                                        <span className="text-sm font-medium text-slate-900">Vista previa</span>
                                        <span className="text-xs text-slate-500">CARD</span>
                                    </div>
                                    <div className="p-4">
                                        <img src={vistaPrevia} alt="vistaPrevia" className="h-56 w-full rounded-xl object-cover" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-7">
                        <div className="rounded-[24px] border border-slate-300 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Portadas</h2>
                                <span className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                                    Total: {dataPublicacionesCarrusel.length}
                                </span>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6">
                                {
                                    dataPublicacionesCarrusel.map((carruselPortada, index) => (
                                        <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-indigo-200 hover:shadow-md">
                                            <div className='flex flex-col md:flex-row'>
                                                <div className='relative w-full md:w-80 shrink-0'>
                                                    <img
                                                        src={`https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${carruselPortada.imagenPortada}/${CARD}`}
                                                        alt="CARDPORTADA"
                                                        className="h-56 w-full object-cover md:h-full"
                                                    />
                                                    <div className="absolute left-3 top-3 rounded-lg bg-black/50 px-3 py-1 text-xs text-slate-100 backdrop-blur">
                                                        #{carruselPortada.id_publicacionesPortada}
                                                    </div>
                                                </div>

                                                <div className='flex flex-1 flex-col gap-3 p-5'>
                                                    <div className="flex flex-col gap-1">
                                                        <h1 className="text-sm text-slate-500">Numero de Portada : {carruselPortada.id_publicacionesPortada}</h1>
                                                        <h1 className="text-base font-semibold text-slate-900">{carruselPortada.tituloPortadaCarrusel}</h1>
                                                        <p className="text-sm leading-relaxed text-slate-600">{carruselPortada.descripcionPublicacionesPortada}</p>
                                                    </div>

                                                    <div className="mt-2 flex flex-col gap-3 ">
                                                        <ShadcnButton className="w-25 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100" nombre={'Eliminar'} funcion={()=> eliminarPortada(carruselPortada.id_publicacionesPortada)}/>
                                                        <ShadcnButton className="w-25 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100" nombre={'Seleccionar'} funcion={()=> seleccionarPortada(carruselPortada.id_publicacionesPortada )}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
