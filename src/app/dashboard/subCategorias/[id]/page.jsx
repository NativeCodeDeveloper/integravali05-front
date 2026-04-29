"use client";
import {useParams, useRouter} from "next/navigation";
import {useState,useEffect} from "react";
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {toast} from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import {router} from "next/client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {ShadcnInput} from "@/Componentes/shadcnInput";


export default function SubCategoria(){
    const API = process.env.NEXT_PUBLIC_API_URL;
    const {id} = useParams();
    const [descripcionCategoria, setDescripcionCategoria] = useState("");
    const [listaSubcategorias, setListaSubcategorias] = useState([]);
    const [descripcionSubcategoria, setDescripcionSubcategoria] = useState("");
    const [dataSeleccion, setDataSeleccion] = useState([]);
    const [id_subcategoria, setIdSubcategoria] = useState(0);
    const router = useRouter();


    function irSubSubCategoria(id) {
        router.push(`/dashboard/subsubcategoria/${id}`);
    }





// FUNCION PARA SELECCIONAR CATEGORIA ESPECIFICA SELECCIONADA
    async function seleccionarCategoriaEspecifica(id_categoriaProducto) {
        try {
            if (!id_categoriaProducto) {
                console.error({ message: "Id del categoria no proporcionado" });
                return null;
            }
            const res = await fetch(`${API}/categorias/${id_categoriaProducto}`, {
                method: 'GET',
                headers: {Accept: 'application/json'},
                cache: 'no-store',
            })
            if (!res.ok) {
                return toast.error('No fue posible seleccionar la categoria especifica contacte a soporte informatico de NativeCode');
            }
            const data = await res.json();
            setDescripcionCategoria(data.descripcionCategoria);

            console.log(data);
        }catch (e) {
            console.error(e);
        }
    }
    useEffect(() => {
        if (id) {
            seleccionarCategoriaEspecifica(id)
        }
    }, [id]);



// FUNCION PARA LISTAR  SUBCATEGORIAS ESPECIFICA SELECCIONADA POR CADA CATEGORIA
    async function listarSubcategorias(id_categoriaProducto){
        try {
            if (!id_categoriaProducto) {
                return toast.error("Debe seleccionar al menos una categoria, para que las subcategorias sean listadas." );
            }
            const res = await fetch(`${API}/subcategorias/seleccionarPorCategoria`, {
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json'},
                mode: 'cors',
                body: JSON.stringify({id_categoriaProducto})
            })
            if (!res.ok) {
                return toast.error("Ha ocurrido un error con el servidor contacte a soporte de NativeCode" );
            }else {
                const resultadoData = await res.json();
                if (resultadoData.length > 0) {
                    setListaSubcategorias(resultadoData);
                }
            }
        }catch (e) {
            return toast.error('No se han podido listar las subcategorias contacte a soporte de NativeCode')
        }
    }
    useEffect(() => {
        if (id) {
            listarSubcategorias(id)
        }
    }, [id]);

    // FUNCION PARA INSERTAR SUBCATEGORIAS  POR CADA CATEGORIA
    async function insertarSubcategoria(descripcionCategoria, id_categoriaProducto){
        try {
            if (!id_categoriaProducto || !descripcionCategoria || descripcionSubcategoria ==="") {
                return toast.error('Debe haber seleccionado almenos una categoria y escribir el nombre de la subcategoria')
            }

            const imagenSubCategoria = 'CategoriaSinImagen'

            const res = await fetch(`${API}/subcategorias/insertarSubCategoria`, {
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json'},
                mode: 'cors',
                body: JSON.stringify({descripcionCategoria, imagenSubCategoria, id_categoriaProducto}),
            })

            if (!res.ok) {
                return toast.error('Ha ocurrido un error intente mas tarde');
            }else{

                const resultadoBackend = await res.json();

                if (resultadoBackend.message === "true") {
                    await listarSubcategorias(id)
                    setDescripcionSubcategoria("");
                    return toast.success('Subcategoria ingresada correctamente')

                }else if (resultadoBackend.message === "sindata") {
                    return toast.error('Debe seleccionar almenos una categoria y No debe quedar el campo vacio');
                }else {
                    return toast.error('Ha ocurrido un problema contacte a soporte');
                }
            }
        }catch (e) {
            return toast.error('Ha ocurrido un error contacte a soporte de NativeCode')
        }
    }



    //FUNCION PARA SELECCIONAR LA SUBCATEGORIA TOMANDO SU DESCRIPCION Y SU NUMERO DE ID
    async function seleccionarSubcategoria(id_subcategoria) {
        try {
            if (!id_subcategoria){
                return toast.error('Debe seleccionar una subcategoria para poder acceder a la edicion.');
            }

            const res = await fetch(`${API}/subcategorias/seleccionarSubCategoriaid`, {
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json'},
                mode: 'cors',
                body: JSON.stringify({id_subcategoria})
            })

            if (!res.ok) {
                return toast.error('Ha ocurrido un error contacte a soporte de NativeCode')

            }else {

                const resultadoData = await res.json();

                const subcategoria = Array.isArray(resultadoData) ? resultadoData[0] : resultadoData;

                if (subcategoria) {
                    setDescripcionSubcategoria(subcategoria.descripcionCategoria);
                    setIdSubcategoria(subcategoria.id_subcategoria);
                    return toast.success('Subcategoria seleccionada!')
                }

            }
        }catch (e) {
            return toast.error('Ha ocurrido un problema en el servidor contacte a soporte de NativeCode')
        }
    }






    //FUNCION PARA SELECCIONAR LA SUBCATEGORIA TOMANDO SU DESCRIPCION Y SU NUMERO DE ID
    async function eliminarSubcategoria(id_subcategoria) {
        try {
            if (!id_subcategoria){
                return toast.error('Debe seleccionar una subcategoria para poder eliminarla.');
            }

            const res = await fetch(`${API}/subcategorias/eliminarSubCategoria`, {
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json'},
                mode: 'cors',
                body: JSON.stringify({id_subcategoria})
            })

            if (!res.ok) {
                return toast.error('Ha ocurrido un error al eliminar la subcategoria contacte a soporte de NativeCode')

            }else {

                const resultadoBackend = await res.json();

                if (resultadoBackend.message === "true") {
                    await listarSubcategorias(id);
                    return toast.success('Subcategoria eliminada!')
                }else if (resultadoBackend.message === "false") {
                    return toast.error('No se ha podido eliminar la subcategoria contacte a soporte de NativeCode');
                }else{
                    return toast.error('Ha ocurrido un error, Contacte a soporte de NativeCode');
                }
            }
        }catch (e) {
            return toast.error('Ha ocurrido un problema en el servidor contacte a soporte de NativeCode')
        }
    }


    function limpiarFormulario() {
        setDescripcionSubcategoria("")
        setIdSubcategoria(0)
    }




    async function actualizarSubCategoria(descripcionCategoria,id_categoriaProducto,id_subcategoria) {
        try {
            if (!descripcionCategoria || !id_categoriaProducto || !id_subcategoria ) {
                return toast.error('Debe completar todos los campos para actualizar la informacion (No es posible ingresar campos sin datos).')
            }

            const res = await fetch(`${API}/subcategorias/actualizarSubCategoria`, {
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json'},
                mode: 'cors',
                body: JSON.stringify({descripcionCategoria,id_categoriaProducto,id_subcategoria})
            })

            if (!res.ok) {
                return toast.error('Ha ocurrido un problema interno contacte a soporte de NativeCode')
            }else{
                const resultadoBackend = await res.json();
                if (resultadoBackend.message === "true") {
                    await listarSubcategorias(id);
                    return toast.success('Subcategoria actualizada!')
                }else if (resultadoBackend.message === "false") {
                    return toast.error('No fue posible actualizar la subcategoria')
                }else{
                    return toast.error('No fue posible actualizar la subcategoria contacte a soporte de NativeCode')
                }
            }
        }catch (e) {
            return toast.error('Ha ocurrido un problema interno contacte a soporte de NativeCode')
        }
    }





    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_32%),radial-gradient(circle_at_right,_rgba(6,182,212,0.12),_transparent_28%),linear-gradient(180deg,_#f1f5f9_0%,_#f8fafc_55%,_#f1f5f9_100%)]">
            <ToasterClient/>

            <div className="mx-auto w-full max-w-6xl px-6 py-10">
                {/* Header */}
                <div className="mb-8 rounded-[28px] border border-slate-300/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                    <div className="flex flex-col gap-2">
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700">Administracion</p>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Gestión de Subcategorías
                        </h1>
                        <p className="text-sm text-slate-600">
                            Categoría principal:
                            <span className="ml-2 font-semibold text-teal-700">{descripcionCategoria}</span>
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-[24px] border border-slate-300 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-start justify-between gap-6">
                            <div className="space-y-1">
                                <h2 className="text-base font-semibold text-slate-900">
                                    Ingreso y edición
                                    <span className="ml-2 text-indigo-700">(Subcategoría)</span>
                                </h2>
                                <p className="text-sm text-slate-600">
                                    Subcategoría seleccionada:
                                    <span className="ml-2 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-100">
                                        {id}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <label className="text-sm font-medium text-slate-700">Nombre de subcategoría</label>
                            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                                <ShadcnInput
                                    value={descripcionSubcategoria}
                                    onChange={(e)=> setDescripcionSubcategoria(e.target.value)}
                                    className="w-full border-0 bg-transparent p-0 text-slate-900 placeholder:text-slate-400 focus:ring-0"
                                />
                            </div>
                            <p className="text-xs text-slate-500">
                                Escribe el nombre y luego ingrésala o actualízala si ya está seleccionada.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                <div className="w-full sm:w-auto">
                                    <ShadcnButton
                                        nombre={'Ingresar Subcategoria'}
                                        funcion={()=> insertarSubcategoria(descripcionSubcategoria,id)}
                                        className="w-full rounded-xl bg-gradient-to-r from-indigo-700 to-teal-600 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-800 hover:to-teal-700"
                                    />
                                </div>
                                <div className="w-full sm:w-auto">
                                    <ShadcnButton
                                        nombre={'Limpiar'}
                                        funcion={()=> limpiarFormulario()}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-auto">
                                {id_subcategoria > 0 && (
                                    <ShadcnButton
                                        nombre={'Actualizar Subcategoria'}
                                        funcion={()=> actualizarSubCategoria(descripcionSubcategoria,id,id_subcategoria)}
                                        className="w-full rounded-xl bg-gradient-to-r from-indigo-700 to-teal-600 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-800 hover:to-teal-700"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="mt-10 rounded-[24px] border border-slate-300 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                    <div className="mb-4 flex flex-col gap-1">
                        <h3 className="text-base font-semibold text-slate-900">Subcategorías</h3>
                        <p className="text-sm text-slate-600">
                            Lista asociada a
                            <span className="ml-2 font-semibold text-teal-700">{descripcionCategoria}</span>
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200">
                        <Table>
                            <TableCaption className="caption-bottom bg-slate-50 py-3 text-sm text-slate-600">
                                Lista de Subcategorías asociadas a categoría
                                <span className='ml-2 font-bold text-teal-700'>{descripcionCategoria}</span>
                            </TableCaption>
                            <TableHeader>
                                <TableRow className="bg-[linear-gradient(135deg,#312e81_0%,#0f766e_100%)] hover:bg-[linear-gradient(135deg,#312e81_0%,#0f766e_100%)]">
                                    <TableHead className="text-white">Subcategoría</TableHead>
                                    <TableHead className="text-white">Acciones</TableHead>
                                    <TableHead className="text-white"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listaSubcategorias.map((subcategoria) => (
                                    <TableRow
                                        key={subcategoria.id_subcategoria}
                                        className="transition-colors hover:bg-indigo-50/60"
                                    >
                                        <TableCell className="font-medium text-slate-900">
                                            {subcategoria.descripcionCategoria}
                                        </TableCell>

                                        <TableCell className="py-3">
                                            <ShadcnButton
                                                nombre={'Seleccionar para Edicion'}
                                                funcion={()=> seleccionarSubcategoria(subcategoria.id_subcategoria)}
                                                className="rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                            />
                                        </TableCell>

                                        <TableCell className="py-3">
                                            <ShadcnButton
                                                nombre={'Eliminar Subcategoria'}
                                                funcion={(e)=> eliminarSubcategoria(subcategoria.id_subcategoria) }
                                                className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                            />
                                        </TableCell>

                                        <TableCell className="py-3">
                                            <ShadcnButton
                                                nombre={'Sub-Subcategorias'}
                                                funcion={(e)=> irSubSubCategoria(subcategoria.id_subcategoria) }
                                                className="rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}
