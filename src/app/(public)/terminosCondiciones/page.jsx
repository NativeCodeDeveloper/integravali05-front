const sections = [
  {
    title: "1. Identificacion del prestador",
    body: [
      "SaludB presta servicios de salud integral a domicilio en la Region Metropolitana de Chile.",
      "Canales oficiales de contacto: Contacto@saludb.cl, WhatsApp +56 9 8527 8325, Instagram @saludb.cl y sitio web www.saludb.cl.",
    ],
  },
  {
    title: "2. Alcance de los servicios",
    body: [
      "Nuestros servicios incluyen kinesiologia, terapia ocupacional, fonoaudiologia, medicina general, geriatria, enfermeria, TENS, cuidadores, podologia y arriendo de productos de salud.",
      "Cada plan de atencion se adapta al estado clinico, funcional y contexto familiar de cada paciente.",
    ],
  },
  {
    title: "3. Reserva, cambios y asistencia",
    body: [
      "Las reservas y coordinaciones se gestionan por canales oficiales y segun disponibilidad profesional.",
      "Para reagendar o cancelar una visita solicitamos aviso con al menos 24 horas de anticipacion.",
      "La continuidad del servicio depende de la correcta coordinacion entre paciente, familia y equipo tratante.",
    ],
  },
  {
    title: "4. Modelo de atencion coordinada",
    body: [
      "SaludB trabaja con enfoque interdisciplinario, integrando distintas areas clinicas dentro de un plan comun.",
      "El objetivo es evitar intervenciones aisladas y asegurar coherencia en el proceso terapeutico.",
    ],
  },
  {
    title: "5. Evaluacion y plan personalizado",
    body: [
      "Antes de iniciar prestaciones, se realiza una evaluacion para definir pertinencia clinica, objetivos y frecuencia de intervencion.",
      "Los resultados pueden variar segun condiciones individuales, adherencia y contexto del paciente.",
    ],
  },
  {
    title: "6. Pagos y comprobantes",
    body: [
      "Los valores y modalidades de pago vigentes se informan al momento de coordinar cada servicio.",
      "Los comprobantes correspondientes se emiten conforme a la normativa tributaria chilena aplicable.",
    ],
  },
  {
    title: "7. Privacidad y datos personales",
    body: [
      "Los datos de pacientes y familias se utilizan exclusivamente para coordinacion asistencial, seguimiento clinico y cumplimiento legal.",
      "SaludB adopta medidas razonables de confidencialidad y resguardo conforme a la normativa vigente.",
      "Puedes solicitar actualizacion o eliminacion de datos en Contacto@saludb.cl.",
    ],
  },
  {
    title: "8. Propiedad intelectual",
    body: [
      "Los contenidos del sitio, incluyendo textos, imagenes e identidad visual, son de uso exclusivo de SaludB o sus titulares.",
      "No esta permitido copiar, reproducir o distribuir contenido sin autorizacion previa y por escrito.",
    ],
  },
  {
    title: "9. Modificaciones y vigencia",
    body: [
      "SaludB puede actualizar estos terminos para reflejar cambios operativos, legales o de servicio.",
      "La version publicada en esta pagina es la vigente y reemplaza versiones anteriores.",
    ],
  },
  {
    title: "10. Legislacion aplicable",
    body: [
      "Estos terminos se interpretan conforme a las leyes de la Republica de Chile.",
      "Cualquier controversia sera conocida por los tribunales competentes en Chile.",
    ],
  },
];

export default function TerminosYCondiciones() {
  return (
    <main className="bg-transparent text-[#fff4ee]">
      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(248,211,216,0.2),transparent_34%),radial-gradient(circle_at_90%_2%,rgba(230,185,121,0.16),transparent_40%)]" />

        <div className="relative mx-auto w-full max-w-5xl px-6 md:px-10 xl:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f1d8cb]/74">
            SaludB
          </p>
          <h1 className="mt-4 text-4xl leading-tight text-[#fff1e8] sm:text-5xl">
            Terminos y Condiciones
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#f6dfd4]/82 sm:text-base">
            Documento informativo sobre el uso del sitio, coordinacion de servicios domiciliarios y condiciones generales de atencion.
            Ultima actualizacion: abril de 2026.
          </p>

          <div className="mt-10 space-y-5">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-[#f2d4c7]/14 bg-[linear-gradient(160deg,rgba(64,38,33,0.58)_0%,rgba(24,14,12,0.9)_100%)] p-6 sm:p-7"
              >
                <h2 className="text-lg font-medium text-[#fff0e6] sm:text-xl">{section.title}</h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-[#f6dfd4]/80 sm:text-[15px]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
