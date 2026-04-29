
'use client'
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import jsPDF from "jspdf";
import ToasterClient from "@/Componentes/ToasterClient";
import formatearFecha from "@/FuncionesTranversales/funcionesTranversales";
import {InfoButton} from "@/Componentes/InfoButton";
import ShadcnInput from "@/Componentes/shadcnInput2";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

export default function ReecetasPacientes() {

    const router = useRouter();
    const API = process.env.NEXT_PUBLIC_API_URL;
    const EMPRESA_NOMBRE = process.env.NEXT_PUBLIC_EMPRESA_NOMBRE || "AgendaClinica";

    const [detallePaciente, setDetallePaciente] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [uiOnlyProfesionalSeleccionado, setUiOnlyProfesionalSeleccionado] = useState("");


    const [listaProfesionales, setListaProfesionales] = useState([]);

    const {id_paciente} = useParams();
    const[nombre_paciente, setNombre_paciente] = useState("");
    const[apellido_paciente, setApellido_paciente] = useState("");
    const[rut_paciente, setRut_paciente] = useState("");
    const[id_profesional, setId_profesional] = useState(null);
    const[profesional_responsable, setProfesional_responsable] = useState("");
    const[rut_profesional_manual, setRut_profesional_manual] = useState("");
    const[descripcion_receta, setDescripcion_receta] = useState("");
    const[diagnostico_pdf, setDiagnostico_pdf] = useState("");

    const [listaRecetasPaciente, setListaRecetasPaciente] = useState([]);
    const[id_receta, setId_receta] = useState(null);


    const [id_profesional_filtro, setId_profesional_filtro] = useState("todas");



    async function buscarPacientePorId(idPaciente) {
        try {
            if (!idPaciente) {
                return toast.error("No se puede cargar el paciente seleccionado.");
            }

            setCargando(true);

            const res = await fetch(`${API}/pacientes/pacientesEspecifico`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_paciente: idPaciente})
            });

            if (!res.ok) {
                return toast.error("No se pudo cargar la información del paciente.");
            }

            const dataPaciente = await res.json();
            if (Array.isArray(dataPaciente)&&dataPaciente.length > 0) {
                setDetallePaciente(dataPaciente);
                setNombre_paciente(dataPaciente[0].nombre);
                setApellido_paciente(dataPaciente[0].apellido);
                setRut_paciente(dataPaciente[0].rut);
            }else{
                setDetallePaciente([]);
                setNombre_paciente("");
                setApellido_paciente("");
                setRut_paciente("");
            }

        } catch (error) {
            console.log(error);
            return toast.error("Ha ocurrido un problema al obtener los datos del paciente.");
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        if (!id_paciente) return;
        buscarPacientePorId(id_paciente);
    }, [id_paciente]);

    function calcularEdad(fechaNacimiento) {
        if (!fechaNacimiento) return "-";
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
        if (id_prevision === 1) return "NO APLICA";
        if (id_prevision === 2) return "ISAPRE";
        return "SIN DEFINIR";
    }

    function volverAFichas() {
        router.push(`/dashboard/FichasPacientes/${id_paciente}`);
    }

    const paciente = detallePaciente[0];
    const profesionalSeleccionado = listaProfesionales.find(
        (profesional) => String(profesional.id_profesional) === String(uiOnlyProfesionalSeleccionado || id_profesional || "")
    );

    function normalizarTextoPDF(valor, fallback = "-") {
        return String(valor ?? "").trim() || fallback;
    }

    function formatearFechaDocumento(fecha = new Date()) {
        return fecha.toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    function sanitizarNombreArchivo(valor) {
        return String(valor ?? "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");
    }

    function generarPDFReceta() {
        if (!paciente) {
            return toast.error("Debe existir un paciente cargado para generar la receta.");
        }

        if (!profesional_responsable.trim()) {
            return toast.error("Debe seleccionar un profesional para generar la receta.");
        }

        if (!descripcion_receta.trim()) {
            return toast.error("Debe ingresar la descripción de la receta para generar el PDF.");
        }

        const doc = new jsPDF("p", "mm", "letter");
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const margin = 18;
        const rightX = pageW - margin;
        const anchoContenido = rightX - margin;
        const fechaEmision = new Date();
        const rutPacienteArchivo = sanitizarNombreArchivo(rut_paciente || paciente?.rut || id_paciente || "paciente");
        const nombreProfesionalPDF = normalizarTextoPDF(profesional_responsable);
        const especialidadProfesionalPDF = normalizarTextoPDF(
            profesionalSeleccionado?.descripcionProfesional || profesionalSeleccionado?.especialidad,
            "Profesional tratante"
        );
        const rutProfesionalPDF = normalizarTextoPDF(
            rut_profesional_manual || profesionalSeleccionado?.rutProfesional || profesionalSeleccionado?.rut_profesional
        );
        const diagnosticoPDF = diagnostico_pdf.trim();

        try {
            const footerY = pageH - 12;
            const limiteContenidoY = pageH - 34;
            const lineHeight = 6.6;

            const dibujarEncabezado = () => {
                doc.setDrawColor(15, 23, 42);
                doc.setLineWidth(0.6);
                doc.line(margin, 18, rightX, 18);

                doc.setFont("helvetica", "bold");
                doc.setFontSize(18);
                doc.setTextColor(15, 23, 42);
                doc.text("Receta medica", margin, 28);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(8.5);
                doc.setTextColor(71, 85, 105);
                doc.text(EMPRESA_NOMBRE, margin, 34);
                doc.text(`Fecha de emision: ${formatearFechaDocumento(fechaEmision)}`, rightX, 28, {align: "right"});
                doc.text("Documento clinico", rightX, 34, {align: "right"});
            };

            const dibujarPie = () => {
                doc.setDrawColor(203, 213, 225);
                doc.setLineWidth(0.3);
                doc.line(margin, footerY - 6, rightX, footerY - 6);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(7.5);
                doc.setTextColor(148, 163, 184);
                doc.text("Documento clínico generado desde el panel de receta de pacientes.", margin, footerY - 1);
                doc.text(`Paciente: ${normalizarTextoPDF(rut_paciente)}`, rightX, footerY - 1, {align: "right"});
                doc.setFontSize(6.5);
                doc.setTextColor(190, 198, 210);
                doc.text("AgendaClinica", margin, footerY + 4);
                doc.text("Healthcare Information System", margin, footerY + 7.5);
            };

            dibujarEncabezado();

            let y = 48;

            const altoBoxClinico = diagnosticoPDF ? 67 : 54;

            doc.setDrawColor(203, 213, 225);
            doc.setLineWidth(0.35);
            doc.roundedRect(margin, y, anchoContenido, altoBoxClinico, 1.8, 1.8);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(15, 23, 42);
            doc.text("Identificacion clinica", margin + 4, y + 7);

            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.25);
            doc.line(margin + 4, y + 11, rightX - 4, y + 11);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.2);
            doc.setTextColor(100, 116, 139);
            doc.text("PACIENTE", margin + 4, y + 18);
            doc.text("RUT PACIENTE", margin + 74, y + 18);
            doc.text("PROFESIONAL", margin + 4, y + 31);
            doc.text("RUT PROFESIONAL", margin + 74, y + 31);
            doc.text("ESPECIALIDAD / CARGO", margin + 130, y + 31);
            doc.text("NACIMIENTO", margin + 4, y + 44);
            doc.text("EDAD", margin + 74, y + 44);
            doc.text("PREVISION", margin + 130, y + 44);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.4);
            doc.setTextColor(15, 23, 42);
            doc.text(normalizarTextoPDF(`${nombre_paciente} ${apellido_paciente}`), margin + 4, y + 23);
            doc.text(normalizarTextoPDF(rut_paciente), margin + 74, y + 23);
            doc.text(nombreProfesionalPDF, margin + 4, y + 36);
            doc.text(rutProfesionalPDF, margin + 74, y + 36);
            doc.text(doc.splitTextToSize(especialidadProfesionalPDF, 58), margin + 130, y + 36, {lineHeightFactor: 1.3});
            doc.text(normalizarTextoPDF(formatearFecha(paciente?.nacimiento)), margin + 4, y + 49);
            doc.text(`${calcularEdad(paciente?.nacimiento)} anos`, margin + 74, y + 49);
            doc.text(normalizarTextoPDF(previsionDeterminacion(paciente?.prevision_id)), margin + 130, y + 49);

            if (diagnosticoPDF) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(7.2);
                doc.setTextColor(100, 116, 139);
                doc.text("DIAGNOSTICO", margin + 4, y + 57);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(9.4);
                doc.setTextColor(15, 23, 42);
                doc.text(doc.splitTextToSize(diagnosticoPDF, anchoContenido - 12), margin + 4, y + 62);
            }

            y += altoBoxClinico + 7;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(15, 23, 42);
            doc.text("Indicaciones medicas", margin, y);

            y += 6;

            const lineasReceta = doc.splitTextToSize(descripcion_receta.trim(), anchoContenido - 10);
            let indiceLinea = 0;
            let primeraPaginaTexto = true;

            while (indiceLinea < lineasReceta.length) {
                const alturaDisponible = limiteContenidoY - y;
                const lineasPorPagina = Math.max(1, Math.floor((alturaDisponible - 10) / lineHeight));
                const bloque = lineasReceta.slice(indiceLinea, indiceLinea + lineasPorPagina);
                const altoBloque = Math.max(20, (bloque.length * lineHeight) + 8);

                doc.setDrawColor(203, 213, 225);
                doc.setLineWidth(0.35);
                doc.roundedRect(margin, y, anchoContenido, altoBloque, 1.8, 1.8);

                doc.setFont("times", "normal");
                doc.setFontSize(12);
                doc.setTextColor(15, 23, 42);
                doc.text(bloque, margin + 5, y + 8, {
                    maxWidth: anchoContenido - 10,
                    lineHeightFactor: 1.45
                });

                indiceLinea += bloque.length;
                y += altoBloque + 10;

                if (indiceLinea < lineasReceta.length) {
                    dibujarPie();
                    doc.addPage();
                    dibujarEncabezado();
                    y = 48;

                    if (primeraPaginaTexto) {
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(9);
                        doc.setTextColor(15, 23, 42);
                        doc.text("Indicaciones medicas (continuacion)", margin, y);
                        y += 6;
                        primeraPaginaTexto = false;
                    } else {
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(9);
                        doc.setTextColor(15, 23, 42);
                        doc.text("Continuacion de receta", margin, y);
                        y += 6;
                    }
                }
            }

            if (y + 24 > limiteContenidoY) {
                dibujarPie();
                doc.addPage();
                dibujarEncabezado();
                y = 48;
            }

            doc.setDrawColor(148, 163, 184);
            doc.setLineWidth(0.35);
            doc.line(rightX - 62, y + 10, rightX, y + 10);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);
            doc.text(nombreProfesionalPDF, rightX, y + 16, {align: "right"});
            doc.text(especialidadProfesionalPDF, rightX, y + 21, {align: "right"});
            doc.text("Firma y timbre profesional", rightX, y + 26, {align: "right"});

            dibujarPie();

            doc.save(`receta_medica_${rutPacienteArchivo || "paciente"}.pdf`);
            toast.success("PDF de receta generado correctamente.");
        } catch (error) {
            console.log(error);
            return toast.error("No fue posible generar la receta en PDF.");
        }
    }



    async function insertarFichasPaciente(
        nombre_paciente,
        apellido_paciente,
        rut_paciente,
        id_paciente,
        id_profesional,
        profesional_responsable,
        descripcion_receta
    ) {
        try {

            if (!nombre_paciente || !apellido_paciente ||  !rut_paciente ||  !id_paciente ||  !id_profesional || !profesional_responsable || !descripcion_receta) {
                return toast.error("Debe ingresar todos los datos!");
            }

            const res = await fetch(`${API}/recetas/insertarRecetaPaciente`,{
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    nombre_paciente,
                    apellido_paciente,
                    rut_paciente,
                    id_paciente,
                    id_profesional,
                    profesional_responsable,
                    descripcion_receta
                }),
                mode: "cors",
            })

            const respuestaBackend = await res.json();
            if (respuestaBackend.message === true) {
                await seleccionarRecetasPaciente(id_paciente);
                return toast.success(`Se ha ingresado receta correctamente`);
            }else if (respuestaBackend.message.includes(`sindato`)){
                return toast.error('No se ha enviado toda la informacion al servidor')
            }else if (respuestaBackend.message === false){
                return toast.error('Sin respuesta correcta del servidor')
            }else{
                return toast.error(`Ha ocurrido un error, por favor contacte a soporte`);
            }
        }catch (error) {
            return toast.error(`Ha ocurrido un error en el servidor por favor contacte a soporte`);
        }
    }


    async function listarProfesionales() {
        try {
            const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`,{
                method: "GET",
                headers: {Accept: "application/json"},
                mode: "cors"
            });

            const respuestaBackend = await res.json();
            if(Array.isArray(respuestaBackend)&&respuestaBackend.length>0) {
                setListaProfesionales(respuestaBackend);
            }

        }catch (error) {
            return toast.error(`Ha ocurrido un error en el servidor por favor contacte a soporte`);
        }
    }

    useEffect(() => {
        listarProfesionales()
    },[])



    async function seleccionarRecetasPaciente(
        id_paciente
    ) {
        try {

            const res = await fetch(`${API}/recetas/seleccionar_todas_Recetas_especificas_pacientes`,{
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    id_paciente
                }),
                mode: "cors",
            })

            const respuestaBackend = await res.json();
            if (Array.isArray(respuestaBackend)) {
                setListaRecetasPaciente(respuestaBackend);
            }
        }catch (error) {
            return toast.error(`Ha ocurrido un error en el servidor por favor contacte a soporte`);
        }
    }


    useEffect(() => {
        seleccionarRecetasPaciente(id_paciente)
    },[id_paciente])




    async function seleccionarRecetaEspecifica(
        id_receta
    ) {
        try {


            const res = await fetch(`${API}/recetas/seleccionarRecetaPaciente`,{
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    id_receta
                }),
                mode: "cors",
            })

            const respuestaBackend = await res.json();
            if (Array.isArray(respuestaBackend)&&respuestaBackend.length>0) {
                setNombre_paciente(respuestaBackend[0].nombre_paciente);
                setApellido_paciente(respuestaBackend[0].apellido_paciente);
                setRut_paciente(respuestaBackend[0].rut_paciente);
                setId_profesional(respuestaBackend[0].id_profesional);
                setUiOnlyProfesionalSeleccionado(String(respuestaBackend[0].id_profesional));
                setProfesional_responsable(respuestaBackend[0].profesional_responsable);
                setDescripcion_receta(respuestaBackend[0].descripcion_receta);
                setId_receta(respuestaBackend[0].id_receta);
                return toast.success(`Receta seleccionada para edicion!`);
            }else{
                return toast.error(`No se ha podido seleccionar recete para edicion`);
            }
        }catch (error) {
            return toast.error(`Ha ocurrido un error en el servidor por favor contacte a soporte`);
        }
    }



    async function eliminarReceta(
        id_receta
    ) {
        try {

            if (!id_receta) {
                return toast.error("Debe seleccionar al menos una receta para eliminar.");
            }

            const res = await fetch(`${API}/recetas/eliminarRecetaPaciente`,{
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    id_receta
                }),
                mode: "cors",
            })

            const respuestaBackend = await res.json();
            if (respuestaBackend.message === true) {
                await limpiarFormulario();
            }else{
                return toast.error(`No se ha podido eliminar receta, contacte a soporte`);
            }
        }catch (error) {
            return toast.error(`Ha ocurrido un error en el servidor por favor contacte a soporte`);
        }
    }

    function formatearFechaHora(fechaIso) {
        if (!fechaIso) return "-";

        const fecha = new Date(fechaIso);

        const dia = String(fecha.getDate()).padStart(2, "0");
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const anio = fecha.getFullYear();

        return `${dia}/${mes}/${anio}`;
    }

    async function limpiarFormulario() {
        setId_profesional(null);
        setId_receta(null);
        setProfesional_responsable("");
        setRut_profesional_manual("");
        setDescripcion_receta("");
        setDiagnostico_pdf("");
        setUiOnlyProfesionalSeleccionado("");
        await seleccionarRecetasPaciente(id_paciente);
        return toast.success(`Informacion Actualizada!`);
    }


    async function actualizarReceta_especifica_paciente(
        nombre_paciente,
        apellido_paciente,
        rut_paciente,
        id_paciente,
        id_profesional,
        profesional_responsable,
        descripcion_receta,
        id_receta
    ) {
        try {

            if (!nombre_paciente || !apellido_paciente ||  !rut_paciente ||  !id_paciente ||  !id_profesional || !profesional_responsable || !descripcion_receta || !id_receta) {
                return toast.error("Debe seleccionar al menos una receta, y completar los campos para poder editarla correctamente!");
            }

            const res = await fetch(`${API}/recetas/actualizarRecetaPaciente`,{
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    nombre_paciente,
                    apellido_paciente,
                    rut_paciente,
                    id_paciente,
                    id_profesional,
                    profesional_responsable,
                    descripcion_receta,
                    id_receta
                }),
                mode: "cors",
            })

            const respuestaBackend = await res.json();
            if (respuestaBackend.message === true) {
                await seleccionarRecetasPaciente(id_paciente);
                return toast.success(`Se ha actualizado la informacion correctamente!`);
            }else if (respuestaBackend.message.includes(`sindato`)){
                return toast.error('No se ha ingresado correctamente toda la informacion, por favor complete todos los campos! ');
            }else if (respuestaBackend.message === false){
                return toast.error('Sin respuesta correcta del servidor, contacte a soporte.')
            }else{
                return toast.error(`Ha ocurrido un error, por favor contacte a soporte`);
            }
        }catch (error) {
            return toast.error(`Ha ocurrido un error en el servidor por favor contacte a soporte`);
        }
    }








    async function filtrar_receta_por_profesional(
        id_profesional,
        id_paciente,
    ) {
        try {

            const res = await fetch(`${API}/recetas/seleccionar_por_profesional_id`,{
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    id_profesional,
                    id_paciente,
                }),
                mode: "cors",
            })

            const respuestaBackend = await res.json();
            if (Array.isArray(respuestaBackend)&&respuestaBackend.length > 0) {
                setListaRecetasPaciente(respuestaBackend);
                return toast.success(`Recetas emitidas por el profesional encontradas para el paciente`);
            }else{
                await seleccionarRecetasPaciente(id_paciente);
            }
        }catch (error) {
            return toast.error(`Ha ocurrido un error en el servidor por favor contacte a soporte`);
        }
    }

    useEffect(() => {
        if (id_profesional_filtro === "todas" || !id_paciente) {
            seleccionarRecetasPaciente(id_paciente);
            return;
        }

        filtrar_receta_por_profesional(Number(id_profesional_filtro), id_paciente);
    }, [id_profesional_filtro, id_paciente]);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.10),_transparent_28%),radial-gradient(circle_at_right,_rgba(6,182,212,0.10),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_55%,_#f8fafc_100%)]">
            <ToasterClient/>

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 md:py-10">
                <div className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-violet-600">Emisión de receta</p>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                                Receta médica para {paciente ? `${paciente.nombre} ${paciente.apellido}` : "paciente"}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-600">
                                Vista previa del paciente antes de generar o completar la receta clínica.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Paciente</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {paciente ? `${paciente.nombre} ${paciente.apellido}` : "Cargando..."}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Rut</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{paciente?.rut || "-"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <InfoButton informacion={"En esta vista se muestran los datos base del paciente para preparar la receta médica. Puede usar esta información como contexto previo antes de completar la emisión del documento."}/>
                            <span className="text-sm text-slate-500">Resumen clínico previo a la receta</span>
                        </div>
                        <button
                            onClick={volverAFichas}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-150 hover:border-slate-300 hover:bg-slate-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                            Volver a fichas
                        </button>
                    </div>
                </div>

                {cargando ? (
                    <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
                        Cargando datos del paciente...
                    </div>
                ) : !paciente ? (
                    <div className="rounded-[28px] border border-dashed border-rose-200 bg-white p-10 text-center text-sm text-rose-500 shadow-sm">
                        No fue posible encontrar información del paciente.
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                            <div className="flex flex-col gap-4 bg-[linear-gradient(135deg,#0f172a_0%,#312e81_58%,#0891b2_100%)] px-5 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-sm font-bold tracking-wide text-white backdrop-blur-sm">
                                        {paciente.nombre?.charAt(0)}{paciente.apellido?.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight text-white">
                                            {paciente.nombre} {paciente.apellido}
                                        </h2>
                                        <p className="text-sm text-slate-200">Preparación de receta individual</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                                        Previsión: {previsionDeterminacion(paciente.prevision_id)}
                                    </span>
                                    <span className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
                                        Edad: {calcularEdad(paciente.nacimiento)} años
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2 md:p-6 xl:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Nombre completo</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.nombre} {paciente.apellido}</p>
                                </div>
                                <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Rut</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.rut || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Nacimiento</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{formatearFecha(paciente.nacimiento)}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Sexo</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.sexo || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Teléfono</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.telefono || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Correo</p>
                                    <p className="mt-1 break-all text-sm font-semibold text-slate-900">{paciente.correo || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2 xl:col-span-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Dirección</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.direccion || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">País</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.pais || "-"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                            <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(49,46,129,0.95)_100%)] px-5 py-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-200">Formulario</p>
                                        <h2 className="text-xl font-bold text-white">Redacción de receta médica</h2>
                                    </div>
                                    <span className="inline-flex w-fit items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
                                        Registro de Recta
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 p-5 md:p-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.85fr)]">
                                <div className="space-y-5">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                                        <p className="mb-2 text-xs font-semibold text-slate-700">Profesional que emite la receta</p>
                                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                                            <div>
                                                <label className="mb-1 block text-[11px] font-medium text-slate-500">Profesional</label>
                                                <Select
                                                    value={uiOnlyProfesionalSeleccionado}
                                                    onValueChange={(value) => {
                                                        setUiOnlyProfesionalSeleccionado(value);
                                                        const profesionalEncontrado = listaProfesionales.find(
                                                            (profesional) => String(profesional.id_profesional) === value
                                                        );
                                                        setId_profesional(Number(value));
                                                        setProfesional_responsable(profesionalEncontrado?.nombreProfesional || "");
                                                    }}
                                                >
                                                    <SelectTrigger className="h-9 w-full rounded-xl border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-none">
                                                        <SelectValue placeholder="Selecciona un profesional" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-slate-200 bg-white">
                                                        {listaProfesionales.map((profesional) => (
                                                            <SelectItem
                                                                key={profesional.id_profesional}
                                                                value={String(profesional.id_profesional)}
                                                                className="rounded-lg py-2"
                                                            >
                                                                <span className="font-medium text-slate-900">{profesional.nombreProfesional}</span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-[11px] font-medium text-slate-500">RUT profesional</label>
                                                <ShadcnInput
                                                    value={rut_profesional_manual}
                                                    onChange={(event) => setRut_profesional_manual(event.target.value)}
                                                    placeholder="RUT para el PDF"
                                                    className="h-9 rounded-xl border-slate-200 bg-white px-3 shadow-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-[11px] font-medium text-slate-500">Diagnóstico</label>
                                                <ShadcnInput
                                                    value={diagnostico_pdf}
                                                    onChange={(event) => setDiagnostico_pdf(event.target.value)}
                                                    placeholder="Diagnóstico para el PDF"
                                                    className="h-9 rounded-xl border-slate-200 bg-white px-3 shadow-none"
                                                />
                                            </div>
                                        </div>
                                        <p className="mt-1.5 text-[11px] text-slate-400">RUT y diagnóstico son opcionales, solo se usan en el PDF.</p>
                                    </div>

                                    <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Descripción</p>
                                                <h3 className="mt-1 text-lg font-bold text-slate-900">Indicaciones y contenido de la receta</h3>
                                            </div>
                                            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                                                Texto clínico
                                            </span>
                                        </div>

                                        <div className="mt-5 space-y-3">
                                            <label className="block text-sm font-semibold text-slate-700">
                                                Descripción de la receta
                                            </label>
                                            <Textarea
                                                value={descripcion_receta}
                                                onChange={(event) => setDescripcion_receta(event.target.value)}
                                                placeholder="Ej: Administrar paracetamol 500 mg cada 8 horas por 5 días. Mantener reposo, hidratación y control en caso de persistencia de síntomas."
                                                className="min-h-[220px] resize-none rounded-[24px] border-slate-200 bg-slate-50/70 px-4 py-3 text-sm leading-7 text-slate-900 shadow-none focus-visible:ring-slate-200"
                                            />
                                            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                                                <span>{descripcion_receta.trim().length} caracteres</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="overflow-hidden rounded-[24px] border border-violet-200 bg-[linear-gradient(180deg,rgba(245,243,255,0.9)_0%,rgba(255,255,255,0.96)_100%)]">
                                        <div className="border-b border-violet-100 px-5 py-4">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Resumen visual</p>
                                            <h3 className="mt-1 text-lg font-bold text-slate-900">Datos listos para la emisión</h3>
                                        </div>

                                        <div className="space-y-3 p-5">
                                            <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Paciente</p>
                                                <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.nombre} {paciente.apellido}</p>
                                            </div>
                                            <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Profesional</p>
                                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                                    {profesional_responsable|| "Pendiente"}
                                                </p>
                                            </div>
                                            {diagnostico_pdf.trim() && (
                                                <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Diagnóstico PDF</p>
                                                    <p className="mt-1 text-sm font-semibold text-slate-900">{diagnostico_pdf}</p>
                                                </div>
                                            )}
                                            <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Vista previa del texto</p>
                                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                                                    {descripcion_receta || "La descripción de la receta aparecerá aquí para revisar la composición visual del contenido."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 p-5">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Estado del formulario</p>
                                        <div className="mt-3 space-y-3">
                                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                                                <span>Selección de profesional</span>
                                                <span className="font-semibold text-slate-900">
                                                    {profesional_responsable ? "Completo" : "Pendiente"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                                                <span>Descripción clínica</span>
                                                <span className="font-semibold text-slate-900">
                                                    {descripcion_receta.trim() ? "Completa" : "Pendiente"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 border-t border-slate-100 px-5 py-4 md:px-6">
                                <button
                                    onClick={volverAFichas}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-150 hover:border-slate-300 hover:bg-slate-100"
                                >
                                    Volver al historial
                                </button>
                                <button
                                    onClick={()=> insertarFichasPaciente(
                                        nombre_paciente,
                                        apellido_paciente,
                                        rut_paciente,
                                        id_paciente,
                                        id_profesional,
                                        profesional_responsable,
                                        descripcion_receta
                                    )}
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(79,70,229,0.28)] transition-all duration-150 hover:from-violet-700 hover:to-indigo-700"
                                >
                                    Guardar receta
                                </button>
                                <button
                                    onClick={generarPDFReceta}
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-slate-800"
                                >
                                    Descargar PDF
                                </button>
                                <button
                                    onClick={()=> actualizarReceta_especifica_paciente(
                                        nombre_paciente,
                                        apellido_paciente,
                                        rut_paciente,
                                        id_paciente,
                                        id_profesional,
                                        profesional_responsable,
                                        descripcion_receta,
                                        id_receta
                                    )}
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition-all duration-150 hover:border-cyan-300 hover:bg-cyan-100"
                                >
                                    Actualizar
                                </button>
                                <button
                                    onClick={()=>eliminarReceta(
                                        id_receta
                                    )}
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition-all duration-150 hover:border-rose-300 hover:bg-rose-100"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                            <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(248,250,252,0.96)_0%,rgba(238,242,255,0.96)_100%)] px-5 py-4 md:px-6">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Recetas registradas</h2>
                                    </div>

                                    <div className="w-full lg:max-w-xs">
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                            Filtrar por profesional
                                        </label>
                                        <Select
                                            value={id_profesional_filtro}
                                            onValueChange={(value)=> setId_profesional_filtro(value)}
                                        >
                                            <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-none">
                                                <SelectValue placeholder="Selecciona un filtro" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-slate-200 bg-white">
                                                <SelectItem value="todas" className="rounded-xl py-2.5">Todas las recetas</SelectItem>
                                                {listaProfesionales.map((profesional) => (
                                                    <SelectItem
                                                        key={`filtro-${profesional.id_profesional}`}
                                                        value={String(profesional.id_profesional)}
                                                        className="rounded-xl py-2.5"
                                                    >
                                                        {profesional.nombreProfesional}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 md:p-6">
                                <div className="overflow-hidden rounded-[24px] border border-slate-200">
                                    <Table className="min-w-[760px] bg-white">
                                        <TableHeader className="bg-[linear-gradient(135deg,#0f172a_0%,#312e81_60%,#0891b2_100%)]">
                                            <TableRow className="border-0 hover:bg-transparent">
                                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white">Fecha</TableHead>
                                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white">Paciente</TableHead>
                                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white">Profesional</TableHead>
                                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white">Descripción</TableHead>
                                                <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-white">Acción</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {listaRecetasPaciente.map((receta) => (
                                                <TableRow key={receta.id_receta} className="border-slate-100 bg-white hover:bg-slate-50/80">
                                                    <TableCell className="px-4 py-4 text-sm font-medium text-slate-700">
                                                        {formatearFechaHora(receta.fecha_receta)}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-4 text-sm font-semibold text-slate-900">
                                                        {`${receta.nombre_paciente}  ${receta.apellido_paciente}`}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-4 text-sm text-slate-700">
                                                        {receta.profesional_responsable}
                                                    </TableCell>
                                                    <TableCell className="max-w-[420px] px-4 py-4 text-sm leading-6 whitespace-normal text-slate-600">
                                                        {receta.descripcion_receta}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-4 text-right">
                                                        <button
                                                            onClick={()=> seleccionarRecetaEspecifica(
                                                                receta.id_receta
                                                            ) }
                                                            type="button"
                                                            className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 transition-all duration-150 hover:border-violet-300 hover:bg-violet-100"
                                                        >
                                                            Seleccionar
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3 text-xs text-slate-500">
                                    <span>
                                        Filtro visual activo: {id_profesional_filtro === "todas"
                                        ? "Todas las recetas"
                                        : listaProfesionales.find(
                                        (profesional) => String(profesional.id_profesional) === String(id_profesional_filtro)
                                    )?.nombreProfesional || "Profesional no encontrado"}
                                    </span>
                                    <span>{listaRecetasPaciente.length} registros en pantalla</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
