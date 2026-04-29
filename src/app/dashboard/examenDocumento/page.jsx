'use client'

import React, {useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ToasterClient from "@/Componentes/ToasterClient";
import ShadcnInput from "@/Componentes/shadcnInput2";

export default function ExamenDocumento() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const EMPRESA_NOMBRE = process.env.NEXT_PUBLIC_EMPRESA_NOMBRE || "AgendaClinica";

    const [nombrePaciente, setNombrePaciente] = useState("");
    const [rutPaciente, setRutPaciente] = useState("");
    const [nombreProfesional, setNombreProfesional] = useState("");
    const [fechaSolicitud, setFechaSolicitud] = useState(new Date().toISOString().split("T")[0]);
    const [listaExamenes, setListaExamenes] = useState([]);
    const [listaExamenesSolicitados, setListaExamenesSolicitados] = useState([]);
    const [busquedaExamen, setBusquedaExamen] = useState("");

    const formatoCLP = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    async function seleccionarTodosExamenes() {
        try {
            const res = await fetch(`${API}/examenes/seleccionarTodosExamenes`, {
                method: "GET",
                headers: {Accept: "application/json"},
                mode: "cors"
            });

            if (!res.ok) {
                return toast.error("No fue posible cargar los exámenes clínicos.");
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend) {
                setListaExamenes(respuestaBackend);
            } else {
                return toast.error("No fue posible obtener la lista de exámenes.");
            }
        } catch (error) {
            return toast.error("Error al cargar exámenes, contacte a soporte.");
        }
    }

    useEffect(() => {
        seleccionarTodosExamenes();
    }, []);

    function agregarExamen(examen) {
        if (!examen?.id_examen) {
            return toast.error("Debe seleccionar un examen válido.");
        }

        const existe = listaExamenesSolicitados.some((item) => item.id_examen === examen.id_examen);

        if (existe) {
            return toast.error("El examen ya fue agregado al documento.");
        }

        setListaExamenesSolicitados((prev) => [...prev, examen]);
        toast.success(`Examen "${examen.nombre_examen}" agregado.`);
    }

    function quitarExamen(idExamen) {
        setListaExamenesSolicitados((prev) => prev.filter((item) => item.id_examen !== idExamen));
    }

    function limpiarDocumento() {
        setNombrePaciente("");
        setRutPaciente("");
        setNombreProfesional("");
        setListaExamenesSolicitados([]);
        setBusquedaExamen("");
        setFechaSolicitud(new Date().toISOString().split("T")[0]);
    }

    const listaExamenesFiltrados = useMemo(() => {
        const termino = busquedaExamen.trim().toLowerCase();

        if (!termino) {
            return listaExamenes;
        }

        return listaExamenes.filter((examen) => {
            const nombre = examen.nombre_examen?.toLowerCase() || "";
            const descripcion = examen.descripcion_examen?.toLowerCase() || "";
            return nombre.includes(termino) || descripcion.includes(termino);
        });
    }, [listaExamenes, busquedaExamen]);

    const totalExamenes = listaExamenesSolicitados.length;
    const totalReferencia = listaExamenesSolicitados.reduce((acc, examen) => acc + Number(examen.valor_examen || 0), 0);

    async function generarDocumentoPDF() {
        if (!nombrePaciente.trim()) {
            return toast.error("Debe ingresar el nombre del paciente.");
        }

        if (!rutPaciente.trim()) {
            return toast.error("Debe ingresar el RUT del paciente.");
        }

        if (!nombreProfesional.trim()) {
            return toast.error("Debe ingresar el nombre del profesional.");
        }

        if (!fechaSolicitud) {
            return toast.error("Debe seleccionar la fecha del documento.");
        }

        if (listaExamenesSolicitados.length === 0) {
            return toast.error("Debe agregar al menos un examen al documento.");
        }

        const doc = new jsPDF("p", "mm", "letter");
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const margin = 18;
        const rightX = pageW - margin;
        const contentLeft = margin + 4;
        const contentRight = rightX - 4;
        const contentWidth = contentRight - contentLeft;
        const columnWidth = contentWidth / 2;

        doc.setDrawColor(45, 45, 45);
        doc.setLineWidth(0.4);
        doc.rect(margin, 14, rightX - margin, pageH - 28);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(25, 25, 25);
        doc.text(EMPRESA_NOMBRE.toUpperCase(), contentLeft, 24);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(90, 90, 90);
        doc.text("Solicitud de examenes clinicos", contentLeft, 29);

        doc.setDrawColor(60, 60, 60);
        doc.setLineWidth(0.6);
        doc.line(contentLeft, 34, contentRight, 34);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 40);
        doc.text("ORDEN DE EXAMENES", contentRight, 22, {align: "right"});

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`Fecha de emision: ${new Date(`${fechaSolicitud}T00:00:00`).toLocaleDateString("es-CL")}`, contentRight, 28, {align: "right"});

        let y = 44;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(95, 95, 95);
        doc.text("DATOS DEL PACIENTE", contentLeft, y);

        doc.setDrawColor(185, 185, 185);
        doc.setLineWidth(0.2);
        doc.line(contentLeft, y + 2, contentRight, y + 2);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.text("Paciente", contentLeft, y + 10);
        doc.text("RUT", contentLeft + 108, y + 10);
        doc.text("Profesional solicitante", contentLeft, y + 21);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(25, 25, 25);
        doc.text(nombrePaciente.trim() || "-", contentLeft, y + 16);
        doc.text(rutPaciente.trim() || "-", contentLeft + 108, y + 16);
        doc.text(nombreProfesional.trim() || "-", contentLeft, y + 27);

        y = 82;

        const rows = [];
        for (let i = 0; i < listaExamenesSolicitados.length; i += 2) {
            const examenIzquierdo = listaExamenesSolicitados[i];
            const examenDerecho = listaExamenesSolicitados[i + 1];

            rows.push([
                examenIzquierdo ? `${i + 1}. ${examenIzquierdo.nombre_examen || "-"}` : "",
                examenDerecho ? `${i + 2}. ${examenDerecho.nombre_examen || "-"}` : ""
            ]);
        }

        autoTable(doc, {
            head: [["Examen solicitado", "Examen solicitado"]],
            body: rows,
            startY: y,
            margin: {left: contentLeft, right: contentLeft},
            theme: "grid",
            headStyles: {
                fillColor: [238, 238, 238],
                textColor: [35, 35, 35],
                fontStyle: "bold",
                fontSize: 8,
                cellPadding: {top: 4, bottom: 4, left: 4, right: 4},
                lineColor: [145, 145, 145],
                lineWidth: 0.2,
            },
            columnStyles: {
                0: {cellWidth: columnWidth},
                1: {cellWidth: columnWidth},
            },
            bodyStyles: {
                fontSize: 8.5,
                textColor: [35, 35, 35],
                cellPadding: {top: 3.5, bottom: 3.5, left: 4, right: 4},
                lineColor: [200, 200, 200],
                lineWidth: 0.15,
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250],
            },
            styles: {
                lineWidth: 0.15,
                overflow: "linebreak",
            },
            tableWidth: contentWidth,
        });

        let finalY = doc.lastAutoTable.finalY + 10;

        doc.setDrawColor(120, 120, 120);
        doc.setLineWidth(0.25);
        doc.line(contentRight - 51, finalY, contentRight, finalY);

        finalY += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(25, 25, 25);
        doc.text("Total examenes:", contentRight - 51, finalY);
        doc.text(String(listaExamenesSolicitados.length), contentRight, finalY, {align: "right"});

        finalY += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(95, 95, 95);
        doc.text("Documento de solicitud clinica", contentRight, finalY, {align: "right"});

        const footerY = pageH - 18;
        const firmaY = Math.min(Math.max(finalY + 22, pageH - 52), footerY - 18);
        doc.setDrawColor(135, 135, 135);
        doc.setLineWidth(0.3);
        doc.line(contentLeft, firmaY, contentLeft + 66, firmaY);
        doc.line(contentRight - 66, firmaY, contentRight, firmaY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(90, 90, 90);
        doc.text("Firma profesional", contentLeft, firmaY + 5);
        doc.text("Recepcion paciente", contentRight, firmaY + 5, {align: "right"});

        doc.setDrawColor(190, 190, 190);
        doc.line(contentLeft, footerY - 5, contentRight, footerY - 5);
        doc.setFontSize(7);
        doc.setTextColor(110, 110, 110);
        doc.text("Documento generado desde AgendaClinica para solicitud interna o entrega al paciente.", contentLeft, footerY);
        doc.text("Examenes clinicos", contentRight, footerY, {align: "right"});

        const nombrePacienteArchivo = `${nombrePaciente || "paciente"}`
            .trim()
            .replace(/\s+/g, "-")
            .toLowerCase();

        doc.save(`solicitud-examenes-${nombrePacienteArchivo || "paciente"}.pdf`);
        toast.success("PDF generado correctamente.");
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.10),_transparent_28%),radial-gradient(circle_at_right,_rgba(6,182,212,0.10),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_55%,_#f8fafc_100%)]">
            <ToasterClient/>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 md:py-10">
                <div className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-violet-600">Documentación clínica</p>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                                Solicitud de exámenes
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                Completa los antecedentes clínicos básicos y arma una orden de exámenes con un formato sobrio, legible y adecuado para entrega hospitalaria.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Catálogo</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{listaExamenes.length}</p>
                            </div>
                            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Paciente</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{nombrePaciente.trim() || "-"}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Seleccionados</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{totalExamenes}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                    <div className="space-y-6 xl:col-span-2">
                        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
                                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Datos del documento</h2>
                            </div>

                            <div className="space-y-5 p-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Nombre del paciente</label>
                                    <ShadcnInput
                                        value={nombrePaciente}
                                        placeholder="Ej: Juan Pérez González"
                                        onChange={(e) => setNombrePaciente(e.target.value)}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">RUT del paciente</label>
                                    <ShadcnInput
                                        value={rutPaciente}
                                        placeholder="Ej: 12.345.678-9"
                                        onChange={(e) => setRutPaciente(e.target.value)}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Nombre del profesional</label>
                                    <ShadcnInput
                                        value={nombreProfesional}
                                        placeholder="Ej: Dra. María González"
                                        onChange={(e) => setNombreProfesional(e.target.value)}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Fecha del documento</label>
                                    <input
                                        type="date"
                                        value={fechaSolicitud}
                                        onChange={(e) => setFechaSolicitud(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={generarDocumentoPDF}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(79,70,229,0.28)] transition-all duration-150 hover:from-violet-700 hover:to-indigo-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 8l-3-3m3 3l3-3M4 19h16"/>
                                        </svg>
                                        Generar PDF
                                    </button>
                                    <button
                                        type="button"
                                        onClick={limpiarDocumento}
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-150 hover:border-slate-300 hover:bg-slate-100"
                                    >
                                        Limpiar
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(49,46,129,0.95)_100%)] px-5 py-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-200">Paciente</p>
                                        <h2 className="text-lg font-bold text-white">Resumen del documento</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:col-span-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Nombre completo</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {nombrePaciente.trim() || "-"}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Rut</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{rutPaciente.trim() || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Profesional</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{nombreProfesional.trim() || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Fecha solicitud</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {fechaSolicitud ? new Date(`${fechaSolicitud}T00:00:00`).toLocaleDateString("es-CL") : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 xl:col-span-3">
                        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Catálogo de exámenes</h2>
                                        <p className="mt-1 text-xs text-slate-500">Selecciona los exámenes que aparecerán en la orden clínica.</p>
                                    </div>
                                    <div className="w-full md:w-72">
                                        <ShadcnInput
                                            value={busquedaExamen}
                                            placeholder="Buscar examen o descripción"
                                            onChange={(e) => setBusquedaExamen(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="max-h-[420px] space-y-3 overflow-y-auto p-5">
                                {listaExamenesFiltrados.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-sm text-slate-500">
                                        No se encontraron exámenes con ese criterio.
                                    </div>
                                ) : (
                                    listaExamenesFiltrados.map((examen) => {
                                        const yaAgregado = listaExamenesSolicitados.some((item) => item.id_examen === examen.id_examen);

                                        return (
                                            <div
                                                key={examen.id_examen}
                                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-150 hover:border-sky-200 hover:bg-sky-50/20"
                                            >
                                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                    <div className="space-y-1">
                                                        <p className="text-base font-semibold text-slate-900">{examen.nombre_examen}</p>
                                                        <p className="text-sm leading-relaxed text-slate-600">
                                                            {examen.descripcion_examen || "Sin descripción registrada."}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-2 pt-1">
                                                            <span className="inline-flex items-center rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                                                                Ref. {formatoCLP.format(Number(examen.valor_examen || 0))}
                                                            </span>
                                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                                ID {examen.id_examen}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => agregarExamen(examen)}
                                                        disabled={yaAgregado}
                                                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 ${
                                                            yaAgregado
                                                                ? "cursor-not-allowed border border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                                                        }`}
                                                    >
                                                        {yaAgregado ? "Agregado" : "Agregar al documento"}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(8,145,178,0.94)_100%)] px-5 py-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-100">Documento armado</p>
                                        <h2 className="text-lg font-bold text-white">Exámenes seleccionados</h2>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                                            {totalExamenes} exámenes
                                        </span>
                                        <span className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
                                            Ref. {formatoCLP.format(totalReferencia)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 p-5">
                                {listaExamenesSolicitados.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-sm text-slate-500">
                                        Aún no hay exámenes agregados al documento.
                                    </div>
                                ) : (
                                    listaExamenesSolicitados.map((examen, index) => (
                                        <div
                                            key={examen.id_examen}
                                            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:flex-row md:items-start md:justify-between"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                                                    {index + 1}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-slate-900">{examen.nombre_examen}</p>
                                                    <p className="text-sm text-slate-600">{examen.descripcion_examen || "Sin descripción registrada."}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                                    {formatoCLP.format(Number(examen.valor_examen || 0))}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => quitarExamen(examen.id_examen)}
                                                    className="inline-flex items-center rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition-colors duration-150 hover:bg-rose-100"
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}

                                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                    <button
                                        type="button"
                                        onClick={generarDocumentoPDF}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:from-sky-700 hover:to-cyan-600"
                                    >
                                        Generar documento PDF
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setListaExamenesSolicitados([])}
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-slate-50"
                                    >
                                        Vaciar selección
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
