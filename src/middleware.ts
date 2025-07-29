import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization') || ''

  const isProtected = request.nextUrl.pathname.startsWith('/assessment') || request.nextUrl.pathname.startsWith('/records')

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}
export const config = {
  matcher: [
    '/assessment/:path*',
    '/records/:path*'
  ]
}
