export const FICHA_CATEGORIAS = [
    { value: "CITA_MEDICA", label: "Cita Médica" },
    { value: "EVALUACION_KINESIOLOGIA", label: "Evaluación de Kinesiología" },
    { value: "EVALUACION_PODOLOGIA", label: "Evaluación de Podología" },
    { value: "EVOLUCION_CONTROL", label: "Evolución y Control" },
];

export const FICHA_CAMPOS = {
    CITA_MEDICA: [
        { key: "motivo_consulta", label: "Motivo de consulta", type: "textarea" },
        { key: "examen_clinico", label: "Examen clínico", type: "textarea" },
        { key: "examen_fisico", label: "Examen físico", type: "textarea" },
        { key: "examen_mental", label: "Examen mental", type: "textarea" },
        { key: "conclusiones_diagnosticas", label: "Conclusiones diagnósticas", type: "textarea" },
        { key: "indicaciones", label: "Indicaciones", type: "textarea" },
        { key: "derivacion", label: "Derivación", type: "textarea" },
        { key: "observacion_general", label: "Observación general", type: "textarea" },
        { key: "nombre_medico", label: "Nombre del médico", type: "input" },
    ],
    EVALUACION_KINESIOLOGIA: [
        { key: "motivo_consulta", label: "Motivo de consulta", type: "textarea" },
        { key: "examen_clinico_fisico", label: "Examen clínico y físico", type: "textarea" },
        { key: "evaluacion_dolor", label: "Evaluación del dolor", type: "textarea" },
        { key: "evaluacion_fisica", label: "Evaluación física", type: "textarea" },
        { key: "evaluacion_cognitiva", label: "Evaluación cognitiva", type: "textarea" },
        { key: "limitaciones", label: "Limitaciones", type: "textarea" },
        { key: "restricciones", label: "Restricciones", type: "textarea" },
        { key: "diagnostico_kinesico", label: "Diagnóstico kinésico", type: "textarea" },
        { key: "objetivo_terapia", label: "Objetivo de la terapia", type: "textarea" },
        { key: "derivacion", label: "Derivación", type: "textarea" },
        { key: "nombre_profesional", label: "Nombre del profesional", type: "input" },
    ],
    EVALUACION_PODOLOGIA: [
        { key: "motivo_consulta", label: "Motivo de consulta", type: "textarea" },
        { key: "morfologia_podalica", label: "Morfología podálica", type: "textarea" },
        { key: "tipo_pie", label: "Tipo de pie", type: "input" },
        { key: "pie_derecho_reflejos", label: "Pie derecho: Reflejos", type: "textarea" },
        { key: "pie_derecho_sensibilidad", label: "Pie derecho: Sensibilidad", type: "textarea" },
        { key: "pie_derecho_pulso_pedio", label: "Pie derecho: Pulso pedio", type: "textarea" },
        { key: "pie_derecho_observacion", label: "Pie derecho: Observación", type: "textarea" },
        { key: "pie_izquierdo_reflejos", label: "Pie izquierdo: Reflejos", type: "textarea" },
        { key: "pie_izquierdo_sensibilidad", label: "Pie izquierdo: Sensibilidad", type: "textarea" },
        { key: "pie_izquierdo_pulso_pedio", label: "Pie izquierdo: Pulso pedio", type: "textarea" },
        { key: "pie_izquierdo_observacion", label: "Pie izquierdo: Observación", type: "textarea" },
        { key: "plan_tratamiento", label: "Plan de tratamiento", type: "textarea" },
        { key: "derivacion", label: "Derivación", type: "textarea" },
        { key: "nombre_profesional", label: "Nombre del profesional", type: "input" },
    ],
    EVOLUCION_CONTROL: [
        { key: "observaciones", label: "Observaciones", type: "textarea" },
        { key: "tratamiento", label: "Tratamiento", type: "textarea" },
        { key: "indicaciones", label: "Indicaciones", type: "textarea" },
        { key: "derivacion", label: "Derivación", type: "textarea" },
        { key: "nombre_profesional", label: "Nombre del profesional", type: "input" },
    ],
};

export function obtenerLabelCategoria(categoria) {
    return FICHA_CATEGORIAS.find((item) => item.value === categoria)?.label || "Ficha Clínica";
}

export function obtenerDetalleInicial(categoria, valores = {}) {
    const campos = FICHA_CAMPOS[categoria] || [];
    const detalle = {};

    campos.forEach((campo) => {
        detalle[campo.key] = valores[campo.key] || "";
    });

    return detalle;
}

function parseDetalle(detalleFicha) {
    if (!detalleFicha) return {};

    if (typeof detalleFicha === "object") {
        return detalleFicha;
    }

    try {
        return JSON.parse(detalleFicha);
    } catch (error) {
        return {};
    }
}

export function normalizarFichaExistente(ficha) {
    const categoriaFicha = ficha?.categoriaFicha || "CITA_MEDICA";
    const detalleBackend = parseDetalle(ficha?.detalleFicha);

    if (Object.keys(detalleBackend).length > 0) {
        return {
            categoriaFicha,
            detalleFicha: obtenerDetalleInicial(categoriaFicha, detalleBackend),
        };
    }

    const legacy = {
        CITA_MEDICA: {
            motivo_consulta: ficha?.motivoConsulta || ficha?.tipoAtencion || "",
            examen_clinico: ficha?.signosVitales || "",
            examen_fisico: ficha?.anamnesis || "",
            examen_mental: "",
            conclusiones_diagnosticas: ficha?.diagnostico || "",
            indicaciones: ficha?.indicaciones || "",
            derivacion: "",
            observacion_general: ficha?.anotacionConsulta || "",
            nombre_medico: ficha?.observaciones || "",
        },
        EVALUACION_KINESIOLOGIA: {
            motivo_consulta: ficha?.motivoConsulta || ficha?.tipoAtencion || "",
            examen_clinico_fisico: ficha?.anotacionConsulta || "",
            evaluacion_dolor: ficha?.signosVitales || "",
            evaluacion_fisica: ficha?.anamnesis || "",
            evaluacion_cognitiva: "",
            limitaciones: "",
            restricciones: "",
            diagnostico_kinesico: ficha?.diagnostico || "",
            objetivo_terapia: ficha?.indicaciones || "",
            derivacion: "",
            nombre_profesional: ficha?.observaciones || "",
        },
        EVALUACION_PODOLOGIA: {
            motivo_consulta: ficha?.motivoConsulta || ficha?.tipoAtencion || "",
            morfologia_podalica: ficha?.anotacionConsulta || "",
            tipo_pie: "",
            pie_derecho_reflejos: "",
            pie_derecho_sensibilidad: "",
            pie_derecho_pulso_pedio: "",
            pie_derecho_observacion: "",
            pie_izquierdo_reflejos: "",
            pie_izquierdo_sensibilidad: "",
            pie_izquierdo_pulso_pedio: "",
            pie_izquierdo_observacion: "",
            plan_tratamiento: ficha?.indicaciones || "",
            derivacion: "",
            nombre_profesional: ficha?.observaciones || "",
        },
        EVOLUCION_CONTROL: {
            observaciones: ficha?.anotacionConsulta || "",
            tratamiento: ficha?.diagnostico || "",
            indicaciones: ficha?.indicaciones || "",
            derivacion: "",
            nombre_profesional: ficha?.observaciones || "",
        },
    };

    return {
        categoriaFicha,
        detalleFicha: obtenerDetalleInicial(categoriaFicha, legacy[categoriaFicha] || {}),
    };
}

export function construirPayloadFicha(categoriaFicha, detalleFicha) {
    const categoriaLabel = obtenerLabelCategoria(categoriaFicha);

    switch (categoriaFicha) {
        case "EVALUACION_KINESIOLOGIA":
            return {
                tipoAtencion: categoriaLabel,
                motivoConsulta: detalleFicha.motivo_consulta || "",
                signosVitales: detalleFicha.evaluacion_dolor || "",
                observaciones: detalleFicha.nombre_profesional || "",
                anotacionConsulta: detalleFicha.examen_clinico_fisico || "",
                anamnesis: detalleFicha.evaluacion_fisica || "",
                diagnostico: detalleFicha.diagnostico_kinesico || "",
                indicaciones: detalleFicha.objetivo_terapia || "",
            };
        case "EVALUACION_PODOLOGIA":
            return {
                tipoAtencion: categoriaLabel,
                motivoConsulta: detalleFicha.motivo_consulta || "",
                signosVitales: detalleFicha.tipo_pie || "",
                observaciones: detalleFicha.nombre_profesional || "",
                anotacionConsulta: detalleFicha.morfologia_podalica || "",
                anamnesis: detalleFicha.plan_tratamiento || "",
                diagnostico: detalleFicha.pie_derecho_observacion || "",
                indicaciones: detalleFicha.derivacion || "",
            };
        case "EVOLUCION_CONTROL":
            return {
                tipoAtencion: categoriaLabel,
                motivoConsulta: "",
                signosVitales: "",
                observaciones: detalleFicha.nombre_profesional || "",
                anotacionConsulta: detalleFicha.observaciones || "",
                anamnesis: detalleFicha.tratamiento || "",
                diagnostico: detalleFicha.tratamiento || "",
                indicaciones: detalleFicha.indicaciones || "",
            };
        case "CITA_MEDICA":
        default:
            return {
                tipoAtencion: categoriaLabel,
                motivoConsulta: detalleFicha.motivo_consulta || "",
                signosVitales: detalleFicha.examen_fisico || "",
                observaciones: detalleFicha.nombre_medico || "",
                anotacionConsulta: detalleFicha.observacion_general || "",
                anamnesis: detalleFicha.examen_clinico || "",
                diagnostico: detalleFicha.conclusiones_diagnosticas || "",
                indicaciones: detalleFicha.indicaciones || "",
            };
    }
}

export function obtenerResumenFicha(ficha) {
    const { categoriaFicha, detalleFicha } = normalizarFichaExistente(ficha);
    const campos = FICHA_CAMPOS[categoriaFicha] || [];
    const items = campos
        .map((campo) => ({
            label: campo.label,
            value: detalleFicha[campo.key] || "",
        }))
        .filter((item) => item.value);

    return items.slice(0, 4);
}
