"use client"

import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useEffect, useState} from "react";
import ToasterClients from "@/Componentes/ToasterClient";
import ShadcnInput from "@/Componentes/shadcnInput2";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";
import {UserIcon} from "@heroicons/react/24/outline";
import {InfoButton} from "@/Componentes/InfoButton";

export default function ListaPacientes() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [listaPacientes, setListaPacientes] = useState([]);
    const [nombreBuscado, setNombreBuscado] = useState("");
    const [rutBuscado, setRutBuscado] = useState("");

    const router = useRouter();

    function verDetallePaciente(id_paciente) {
        router.push(`/dashboard/paciente/${id_paciente}`);
    }

    async function buscarRutSimilar(rutBuscado) {
        try {
            if (!rutBuscado) {
                toast.error("Debe ingresar previamente un RUT para buscar similitudes.");
            }

            const rut = rutBuscado;

            const res = await fetch(`${API}/pacientes/contieneRut`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({rut}),
                mode: "cors"
            });

            if (!res.ok) {
                return res.json();
            }

            const dataRutSimilar = await res.json();

            if (Array.isArray(dataRutSimilar) && dataRutSimilar.length > 0) {
                setListaPacientes(dataRutSimilar);
                return toast.success("Similitud encontrada!");
            }

            return toast.error("No se han encontrado similitudes.");
        } catch (err) {
            console.log(err);
            return toast.error("Ha ocurrido un problema en el servidor");
        }
    }

    async function buscarNombreSimilar(nombreBuscado) {
        try {
            const nombre = nombreBuscado.trim();

            if (!nombreBuscado) {
                toast.error("Debe ingresar previamente un nombre para buscar similitudes.");
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
            });

            if (!res.ok) {
                return res.json();
            }

            const dataSimilar = await res.json();

            if (Array.isArray(dataSimilar) && dataSimilar.length > 0) {
                setListaPacientes(dataSimilar);
                return toast.success("Similitud encontrada!");
            }

            return toast.error("No se han encontrado similitudes.");
        } catch (err) {
            console.log(err);
            return toast.error("Ha habido un problema en el servidor por favor contacte a soporte de Medify");
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
            });

            if (!res.ok) {
                return toast.error("Ha ocurrido un error listando los pacientes . contacte a soporte IT de Medify");
            }

            const dataPacientes = await res.json();
            setListaPacientes(dataPacientes);
        } catch (error) {
            console.log(error);
            return toast.success("Ha ocurrido un error contacte a soporte de Medify");
        }
    }

    useEffect(() => {
        listarPacientes();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
            <ToasterClients/>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700 mb-1">Administración</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                            Listado General de Pacientes
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Busca pacientes rápidamente y envíalos directo al agendamiento.</p>
                    </div>
                    <InfoButton informacion={"Este módulo está diseñado para buscar pacientes ya registrados y agendarlos rápidamente. Puede usar los filtros por nombre o RUT para encontrar al paciente, revisar su información básica en la tabla y luego presionar el botón \"Agendar paciente\" para enviarlo al calendario sin tener que escribir nuevamente sus datos."}/>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-slate-300 rounded-[24px] shadow-[0_18px_50px_rgba(15,23,42,0.12)] overflow-hidden">
                        <div className="border-b border-slate-200 bg-slate-100/80 px-5 py-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">Búsqueda de Pacientes</h2>
                        </div>

                        <div className="p-5 md:p-6">
                            <p className="text-xs text-slate-400 mb-4">Busca por nombre o RUT y agenda al paciente sin reescribir sus datos.</p>
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
                                            className={"hover:bg-indigo-50/50 transition-colors duration-100 " + (i % 2 === 0 ? "bg-white" : "bg-slate-50/50")}>
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
    );
}
