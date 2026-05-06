
/*

// frontend/src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'

// Middleware sin lógica — solo deja pasar todo
export default function middleware(_req: NextRequest) {
return NextResponse.next()
}

// (Opcional) Indica en qué rutas se ejecuta
export const config = {
matcher: ['/dashboard/:path*'], // o simplemente [] si quieres que no aplique a ninguna
}



*/





import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'

const isDashboard = createRouteMatcher(['/dashboard(.*)'])
const isSignIn = createRouteMatcher(['/sign-in(.*)'])

// Rutas permitidas para recepcionista: inicio + módulo calendario completo
const isRecepcionistaAllowed = createRouteMatcher([
    '/dashboard',
    '/dashboard/no-access',
    '/dashboard/calendarioGeneral',
    '/dashboard/calendario',
    '/dashboard/agendaCitas',
    '/dashboard/bloqueosAgenda',
    '/dashboard/AgendaDetalle/(.*)',
    '/dashboard/GestionPaciente',
    '/dashboard/paciente/(.*)',
])

const isBasicoRestricted = createRouteMatcher([
    '/dashboard/profesionales',
    '/dashboard/serviciosAgendamiento',
    '/dashboard/tarifaServicio',
    '/dashboard/fichasClinicasPlantillas',
    '/dashboard/fichasClinicasCategorias/(.*)',
    '/dashboard/fichaCampo/(.*)',
])

function getRoleFromSessionClaims(sessionClaims: unknown) {
    const claims = (sessionClaims ?? {}) as {
        metadata?: { role?: string }
        publicMetadata?: { role?: string }
        public_metadata?: { role?: string }
        role?: string
    }

    return (
        claims.metadata?.role ??
        claims.publicMetadata?.role ??
        claims.public_metadata?.role ??
        claims.role
    )
}

// Handler de Clerk separado para poder envolverlo en try-catch
const clerkHandler = clerkMiddleware(async (auth, req) => {
    try {
        const { userId, sessionClaims } = await auth()

        if (isSignIn(req) && userId) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        if (!isDashboard(req)) return NextResponse.next()

        if (!userId) {
            return NextResponse.redirect(new URL('/sign-in', req.url))
        }

        // Leer rol desde publicMetadata (configurado en Clerk Dashboard)
        const role = getRoleFromSessionClaims(sessionClaims)

        // Recepcionista → solo accede a inicio + calendario, el resto → no-access
        if (role === 'recepcionista' && !isRecepcionistaAllowed(req)) {
            return NextResponse.redirect(new URL('/dashboard/no-access', req.url))
        }

        // Basico → sin acceso a configuraciones
        if (role === 'basico' && isBasicoRestricted(req)) {
            return NextResponse.redirect(new URL('/dashboard/no-access', req.url))
        }

        return NextResponse.next()
    } catch (authError) {
        // auth() falló — cookies __client_uat conflictivas de otro subdominio
        console.error('[middleware] auth() failed (cookie conflict):', authError)
        if (isDashboard(req)) {
            return NextResponse.redirect(new URL('/sign-in', req.url))
        }
        return NextResponse.next()
    }
})

// Wrapper: captura errores cuando clerkMiddleware crashea por cookies
// de múltiples instancias Clerk en *.agendaclinicas.cl
export default async function middleware(req: NextRequest, event: NextFetchEvent) {
    try {
        return await clerkHandler(req, event)
    } catch (error) {
        console.error('[middleware] Clerk crashed (cookie conflict between subdomains):', error)
        if (isDashboard(req)) {
            return NextResponse.redirect(new URL('/sign-in', req.url))
        }
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        // Todas las rutas excepto archivos estáticos e internos de Next.js
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}
