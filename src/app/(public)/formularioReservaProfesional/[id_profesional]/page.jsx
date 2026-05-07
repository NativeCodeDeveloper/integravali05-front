"use client"
import {useEffect, useState} from "react";
import ShadcnInput from "@/Componentes/shadcnInput2";
import ShadcnButton2 from "@/Componentes/shadcnButton2";
import {useAgenda} from "@/ContextosGlobales/AgendaContext";
import {toast} from "react-hot-toast";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {SelectDinamic} from "@/Componentes/SelectDinamic";

export default function FormularioReservaProfesional() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [nombrePaciente, setNombrePaciente] = useState("");
    const [apellidoPaciente, setApellidoPaciente] = useState("");
    const [rut, setRut] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const {
        horaInicio,
        horaFin,
        fechaInicio,
        fechaFinalizacion,
        setHoraInicio,
        setHoraFin,
        setFechaInicio,
        setFechaFinalizacion
    } = useAgenda();
    const [listaTarifasProfesionales, setListaTarifasProfesionales] = useState([]);

    const [profesionalSeleccionado, setProfesionalSeleccionado] = useState("");
    const [servicioSeleccionado, setServicioSeleccionado] = useState("");
    const [tarifaSeleccionadaIndex, setTarifaSeleccionadaIndex] = useState("");
    const[descripcionProfesional, setDescripcionProfesional] = useState("");

    const {id_profesional} = useParams();
    const searchParams = useSearchParams();

    const [totalPago, setTotalPago] = useState("");
    const [procesandoPago, setProcesandoPago] = useState(false);
    const router = useRouter();

    async function seleccionarProfesionalDatos(id_profesional) {
        try {
            const res = await fetch(`${API}/profesionales/seleccionarProfesional`, {
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json',},
                mode: 'cors',
                body: JSON.stringify({id_profesional}),
            })

            if (!res.ok) {
                return toast.error('Error al cargar los Tarifas y Servicios Profesionales, por favor intente nuevamente.');
            }else{

                const respustaBackend = await res.json();
                if(respustaBackend){
                    setProfesionalSeleccionado(respustaBackend[0].nombreProfesional);
                    setDescripcionProfesional(respustaBackend[0].descripcionProfesional);
                }else{
                    return toast.error('Error al cargar los Tarifas y Servicios Profesionales, por favor intente nuevamente .');
                }
            }
        }catch (error) {

            return toast.error('Error al cargar los tarifas y Servicios Profesionales, por favor intente nuevamente.');
        }
    }



    async function seleccionarTodasTarifasProfesionales(profesional_id) {
        try {
            const res = await fetch(`${API}/tarifasProfesional/seleccionarTarifasPorProfesional`, {
                method: 'POST',
                headers: {Accept: 'application/json',
                'Content-Type': 'application/json',},
                mode: 'cors',
                body: JSON.stringify({profesional_id}),
            })

            if (!res.ok) {
                return toast.error('Error al cargar los Tarifas y Servicios Profesionales, por favor intente nuevamente.');
            }else{

                const respustaBackend = await res.json();
                if(respustaBackend){
                    setListaTarifasProfesionales(respustaBackend);

                }else{
                    return toast.error('Error al cargar los Tarifas y Servicios Profesionales, por favor intente nuevamente .');
                }
            }
        }catch (error) {

            return toast.error('Error al cargar los tarifas y Servicios Profesionales, por favor intente nuevamente.');
        }
    }

    useEffect(() => {
        seleccionarTodasTarifasProfesionales(id_profesional);
        seleccionarProfesionalDatos(id_profesional)
    }, [id_profesional]);

    useEffect(() => {
        const fechaUrl = searchParams.get("fecha") ?? "";
        const horaUrl = searchParams.get("hora") ?? "";
        const horaFinUrl = searchParams.get("horaFin") ?? "";

        if (fechaUrl && !fechaInicio) {
            setFechaInicio(fechaUrl);
        }

        if (fechaUrl && !fechaFinalizacion) {
            setFechaFinalizacion(fechaUrl);
        }

        if (horaUrl && !horaInicio) {
            setHoraInicio(horaUrl);
        }

        if (horaFinUrl && !horaFin) {
            setHoraFin(horaFinUrl);
        }
    }, [
        searchParams,
        fechaInicio,
        fechaFinalizacion,
        horaInicio,
        horaFin,
        setFechaInicio,
        setFechaFinalizacion,
        setHoraInicio,
        setHoraFin
    ]);

    function normalizarRut(valor = "") {
        return String(valor).replace(/[^0-9kK]/g, "").toUpperCase();
    }

    function formatearRut(rut = "") {
        const rutNormalizado = normalizarRut(rut);

        if (rutNormalizado.length < 2) {
            return rutNormalizado;
        }

        const cuerpo = rutNormalizado.slice(0, -1);
        const dv = rutNormalizado.slice(-1);
        const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        return `${cuerpoConPuntos}-${dv}`;
    }

    function normalizarCorreoOpcional(valor = "") {
        const correo = String(valor ?? "").trim();
        return correo || null;
    }

    async function buscarPacientesPorRut(rutPaciente) {
        const rutNormalizado = normalizarRut(rutPaciente);
        const rutFormateado = formatearRut(rutNormalizado);
        const variantes = [...new Set([rutPaciente, rutNormalizado, rutFormateado].filter(Boolean))];
        const resultados = [];

        for (const variante of variantes) {
            const res = await fetch(`${API}/pacientes/contieneRut`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                mode: "cors",
                body: JSON.stringify({rut: variante})
            });

            if (!res.ok) {
                continue;
            }

            const coincidencias = await res.json().catch(() => []);
            if (Array.isArray(coincidencias)) {
                resultados.push(...coincidencias);
            }
        }

        return resultados;
    }

    function crearFechaReserva(fecha, hora) {
        return new Date(`${fecha}T${hora}`);
    }

    function obtenerToastDatosFaltantes() {
        if (!fechaInicio || !horaInicio || !fechaFinalizacion || !horaFin) {
            return "Asegurese de que la fecha y la hora esten seleccionadas antes de continuar.";
        }

        return "Debe completar todos los datos para continuar.";
    }

    async function asegurarPacienteAgendamiento(nombrePaciente, apellidoPaciente, rut, telefono, email) {
        try {
            const nombre = (nombrePaciente ?? "").trim();
            const apellido = (apellidoPaciente ?? "").trim();
            const rutPaciente = (rut ?? "").trim();
            const rutNormalizado = normalizarRut(rutPaciente);
            const telefonoPaciente = (telefono ?? "").trim();
            const correoPaciente = normalizarCorreoOpcional(email);

            if (!nombre || !apellido || !rutNormalizado || !telefonoPaciente) {
                toast.error("Debe completar nombre, apellido, RUT y telefono para continuar.");
                return {ok: false, creado: false, existente: false, rut: rutNormalizado};
            }

            const coincidencias = await buscarPacientesPorRut(rutNormalizado);
            const pacienteExistente = Array.isArray(coincidencias) && coincidencias.some(
                (paciente) => normalizarRut(paciente.rut) === rutNormalizado
            );

            if (pacienteExistente) {
                return {ok: true, creado: false, existente: true, rut: rutNormalizado};
            }

            const res = await fetch(`${API}/pacientes/pacientesInsercion`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                mode: "cors",
                body: JSON.stringify({
                    nombre,
                    apellido,
                    rut: rutNormalizado,
                    nacimiento: "1900-01-01",
                    sexo: "No especifica",
                    prevision_id: 1,
                    telefono: telefonoPaciente,
                    correo: correoPaciente,
                    direccion: "Por completar",
                    pais: "Chile",
                    observacion1: "Creado desde formulario publico",
                    observacion2: "NO ESPECIFICADO",
                    observacion3: "NO ESPECIFICADO",
                    apoderado: "NO ESPECIFICADO",
                    apoderado_rut: "NO ESPECIFICADO",
                    medicamentosUsados: "NO ESPECIFICADO",
                    habitos: "NO ESPECIFICADO",
                    comentariosAdicionales: "Paciente ingresado automaticamente desde agendamiento publico"
                })
            });

            if (!res.ok) {
                toast.error("No se pudo registrar el paciente para continuar con el agendamiento.");
                return {ok: false, creado: false, existente: false, rut: rutNormalizado};
            }

            const respuestaBackend = await res.json().catch(() => null);

            if (respuestaBackend?.message === true || respuestaBackend?.message === "duplicado") {
                return {
                    ok: true,
                    creado: respuestaBackend?.message === true,
                    existente: respuestaBackend?.message === "duplicado",
                    rut: rutNormalizado
                };
            }

            toast.error("No se pudo registrar el paciente para continuar con el agendamiento.");
            return {ok: false, creado: false, existente: false, rut: rutNormalizado};
        } catch (error) {
            console.error(error);
            toast.error("Ocurrio un problema al registrar el paciente.");
            return {ok: false, creado: false, existente: false, rut: normalizarRut(rut)};
        }
    }


    function comprobanteAgendamiento() {
        setNombrePaciente("");
        setApellidoPaciente("");
        setDescripcionProfesional("");
        setRut("");
        setTelefono("");
        setEmail("");
        router.push(`/reserva-hora?fecha=${fechaInicio}&hora=${horaInicio}`);
    }




    async function agendarSinPago(
        nombrePaciente,
        apellidoPaciente,
        rut,
        telefono,
        email,
        fechaInicio,
        horaInicio,
        fechaFinalizacion,
        horaFinalizacion,
        id_profesional
    ){
        try {
            setProcesandoPago(true);

            const rutNormalizado = normalizarRut(rut);
            const correoPaciente = normalizarCorreoOpcional(email);

            if (!nombrePaciente || !apellidoPaciente || !rutNormalizado || !telefono || !email || !fechaInicio || !horaInicio || !horaFinalizacion || !id_profesional) {
                toast.error(obtenerToastDatosFaltantes());
                return false;
            }

            const inicioReserva = crearFechaReserva(fechaInicio, horaInicio);
            if (inicioReserva <= new Date()) {
                toast.error("No es posible agendar en horarios pasados o en la hora actual.");
                return false;
            }

            const resultadoPaciente = await asegurarPacienteAgendamiento(
                nombrePaciente,
                apellidoPaciente,
                rutNormalizado,
                telefono,
                correoPaciente
            );

            if (!resultadoPaciente.ok) {
                return false;
            }

            const res = await fetch(`${API}/reservaPacientes/insertarReservaPacienteFicha`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({
                    nombrePaciente,
                    apellidoPaciente,
                    rut: resultadoPaciente.rut,
                    telefono,
                    email: correoPaciente,
                    fechaInicio,
                    horaInicio,
                    fechaFinalizacion,
                    horaFinalizacion,
                    estadoReserva: "reservada" ,
                    id_profesional})
            });

            if (!res.ok) return toast.error('Hubo un problema, intente agendar por otro medio');

            const respuestaBackend = await res.json();

            if(respuestaBackend.message === true){
                comprobanteAgendamiento();
                return toast.success('Cita Agendada');
            }

            if (respuestaBackend.message === "conflicto") {
                return toast.error("El horario seleccionado ya no se encuentra disponible.");
            }

            return toast.error('Hubo un problema, intente agendar por otro medio');
        }catch (error) {
            return toast.error('Hubo un problema, intente agendar por otro medio');
        } finally {
            setProcesandoPago(false);
        }
    }

    const formatoCLP = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });




    function volver(id_profesional) {
        router.push(`/agendaEspecificaProfersional/${id_profesional}`);
    }

    return (
        <div className="min-h-screen bg-[#f5f7f6] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">

                {/* Header */}
                <header className="animate-reveal-up mb-10 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#C1D9D3] bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-[#5F8580] shadow-sm">
                        Reserva Online
                    </div>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#1F4A4A] sm:text-4xl">
                        {profesionalSeleccionado || "Cargando..."}
                    </h1>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#507070]">
                        {descripcionProfesional}
                    </p>
                    <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-[#5AACA8]/50 to-transparent"></div>
                </header>

                <form
                    className="animate-reveal-up-delay space-y-8 rounded-2xl border border-[#C1D9D3] bg-white/90 p-6 shadow-lg shadow-[#2D5E5E]/5 backdrop-blur sm:p-8"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    {/* Servicio */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6A8E88]">Servicio</h2>
                        <div className="mt-1 h-px w-full bg-gradient-to-r from-[#C1D9D3] via-[#D5EDE9] to-transparent"></div>
                        <div className="mt-4">
                            <label className="mb-1.5 block text-xs font-semibold text-[#2D5E5E]">Motivo de consulta</label>
                            <SelectDinamic
                                value={tarifaSeleccionadaIndex}
                                onChange={(e) => {
                                    const index = e.target.value;
                                    setTarifaSeleccionadaIndex(index);
                                    const tarifa = listaTarifasProfesionales[index];
                                    if (tarifa) {
                                        setTotalPago(tarifa.precio);
                                        setServicioSeleccionado(tarifa.nombreServicio);
                                    }
                                }}
                                placeholder="Seleccione un servicio"
                                options={listaTarifasProfesionales.map((tarifa, index) => ({
                                    value: index,
                                    label: `${tarifa.nombreServicio} - ${formatoCLP.format(tarifa.precio)}`
                                }))}
                                className={tarifaSeleccionadaIndex !== "" ? "border-[#5AACA8] bg-[#EFF7F6] font-medium text-[#1F4A4A]" : ""}
                            />
                        </div>
                    </div>

                    {/* Datos personales */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6A8E88]">Datos personales</h2>
                        <div className="mt-1 h-px w-full bg-gradient-to-r from-[#C1D9D3] via-[#D5EDE9] to-transparent"></div>
                        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#2D5E5E]">Nombre</label>
                                <ShadcnInput
                                    value={nombrePaciente}
                                    onChange={(e) => setNombrePaciente(e.target.value)}
                                    placeholder="Ej: Ana"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#2D5E5E]">Apellido</label>
                                <ShadcnInput
                                    value={apellidoPaciente}
                                    onChange={(e) => setApellidoPaciente(e.target.value)}
                                    placeholder="Ej: Pérez"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#2D5E5E]">RUT</label>
                                <ShadcnInput
                                    value={rut}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                                        setRut(value);
                                    }}
                                    placeholder="12345678K (Sin puntos ni guion)"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#2D5E5E]">Correo electrónico</label>
                                <ShadcnInput
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ejemplo@correo.cl"
                                    className="w-full"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-xs font-semibold text-[#2D5E5E]">Teléfono</label>
                                <ShadcnInput
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    placeholder="+56 9 1234 5678"
                                    className="w-full sm:max-w-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resumen */}
                    {(fechaInicio || horaInicio || totalPago) && (
                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6A8E88]">Resumen de tu cita</h2>
                            <div className="mt-1 h-px w-full bg-gradient-to-r from-[#C1D9D3] via-[#D5EDE9] to-transparent"></div>
                            <div className="mt-4 rounded-xl border border-[#D5EDE9] bg-[#F2F8F6] p-4">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {fechaInicio && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3D7B7B] text-xs text-white">D</div>
                                            <div>
                                                <p className="text-[11px] font-medium uppercase tracking-wider text-[#6A8E88]">Fecha</p>
                                                <p className="text-sm font-semibold text-[#1F4A4A]">{fechaInicio.toString()}</p>
                                            </div>
                                        </div>
                                    )}
                                    {horaInicio && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3D7B7B] text-xs text-white">H</div>
                                            <div>
                                                <p className="text-[11px] font-medium uppercase tracking-wider text-[#6A8E88]">Horario</p>
                                                <p className="text-sm font-semibold text-[#1F4A4A]">{horaInicio.toString()} – {horaFin.toString()}</p>
                                            </div>
                                        </div>
                                    )}
                                    {totalPago && (
                                        <div className="flex items-center gap-3 sm:col-span-2">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#5AACA8] text-xs font-bold text-white">$</div>
                                            <div>
                                                <p className="text-[11px] font-medium uppercase tracking-wider text-[#6A8E88]">Valor consulta</p>
                                                <p className="text-sm font-bold text-[#3D7B7B]">{formatoCLP.format(totalPago)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Acciones */}
                    <div className="flex flex-col-reverse gap-3 border-t border-[#D5EDE9] pt-6 sm:flex-row sm:justify-end">

                            <ShadcnButton2 nombre={"RETROCEDER"} funcion={()=>volver(id_profesional)}/>

                        <ShadcnButton2
                            nombre={procesandoPago ? "AGENDANDO..." : "FINALIZAR AGENDAMIENTO"}
                            funcion={(e) => {
                                if (e?.preventDefault) e.preventDefault();
                                if (e?.stopPropagation) e.stopPropagation();

                                if (procesandoPago) return;

                                return agendarSinPago(
                                    nombrePaciente,
                                    apellidoPaciente,
                                    rut,
                                    telefono,
                                    email,
                                    fechaInicio,
                                    horaInicio,
                                    fechaFinalizacion,
                                    horaFin,
                                    id_profesional
                                );
                            }}
                        />
                    </div>
                </form>

                <p className="mt-6 text-center text-xs text-[#6A8E88]">
                    Revisa que los datos sean correctos antes de confirmar tu reserva.
                </p>

            </div>
        </div>
    )
}
