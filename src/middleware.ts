
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

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  if (isSignIn(req) && userId) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!isDashboard(req)) return NextResponse.next()

  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  // Leer rol desde publicMetadata (configurado en Clerk Dashboard)
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role

  // Recepcionista → solo accede a inicio + calendario, el resto → no-access
  if (role === 'recepcionista' && !isRecepcionistaAllowed(req)) {
    return NextResponse.redirect(new URL('/dashboard/no-access', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in/:path*'],
}



