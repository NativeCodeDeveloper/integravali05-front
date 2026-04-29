"use client";

import {Textarea} from "@/components/ui/textarea";
import {ShadcnInput} from "@/Componentes/shadcnInput";
import {FICHA_CAMPOS} from "@/lib/fichaClinicaConfig";

export default function FichaClinicaCamposDinamicos({categoriaFicha, detalleFicha, onChange}) {
    const campos = FICHA_CAMPOS[categoriaFicha] || [];

    if (campos.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {campos.map((campo) => (
                <div key={campo.key} className={campo.type === "textarea" ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {campo.label}
                    </label>
                    {campo.type === "textarea" ? (
                        <Textarea
                            value={detalleFicha[campo.key] || ""}
                            onChange={(e) => onChange(campo.key, e.target.value)}
                            className="min-h-[100px] resize-y border-slate-300 focus:border-sky-500 focus:ring-sky-500/20"
                        />
                    ) : (
                        <ShadcnInput
                            value={detalleFicha[campo.key] || ""}
                            onChange={(e) => onChange(campo.key, e.target.value)}
                            className="border-slate-300 focus:border-sky-500"
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
