// src/components/AnimatedLayout.jsx
"use client";

import { motion, AnimatePresence } from "motion/react";

export function AnimatedLayout({ children }) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                // Usar la ruta como key es mejor que Math.random()
                key={typeof window !== "undefined" ? window.location.pathname : ""}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}