"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Michroma } from "next/font/google";
import { motion } from "framer-motion";
import OrbBackground from "@/components/OrbBackground";

const michroma = Michroma({ weight: "400", subsets: ["latin"], display: "swap" });

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
};

const highlights = [
  "Agenda inteligente",
  "Fichas clinicas",
  "Recordatorios automaticos",
];

const trustItems = [
  { value: "99.9%", label: "Disponibilidad" },
  { value: "256", label: "Bit encryption" },
  { value: "24/7", label: "Soporte" },
];

export default function Page() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isLoaded) {
    return (
      <main className="grid min-h-screen place-items-center bg-white">
        <div className="text-sm text-slate-400">Cargando...</div>
      </main>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Se requiere un factor adicional para completar el ingreso.");
      }
    } catch (err) {
      const msg =
        err?.errors?.[0]?.message ||
        "No pudimos iniciar sesion. Revisa tus datos e intentalo nuevamente.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOAuth(provider) {
    setError("");
    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      const msg =
        err?.errors?.[0]?.message || "No fue posible continuar con el proveedor.";
      setError(msg);
    }
  }

  return (
    <OrbBackground orbX={0.72} orbY={0.44}>
      <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="AgendaClinica"
                className="h-20 w-28 object-contain object-left shrink-0"
              />
              <div>
                <p className={michroma.className + " text-[13px] text-slate-900"}>AgendaClinica</p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Healthcare OS</p>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3.5 py-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:flex">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] text-slate-500">Cloud clinical operating system</span>
            </div>
          </motion.div>

          <div className="grid flex-1 items-center gap-8 lg:grid-cols-[1fr_0.92fr] lg:gap-12">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="max-w-xl"
            >
              <div className="mb-4 inline-flex items-center rounded-full border border-cyan-100 bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-700 shadow-sm">
                Healthcare Information System
              </div>

              <h1 className={michroma.className + " text-[2rem] leading-[1.08] text-slate-900 sm:text-[2.4rem] lg:text-[3rem]"}>
                <span className="bg-gradient-to-r from-cyan-700 via-cyan-600 to-indigo-700 bg-clip-text text-transparent">
                  AgendaClinica
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-[14px] leading-6 text-slate-600">
                Acceso al sistema
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {highlights.map((item, index) => (
                  <motion.div
                    key={item}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={1.5 + index * 0.2}
                    className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-medium text-slate-600 shadow-sm"
                  >
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    {item}
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 grid max-w-lg grid-cols-3 gap-2.5">
                {trustItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={2 + index * 0.2}
                    className="rounded-2xl border border-slate-200 bg-white/80 px-3.5 py-3.5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                  >
                    <div className="text-lg font-bold text-slate-900">{item.value}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2.2}
              className="w-full lg:justify-self-end"
            >
              <div className="rounded-[1.75rem] border border-white/70 bg-white/88 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-6">
                <div className="mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">Acceso seguro</p>
                  <h2 className={michroma.className + " mt-2.5 text-[18px] text-slate-900"}>Iniciar sesion</h2>
                  <p className="mt-1.5 text-[12px] text-slate-500">Accede a tu panel de administracion clinica.</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOAuth("google")}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[12px] font-medium text-slate-700 transition-all hover:border-cyan-200 hover:bg-white hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] active:scale-[0.99]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.5 0 19.5-7.6 21-18v-6.5z" />
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.8 16.1 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 16.1 3 9.2 7.4 6.3 14.7z" />
                    <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.1C29.3 35 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.4 5C9.1 41.7 16 45 24 45z" />
                    <path fill="#1976D2" d="M45 24c0-1.4-.1-2.4-.4-3.5H24v8h11.3c-.5 2.6-2 4.8-4.1 6.3l6.2 5.1C40.7 37.4 45 31.4 45 24z" />
                  </svg>
                  Continuar con Google
                </button>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[11px] text-slate-400">o</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-slate-500" htmlFor="email">
                      Correo electronico
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-cyan-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,211,238,0.10)]"
                      placeholder="tu@correo.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] text-slate-500" htmlFor="password">
                      Contrasena
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-cyan-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,211,238,0.10)]"
                      placeholder="••••••••"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3">
                      <p className="text-[12px] text-red-600">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 h-10 w-full rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-700 text-[12px] font-semibold text-white shadow-[0_18px_40px_rgba(14,165,233,0.28)] transition-all hover:from-cyan-500 hover:to-indigo-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Ingresando...
                      </span>
                    ) : (
                      "Ingresar"
                    )}
                  </button>
                </form>

                <div className="mt-5 border-t border-slate-200 pt-4">
                  <p className="text-center text-[11px] text-slate-400">
                    Sin acceso? Contacta al administrador de tu clinica.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-400 lg:justify-start">
                <div className="flex items-center gap-1.5">
                  <svg className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  <span>SSL Secured</span>
                </div>
                <div className="hidden h-3 w-px bg-slate-200 sm:block" />
                <div className="flex items-center gap-1.5">
                  <svg className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
                  <span>HIPAA Ready</span>
                </div>
                <div className="hidden h-3 w-px bg-slate-200 sm:block" />
                <div className="flex items-center gap-1.5">
                  <svg className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  <span>Encrypted</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2.8}
            className="mt-6 flex items-center justify-between text-[10px] text-slate-400"
          >
            <span>AgendaClinica v2.0</span>
            <span>Powered by NativeCode</span>
          </motion.div>
        </div>
      </div>
    </OrbBackground>
  );
}
